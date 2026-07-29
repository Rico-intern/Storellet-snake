Storellet Jai Snake Game
Document purpose: To explain the game rules, underlying logic, and system integration rules.

Important Notes
1. Sections 1.1 to 1.16 cover the game rules and underlying operational logic.
2. Sections 1.17 to 1.20 cover the system integration rules for member points, daily game attempts, score submission, and coupon issuance.

========================================
1. Game Rules and Underlying Logic
========================================

1.1 Game Objective and Definition of Fatal Collision
The player controls the snake to eat food on the game board and earn points while avoiding walls, obstacles, the snake's own body, and monsters.

A “fatal collision” means any of the following collisions occurs while the snake is not protected by the initial invincibility period or an active shield:
1.1.1 The snake's head hits a wall.
1.1.2 The snake's head hits an obstacle.
1.1.3 The snake's head hits its own body.
1.1.4 The snake's head hits a monster, regardless of snake length.
1.1.5 A monster hits the snake's head, regardless of snake length.
1.1.6 When the snake is fewer than 5 cells long, a monster hits the snake's body.

The game ends immediately when a fatal collision occurs.

1.2 Game Board
1.2.1 The game board is 20 cells wide and 29 cells high, with a total of 580 cells.
1.2.2 Each cell corresponds to a 20 × 20 pixel game unit.
1.2.3 The wall is the outermost boundary of the game board.

1.3 Snake Controls and Movement Cycle
1.3.1 The player controls the snake using the on-screen D-pad at the bottom of the screen.
1.3.2 On mobile, the player may tap individual direction buttons or press and hold the D-pad and slide directly onto another direction button without lifting the finger.
1.3.3 When opened on a computer, the keyboard arrow keys can also be used.
1.3.4 The snake cannot make an immediate 180-degree turn. For example, when the snake is moving right, it cannot immediately turn left.
1.3.5 The “snake movement cycle” means the time between the snake automatically moving forward by 1 cell and its next automatic forward movement by 1 cell.
1.3.6 The snake's initial movement cycle is 160 milliseconds.
1.3.7 For every 10 points earned, the movement cycle is reduced by 7 milliseconds, down to a minimum of 75 milliseconds.
1.3.8 Only one valid directional input is accepted per movement cycle. The new direction takes effect on the snake's next movement.
1.3.9 Pressing a directional button on mobile triggers light vibration. The actual effect depends on device and WebView support.


1.4 Manhattan Distance Calculation
Manhattan distance is used to calculate the number of cells between an obstacle and the snake's initial body.

Calculation:
Manhattan distance = horizontal cell difference + vertical cell difference

Examples:
1.4.1 If two positions differ by 3 cells horizontally and 0 cells vertically, the Manhattan distance is 3 cells.
1.4.2 If two positions differ by 2 cells horizontally and 1 cell vertically, the Manhattan distance is 3 cells.
1.4.3 If two positions differ by 2 cells horizontally and 2 cells vertically, the Manhattan distance is 4 cells.

The Manhattan distance between an obstacle and every cell of the snake's initial body must be at least 4 cells.


1.5 Initial Snake Generation
1.5.1 The snake's initial length is 3 cells.
1.5.2 The snake's initial movement direction is right.
1.5.3 The snake is generated before obstacles, food, and monsters.
1.5.4 Every cell of the snake's initial body remains at least 2 cells away from the game board boundary.
1.5.5 When obstacles are generated, each obstacle remains at least 4 Manhattan-distance cells away from every cell of the snake's initial body.
1.5.6 When a monster is generated, its position does not overlap the snake's body.

1.6 Food Types, Scores, and Snake Growth
There are five types of food on the game board:
1.6.1 Egg: 1 point
1.6.2 Shiitake Mushroom: 1 point
1.6.3 Sliced Beef: 1 point
1.6.4 Topping: 1 point
1.6.5 Wing Nin Cart Noodles: 5 points

Each time the snake eats one food item, its body increases by 1 cell.

1.7 Food Generation and Refresh
1.7.1 Each time food is generated, Wing Nin Cart Noodles have a 10% spawn probability.
1.7.2 The remaining 90% is distributed equally among Egg, Shiitake Mushroom, Sliced Beef, and Topping, giving each a 22.5% probability.
1.7.3 At the start of the game, 3 food items are generated on the board.
1.7.4 A food item is not generated in a position that overlaps the snake's body, an obstacle, another food item, a treasure chest, or a monster.
1.7.5 Food can be generated in cells along the edge of the game board.
1.7.6 Each food item has an independent lifespan of 12 seconds.
1.7.7 When a food item is eaten or has existed for 12 seconds, the system removes it and immediately generates a new food item, keeping 3 food items on the board.


1.8 Obstacle Generation
1.8.1 At the start of each game, the system randomly generates 7 to 11 obstacles.
1.8.2 Once generated at the start of the game, obstacle positions remain fixed until the game ends.
1.8.3 Obstacles remain at least 2 cells away from the game board boundary.
1.8.4 The Manhattan distance between an obstacle and every cell of the snake's initial body must be at least 4 cells.
1.8.5 Obstacles do not overlap each other.
1.8.6 Obstacles may be adjacent vertically or horizontally, forming short walls or passages.


1.9 Treasure Chest Generation
1.9.1 After the game starts, a treasure chest spawn check is performed every 15 seconds.
1.9.2 Each check has a 50% chance of generating 1 treasure chest.
1.9.3 A maximum of 1 treasure chest can exist on the board at any time.
1.9.4 A maximum of 8 treasure chests can be generated in each game.
1.9.5 A treasure chest is not generated in a position that overlaps the snake's body, an obstacle, food, or a monster.
1.9.6 A treasure chest remains until collected by the snake or until the game ends.

1.10 Treasure Chest Effects
There are four treasure chest effects, each with the same selection probability of 25%:

1.10.1 Halve the snake's body length
   - The snake's body length is rounded up.
   - A minimum body length of 3 cells is retained.

1.10.2 Double score for 10 seconds
   - Normal food increases from 1 point to 2 points.
   - Wing Nin Cart Noodles increase from 5 points to 10 points.
   - The snake's body still increases by 1 cell per food item.

1.10.3 Shield for 10 seconds
   - The shield can block one collision with a wall, obstacle, the snake's body, or a monster.
   - The shield ends immediately after successfully blocking a collision.
   - The shield expires immediately when the 10-second countdown ends.

1.10.4 Freeze all monsters for 5 seconds
   - All monsters stop moving for 5 seconds.
   - Monster type conversion timers continue running.

If the same timed effect is selected again before the existing effect ends, its countdown restarts from the moment it is selected again.


1.11 Monster Generation and Quantity
1.11.1 One monster is generated immediately when the game starts.
1.11.2 The initial monster has a 50% chance of being a blue patrol monster and a 50% chance of being a red tracking monster.
1.11.3 A monster's spawn position remains at least 2 cells away from the game board boundary.
1.11.4 A monster's spawn position does not overlap the snake's body, an obstacle, food, a treasure chest, or another monster.
1.11.5 After the game starts, 1 additional monster is added every 30 seconds.
1.11.6 A maximum of 5 monsters can exist on the board at the same time.

1.12 Blue Patrol Monster Logic and Movement Cycle
1.12.1 The “blue patrol monster movement cycle” means the time between the monster completing one movement decision and moving forward by up to 1 cell, and its next movement decision.
1.12.2 The blue patrol monster's movement cycle is fixed at 160 milliseconds.
1.12.3 During each movement cycle, the monster moves by no more than 1 cell.
1.12.4 Its basic movement direction is horizontally left or right.
1.12.5 When it reaches the left or right boundary of the game board, the monster reverses its horizontal direction.
1.12.6 When an obstacle or another monster is directly ahead, the system calculates a cell-by-cell detour route. The monster moves up or down around the obstruction, then continues in its original horizontal direction.
1.12.7 A detour route consists of single-cell horizontal or vertical movements.
1.12.8 If no valid position can be found during the movement cycle, the monster remains in place and reassesses during the next 160-millisecond movement cycle.
1.12.9 When the monster freeze effect is active, the movement cycle is paused. After the freeze ends, movement decisions resume once every 160 milliseconds.

1.13 Red Tracking Monster Logic
1.13.1 The red tracking monster makes one movement decision every 2 seconds and moves by no more than 1 cell each time.
1.13.2 Before each movement decision, the system reads the snake head's latest position again.
1.13.3 If the snake's head is horizontally or vertically aligned with the monster, the monster moves 1 cell towards the snake's head.
1.13.4 If the snake's head differs on both the X-axis and Y-axis, the monster moves diagonally by 1 cell, meaning 1 cell on both the X-axis and Y-axis.
1.13.5 If the direct tracking position is blocked by an obstacle or another monster, the system compares valid positions on the X-axis and Y-axis and selects the movement that brings the monster closer to the snake's head.
1.13.6 If there is no valid position for that movement decision, the monster remains in place and reassesses during the next 2-second movement cycle.
1.13.7 When the monster freeze effect is active, the movement cycle is paused. After the freeze ends, movement decisions resume once every 2 seconds.

1.14 Monster Type Conversion and Movement Position
1.14.1 Each monster begins its own timer from its individual spawn time and changes type every 5 seconds.
1.14.2 A blue patrol monster changes into a red tracking monster, or a red tracking monster changes into a blue patrol monster.
1.14.3 Each monster has an independent 5-second conversion timer.
1.14.4 After a monster changes into a blue monster, it is assigned a horizontal movement direction.
1.14.5 When moving, monsters avoid the game board boundary, obstacles, and other monsters.
1.14.6 A monster's movement position may overlap food or a treasure chest.

1.15 Monster Collision and Knockback
1.15.1 If the snake's head hits a monster, the collision is fatal regardless of snake length. The initial invincibility period or an active shield takes precedence.
1.15.2 If a monster hits the snake's head, the collision is fatal regardless of snake length. The initial invincibility period or an active shield takes precedence.
1.15.3 If a monster hits the snake's body while the snake is fewer than 5 cells long, the collision is fatal unless initial invincibility or an active shield applies.
1.15.4 If a monster hits the snake's body, excluding the head, while the snake is 5 cells long or more, the monster is knocked back to a nearby safe position.
1.15.5 A frozen monster does not move. The snake's head cannot push or knock back a frozen monster by colliding with it.
1.15.6 Knockback does not remove the monster or change the player's score.
1.15.7 The knockback position avoids areas outside the game board, obstacles, other monsters, and the snake's body.
1.15.8 If no safe knockback position is available, the monster remains in place and changes direction; the snake does not gain permission to occupy the monster's cell.


1.16 Initial Invincibility, Game Speed, Time Limit, and End Conditions

1.16.1 Initial Invincibility Period
1.16.1.1 After the game officially starts, the snake receives 5 seconds of invincibility.
1.16.1.2 If the snake hits a wall during invincibility, it bounces back and reverses its movement direction.
1.16.1.3 If the snake collides with a monster during invincibility, the game continues.
1.16.1.4 The initial invincibility state takes precedence in handling collisions. If a shield is also active, the shield remains available.
1.16.1.5 If the snake hits an obstacle or its own body during invincibility, the collision is blocked.

1.16.2 Snake Movement Speed
1.16.2.1 0 to 9 points: move 1 cell every 160 milliseconds.
1.16.2.2 For every 10 points earned, the movement cycle is reduced by 7 milliseconds.
1.16.2.3 10 to 19 points: move 1 cell every 153 milliseconds.
1.16.2.4 20 to 29 points: move 1 cell every 146 milliseconds.
1.16.2.5 From 130 points onwards: move 1 cell every 75 milliseconds and remain at this maximum speed.

1.16.3 Game Time Limit
1.16.3.1 Each game lasts for a maximum of 20 minutes, or 1,200 seconds.
1.16.3.2 The system automatically ends the game after 1,200 seconds.
1.16.3.3 After the on-screen timer reaches 999 seconds, it remains displayed as 999, while the game timer continues until 1,200 seconds.

1.16.4 Score and High Score Display
1.16.4.1 The SCORE and 1UP fields at the top display 4 digits.
1.16.4.2 When the score exceeds 9,999 points, the top fields display the last 4 digits of the score.
1.16.4.3 The result screen and reward determination use the complete actual score.
1.16.4.4 The high score record is stored in the browser's local data on the player's device.

1.16.5 Game End Conditions
The game ends under the following conditions:
1.16.5.1 A fatal collision defined in Section 1.1 occurs.
1.16.5.2 The game time reaches 1,200 seconds.

After the game ends, the result screen displays the complete score and the corresponding reward result.

1.17 Coupon Score Thresholds
1.17.1 0 to 14 points: Not eligible for a coupon.
1.17.2 15 to 29 points: HK$2 off upon spending HK$50 coupon.
1.17.3 30 to 49 points: HK$3 off upon spending HK$50 coupon.
1.17.4 50 points or above: HK$5 off upon spending HK$50 coupon.

1.18 Daily Game Attempts and Points
1.18.1 Each member may play a maximum of 3 times per day.
1.18.2 The first game each day is free.
1.18.3 The second and third games each day deduct 10 points per game.
1.18.4 Before the game officially starts, the frontend creates a Game Session with the server.
1.18.5 The game starts only after the server confirms that the member has remaining game attempts and sufficient points.
1.18.6 Point deductions for the second and third games are handled by the official member points system.


1.19 Score Submission and Reward Issuance
1.19.1 When the game starts, the API creates a unique Session ID.
1.19.2 After the game ends, the frontend submits the member ID, Session ID, final score, game duration, and end reason.
1.19.3 The same Session accepts only one valid settlement.
1.19.4 The backend determines the reward tier based on the final score.
1.19.5 Each game issues 1 corresponding coupon based on that game's final score.
1.19.6 The coupon is valid for 7 days after issuance.
1.19.7 The coupon is issued within 2 business days.
1.19.8 The coupon cannot be used together with other offers.

1.20 Production System Integration Controls
1.20.1 Member login identity and Access Token validation.
1.20.2 Member points balance checking and deduction.
1.20.3 Daily game attempts recorded by the server and database.
1.20.4 Each Game Session uses a unique Session ID.
1.20.5 The same Session can submit only one valid score.
1.20.6 The same Session can deduct points and issue a coupon only once.
1.20.7 The backend validates game duration, score growth, and Session status.
1.20.8 Production coupon Template ID and coupon issuance API integration.
1.20.9 API operation logs, error handling, and database storage.

========================================
2. Supabase Architecture and File Relationships
========================================

2.1 Project Files

The project now contains five files:

2.1.1 Storellet_snake_supabase_integrated.html
2.1.2 supabase.sql
2.1.3 package.json
2.1.4 package-lock.json
2.1.5 README.md

The former Mock API files have been removed:

2.1.6 server.js
2.1.7 openapi.yaml
2.1.8 Storellet_Snake_API.postman_collection.json

2.2 Overall Architecture

Storellet App / Mobile WebView / Browser
                |
                | Supabase Auth access token
                | HTTPS / PostgREST RPC / JSON
                v
Storellet_snake_supabase_integrated.html
                |
                | Fetch API
                v
Supabase
                |
                |-- Auth identifies the player through auth.uid()
                |-- PostgreSQL RPC controls session lifecycle
                |-- players stores player-level data
                `-- game_sessions stores each game attempt and result

No Node.js API server is required for this starter version.

2.3 Supabase Tables

2.3.1 players

Stores one record for each authenticated player.

Main fields:

2.3.1.1 id: Supabase Auth user UUID and primary key.
2.3.1.2 points_balance: Current game-related points balance.
2.3.1.3 daily_attempt_date: Date used to reset the daily attempt counter.
2.3.1.4 daily_attempts: Number of game sessions started on that date.
2.3.1.5 best_score: Player's highest completed score.
2.3.1.6 total_games: Number of completed sessions.
2.3.1.7 total_score: Sum of completed game scores.
2.3.1.8 created_at and updated_at: Record timestamps.

2.3.2 game_sessions

Stores one record for each game session.

Main fields:

2.3.2.1 id: Unique Session ID.
2.3.2.2 player_id: References players.id.
2.3.2.3 client_session_id: Client-generated idempotency identifier.
2.3.2.4 status: STARTED, PAUSED, FINISHED, or CANCELLED.
2.3.2.5 attempt_no: Daily attempt number from 1 to 3.
2.3.2.6 points_charged: Points charged when the session starts.
2.3.2.7 platform and app_version: Client environment data.
2.3.2.8 score, duration_ms, and end_reason: Final game result.
2.3.2.9 reward_code and reward_status: Reward determination result.
2.3.2.10 started_at, paused_at, total_paused_ms, and finished_at: Session lifecycle timestamps.

2.4 Database Functions

The schema creates four PostgreSQL RPC functions. These functions use SECURITY DEFINER and auth.uid() so the frontend does not choose another player's identity.

2.4.1 start_game_session

2.4.1.1 Creates the player record when it does not exist.
2.4.1.2 Resets daily attempts when the date changes.
2.4.1.3 Enforces the maximum of three attempts per day.
2.4.1.4 Makes the first attempt free.
2.4.1.5 Charges 10 points for the second and third attempts.
2.4.1.6 Creates and returns a unique game session.

2.4.2 pause_game_session

Changes an active session from STARTED to PAUSED and records paused_at.

2.4.3 resume_game_session

Changes a session from PAUSED to STARTED and adds the pause duration to total_paused_ms.

2.4.4 finish_game_session

2.4.4.1 Validates the score and duration range.
2.4.4.2 Stores the final result.
2.4.4.3 Calculates reward eligibility.
2.4.4.4 Updates best_score, total_games, and total_score.
2.4.4.5 Returns the reward result to the HTML.

2.5 Authentication and Security

2.5.1 The App must provide a valid Supabase Auth access token.
2.5.2 The player identity is obtained from auth.uid().
2.5.3 Row Level Security is enabled on both tables.
2.5.4 Players may only read their own player record and sessions.
2.5.5 Direct table writes are not granted to the frontend; session changes use RPC functions.
2.5.6 The Supabase anon key is public configuration and must not be treated as a secret.
2.5.7 The Supabase service-role key must never be placed in the HTML or App WebView.

2.6 HTML Configuration

The App WebView should inject:

2.6.1 window.STORELLET_SUPABASE_URL
2.6.2 window.STORELLET_SUPABASE_ANON_KEY
2.6.3 window.STORELLET_SUPABASE_ACCESS_TOKEN
2.6.4 window.STORELLET_SUPABASE_ENABLED = true
2.6.5 window.STORELLET_SUPABASE_REQUIRED = true for production
2.6.6 window.STORELLET_GAME_PLATFORM
2.6.7 window.STORELLET_GAME_APP_VERSION

For local UAT, the URL and anon key may also be passed through query parameters. The authenticated access token should still be injected by the App rather than placed in a public URL.

2.7 Installation

2.7.1 Create a Supabase project.
2.7.2 Enable the required authentication provider.
2.7.3 Open Supabase SQL Editor.
2.7.4 Run supabase.sql.
2.7.5 Create or authenticate a test user.
2.7.6 Add points to the test player's players record when testing paid attempts.
2.7.7 Inject the Supabase URL, anon key, and access token into the WebView.
2.7.8 Open Storellet_snake_supabase_integrated.html.

2.8 Package Files

The game has no npm runtime dependency. package.json and package-lock.json remain as project metadata and environment-lock files only.

========================================
3. Current Status, Limitations, and Production Requirements
========================================

3.1 Completed Game Items

3.1.1 GAME-01 — Rules page aligned with implemented game logic: Closed.
3.1.2 GAME-02 — Monsters may overlap food or treasure: Accepted Limitation.
3.1.3 GAME-03 — App background handling pauses the game: Closed.
3.1.4 GAME-04 — Timer display remains capped at 999 seconds: Accepted Limitation.
3.1.5 GAME-05 — SCORE and 1UP show the last four digits above 9,999: Accepted Limitation.
3.1.6 GAME-06 — Local high score can be modified and does not synchronise across devices: Accepted Limitation for the on-screen local display. The Supabase players table separately stores the authenticated player's server-side best_score.

3.2 Supabase Integration Status

3.2.1 Daily attempts, point charging, session start, pause, resume, finish, and score storage are implemented in supabase.sql.
3.2.2 Player and session reads are protected by Row Level Security.
3.2.3 The HTML uses Supabase PostgREST RPC directly and no longer depends on server.js.
3.2.4 A valid Supabase Auth access token is required for the database functions.

3.3 Items Still Required for Production

3.3.1 Connect Supabase Auth to the Storellet member identity flow.
3.3.2 Decide whether Storellet points remain authoritative in the existing membership system or are mirrored into players.points_balance.
3.3.3 If Storellet points remain authoritative, replace the local points deduction logic with a trusted server-side or Edge Function integration.
3.3.4 Connect reward_code to the production coupon issuance service.
3.3.5 Add reward retry, reconciliation, and audit logging.
3.3.6 Add server-side anti-cheat validation beyond score and duration ranges.
3.3.7 Add campaign start, end, enabled, eligibility, and maintenance controls.
3.3.8 Add abandoned-session cancellation and point refund rules.
3.3.9 Add automated tests for RPC concurrency, daily reset, duplicate finish, pause/resume, and insufficient points.
3.3.10 Complete iOS and Android WebView UAT under weak network, background, restore, and token-expiry scenarios.

3.4 Important Security Limitation

The browser or WebView can call Supabase using the authenticated player's token. This is suitable for a starter implementation, but high-value points and coupon issuance should not rely only on browser-submitted values. Production reward issuance should be performed by a trusted backend or Supabase Edge Function after additional validation.

3.5 Deployment Gate

Production launch is not recommended until all of the following are complete:

3.5.1 Storellet member identity is securely mapped to Supabase Auth.
3.5.2 Point balance and deduction use an agreed authoritative system.
3.5.3 Coupon issuance is connected and idempotent.
3.5.4 Failed result submission can be retried and reconciled.
3.5.5 Anti-cheat validation and operational audit logs are available.
3.5.6 RLS and RPC permissions have been reviewed in the production Supabase project.
