-- Storellet Snake Game - Supabase schema
-- Run this file in Supabase SQL Editor.
-- It creates exactly two public tables: players and game_sessions.

create extension if not exists pgcrypto;

create table if not exists public.players (
    id uuid primary key references auth.users(id) on delete cascade,
    points_balance integer not null default 0 check (points_balance >= 0),
    daily_attempt_date date not null default current_date,
    daily_attempts integer not null default 0 check (daily_attempts between 0 and 3),
    best_score integer not null default 0 check (best_score >= 0),
    total_games integer not null default 0 check (total_games >= 0),
    total_score bigint not null default 0 check (total_score >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
    id uuid primary key default gen_random_uuid(),
    player_id uuid not null references public.players(id) on delete cascade,
    client_session_id text not null,
    status text not null default 'STARTED' check (status in ('STARTED','PAUSED','FINISHED','CANCELLED')),
    attempt_no integer not null check (attempt_no between 1 and 3),
    points_charged integer not null default 0 check (points_charged >= 0),
    platform text,
    app_version text,
    score integer check (score is null or score between 0 and 99999),
    duration_ms integer check (duration_ms is null or duration_ms between 0 and 1200000),
    end_reason text,
    reward_code text,
    reward_status text,
    client_event_id text,
    started_at timestamptz not null default now(),
    paused_at timestamptz,
    total_paused_ms bigint not null default 0 check (total_paused_ms >= 0),
    finished_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (player_id, client_session_id)
);

create index if not exists game_sessions_player_started_idx
    on public.game_sessions (player_id, started_at desc);
create index if not exists game_sessions_status_idx
    on public.game_sessions (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists game_sessions_set_updated_at on public.game_sessions;
create trigger game_sessions_set_updated_at
before update on public.game_sessions
for each row execute function public.set_updated_at();

alter table public.players enable row level security;
alter table public.game_sessions enable row level security;

create policy "Players can read their own record"
on public.players for select
to authenticated
using (id = auth.uid());

create policy "Players can read their own sessions"
on public.game_sessions for select
to authenticated
using (player_id = auth.uid());

-- Direct writes are intentionally handled through SECURITY DEFINER RPC functions.

create or replace function public.start_game_session(
    p_client_session_id text,
    p_platform text default null,
    p_app_version text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_player public.players%rowtype;
    v_attempt integer;
    v_cost integer;
    v_session_id uuid;
begin
    if auth.uid() is null then
        raise exception 'AUTHENTICATION_REQUIRED';
    end if;

    insert into public.players (id)
    values (auth.uid())
    on conflict (id) do nothing;

    select * into v_player
    from public.players
    where id = auth.uid()
    for update;

    if v_player.daily_attempt_date <> current_date then
        update public.players
        set daily_attempt_date = current_date,
            daily_attempts = 0
        where id = auth.uid()
        returning * into v_player;
    end if;

    if v_player.daily_attempts >= 3 then
        raise exception 'DAILY_ATTEMPT_LIMIT';
    end if;

    v_attempt := v_player.daily_attempts + 1;
    v_cost := case when v_attempt = 1 then 0 else 10 end;

    if v_player.points_balance < v_cost then
        raise exception 'INSUFFICIENT_POINTS';
    end if;

    update public.players
    set daily_attempts = v_attempt,
        points_balance = points_balance - v_cost
    where id = auth.uid();

    insert into public.game_sessions (
        player_id, client_session_id, status, attempt_no,
        points_charged, platform, app_version
    ) values (
        auth.uid(), p_client_session_id, 'STARTED', v_attempt,
        v_cost, p_platform, p_app_version
    )
    returning id into v_session_id;

    return jsonb_build_object(
        'sessionId', v_session_id,
        'attemptNo', v_attempt,
        'pointsCharged', v_cost,
        'status', 'STARTED'
    );
exception
    when unique_violation then
        select id into v_session_id
        from public.game_sessions
        where player_id = auth.uid()
          and client_session_id = p_client_session_id;
        return jsonb_build_object(
            'sessionId', v_session_id,
            'status', 'STARTED',
            'idempotentReplay', true
        );
end;
$$;

create or replace function public.pause_game_session(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.game_sessions
    set status = 'PAUSED', paused_at = now()
    where id = p_session_id
      and player_id = auth.uid()
      and status = 'STARTED';

    if not found then raise exception 'SESSION_NOT_ACTIVE'; end if;
    return jsonb_build_object('sessionId', p_session_id, 'status', 'PAUSED');
end;
$$;

create or replace function public.resume_game_session(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_total bigint;
begin
    update public.game_sessions
    set total_paused_ms = total_paused_ms + greatest(0, floor(extract(epoch from (now() - paused_at)) * 1000))::bigint,
        paused_at = null,
        status = 'STARTED'
    where id = p_session_id
      and player_id = auth.uid()
      and status = 'PAUSED'
    returning total_paused_ms into v_total;

    if not found then raise exception 'SESSION_NOT_PAUSED'; end if;
    return jsonb_build_object('sessionId', p_session_id, 'status', 'STARTED', 'totalPausedMs', v_total);
end;
$$;

create or replace function public.finish_game_session(
    p_session_id uuid,
    p_score integer,
    p_duration_ms integer,
    p_end_reason text,
    p_client_event_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_session public.game_sessions%rowtype;
    v_reward_code text;
    v_reward_message text;
begin
    if p_score < 0 or p_score > 99999 then raise exception 'INVALID_SCORE'; end if;
    if p_duration_ms < 0 or p_duration_ms > 1200000 then raise exception 'INVALID_DURATION'; end if;

    select * into v_session
    from public.game_sessions
    where id = p_session_id and player_id = auth.uid()
    for update;

    if not found then raise exception 'SESSION_NOT_FOUND'; end if;

    if v_session.status = 'FINISHED' then
        return jsonb_build_object(
            'sessionId', v_session.id,
            'status', v_session.status,
            'score', v_session.score,
            'idempotentReplay', true,
            'reward', jsonb_build_object(
                'code', v_session.reward_code,
                'status', v_session.reward_status
            )
        );
    end if;

    if p_score >= 50 then
        v_reward_code := 'WN_50_5';
        v_reward_message := '達到 50 分：消費滿 $50 減 $5 現金優惠券';
    elsif p_score >= 30 then
        v_reward_code := 'WN_50_3';
        v_reward_message := '達到 30 分：消費滿 $50 減 $3 現金優惠券';
    elsif p_score >= 15 then
        v_reward_code := 'WN_50_2';
        v_reward_message := '達到 15 分：消費滿 $50 減 $2 現金優惠券';
    else
        v_reward_code := null;
        v_reward_message := '未達到 15 分優惠券門檻。';
    end if;

    update public.game_sessions
    set status = 'FINISHED',
        score = p_score,
        duration_ms = p_duration_ms,
        end_reason = p_end_reason,
        client_event_id = p_client_event_id,
        reward_code = v_reward_code,
        reward_status = case when v_reward_code is null then 'NOT_ELIGIBLE' else 'PENDING_ISSUANCE' end,
        finished_at = now()
    where id = p_session_id;

    update public.players
    set best_score = greatest(best_score, p_score),
        total_games = total_games + 1,
        total_score = total_score + p_score
    where id = auth.uid();

    return jsonb_build_object(
        'sessionId', p_session_id,
        'status', 'FINISHED',
        'score', p_score,
        'reward', jsonb_build_object(
            'code', v_reward_code,
            'status', case when v_reward_code is null then 'NOT_ELIGIBLE' else 'PENDING_ISSUANCE' end,
            'message', v_reward_message
        )
    );
end;
$$;

grant execute on function public.start_game_session(text,text,text) to authenticated;
grant execute on function public.pause_game_session(uuid) to authenticated;
grant execute on function public.resume_game_session(uuid) to authenticated;
grant execute on function public.finish_game_session(uuid,integer,integer,text,text) to authenticated;
