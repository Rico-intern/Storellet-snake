Storellet仔貪吃蛇
文件用途：介紹遊戲玩法、底層邏輯及系統對接規則。

重要說明
1. 第一至十六項為遊戲玩法及底層運作邏輯。
2. 第十七至二十項為會員積分、每日遊戲次數、分數提交及優惠券派發的系統對接規則。

========================================
A. 遊戲玩法及底層邏輯
========================================

一、遊戲目標及致命碰撞定義
玩家控制蛇進食場內食物以取得分數，同時避開牆壁、障礙物、蛇身及怪獸。

「致命碰撞」指蛇在沒有開局無敵時間或有效護盾保護時，發生以下任何一種碰撞：
1. 蛇頭撞到牆壁。
2. 蛇頭撞到障礙物。
3. 蛇頭撞到自己的蛇身。
4. 蛇身少於5格時，蛇頭撞到怪獸。
5. 蛇身少於5格時，怪獸撞到蛇頭或蛇身。

發生致命碰撞後，遊戲會立即結束。

二、遊戲場地
1. 遊戲場地為20格闊、29格高，共580格。
2. 每一格對應20×20像素的遊戲單位。
3. 牆壁為場地最外圍邊界。

三、蛇的控制及移動週期
1. 玩家使用畫面下方的上、下、左、右方向鍵控制蛇。
2. 在電腦上開啟時，亦可使用鍵盤方向鍵。
3. 蛇不能直接作180度掉頭。例如蛇正向右移動時，不能立即轉向左。
4. 「蛇的移動週期」指蛇完成一次自動向前移動1格，至下一次自動向前移動1格之間的時間。
5. 蛇的初始移動週期為160毫秒。
6. 每取得10分，移動週期縮短7毫秒，最快為75毫秒。
7. 每個移動週期只接受一次有效方向輸入。新方向會在下一次蛇移動時生效。
8. 手機方向鍵按下時會觸發輕微震動；實際效果視乎裝置及WebView支援情況。


四、曼哈頓距離計算方式
曼哈頓距離用於計算障礙物與初始蛇身之間的格數距離。

計算方式：
曼哈頓距離＝橫向相差格數＋縱向相差格數

例子：
1. 兩個位置橫向相差3格、縱向相差0格，曼哈頓距離為3格。
2. 兩個位置橫向相差2格、縱向相差1格，曼哈頓距離為3格。
3. 兩個位置橫向相差2格、縱向相差2格，曼哈頓距離為4格。

障礙物與任何一格初始蛇身的曼哈頓距離必須為4格或以上。


五、蛇的初始生成
1. 蛇的初始長度為3格。
2. 蛇的初始移動方向為向右。
3. 蛇會先於障礙物、食物及怪獸生成。
4. 蛇的所有初始身體格會與場地邊界保持至少兩格距離。
5. 障礙物生成時，會與每一格初始蛇身保持至少4格曼哈頓距離。
6. 怪獸生成時，位置不會與蛇身重疊。

六、食物種類、分數及蛇身增長
場上共有五種食物：
1. 雞蛋：1分
2. 冬菇：1分
3. 肥牛：1分
4. 配料：1分
5. 永年車仔麵：5分

蛇每吃一個食物，蛇身增加1格。

七、食物生成及更新
1. 每次生成食物時，永年車仔麵的生成機率為10%。
2. 其餘90%由雞蛋、冬菇、肥牛及配料平均分配，即每款22.5%。
3. 遊戲開始時，場內生成3個食物。
4. 食物生成位置不會與蛇身、障礙物、其他食物、寶箱或怪獸重疊。
5. 食物可以生成在場地邊緣格子。
6. 每個食物均有獨立的12秒存在時間。
7. 食物被吃掉或存在滿12秒後，系統會移除該食物並立即生成新食物，使場內維持3個食物。


八、障礙物生成
1. 每局開始時，系統會隨機生成7至11個障礙物。
2. 障礙物於開局生成後，位置會固定至該局遊戲結束。
3. 障礙物與場地邊界保持至少兩格距離。
4. 障礙物與任何一格初始蛇身的曼哈頓距離必須為4格或以上。
5. 障礙物之間不會重疊。
6. 障礙物可以在上下或左右方向相鄰，形成短牆或通道。


九、寶箱生成
1. 遊戲開始後，每隔15秒進行一次寶箱生成檢查。
2. 每次檢查有50%機率生成1個寶箱。
3. 場內同一時間最多存在1個寶箱。
4. 每局最多生成8個寶箱。
5. 寶箱生成位置不會與蛇身、障礙物、食物或怪獸重疊。
6. 寶箱會保留至被蛇取得或該局遊戲結束。

十、寶箱效果
寶箱共有四種效果，每種效果的抽取機率相同，即各25%：

1. 蛇身縮短一半
   - 蛇身長度使用向上取整方式計算。
   - 最少保留3格蛇身。

2. 雙倍分數10秒
   - 普通食物由1分變成2分。
   - 永年車仔麵由5分變成10分。
   - 蛇身仍按每個食物增加1格計算。

3. 護盾10秒
   - 護盾可抵擋一次牆壁、障礙物、蛇身或怪獸碰撞。
   - 成功抵擋碰撞後，護盾即時結束。
   - 10秒倒數結束後，護盾即時失效。

4. 全場怪獸定格5秒
   - 所有怪獸暫停移動5秒。
   - 怪獸種類轉換計時繼續運作。

如限時效果尚未結束前再次抽中相同效果，該效果的倒數會由再次抽中一刻重新開始。


十一、怪獸生成及數量
1. 遊戲開始時會立即生成1隻怪獸。
2. 初始怪獸有50%機率為藍色巡邏怪獸，50%機率為紅色追蹤怪獸。
3. 怪獸生成位置會與場地邊界保持至少兩格距離。
4. 怪獸生成位置不會與蛇身、障礙物、食物、寶箱或其他怪獸重疊。
5. 遊戲開始後，每隔30秒增加1隻怪獸。
6. 場內最多同時存在5隻怪獸。

十二、藍色巡邏怪獸邏輯及移動週期
1. 「藍色巡邏怪獸的移動週期」指怪獸完成一次移動判定及最多向前移動1格，至下一次移動判定之間的時間。
2. 藍色巡邏怪獸的移動週期固定為160毫秒。
3. 每個移動週期內，怪獸最多移動1格。
4. 基本移動方向為水平向左或向右。
5. 到達場地左右邊界時，怪獸會反轉水平方向。
6. 前方遇到障礙物或其他怪獸時，系統會計算逐格繞行路線，怪獸會向上或向下繞過阻擋，再繼續向原本水平方向移動。
7. 繞行路線由水平或垂直的單格移動組成。
8. 如該移動週期未能找到可行位置，怪獸會留在原位，並在下一個160毫秒移動週期重新判定。
9. 抽中怪獸定格效果時，移動週期暫停；定格結束後恢復每160毫秒一次的移動判定。

十三、紅色追蹤怪獸邏輯
1. 紅色追蹤怪獸每2秒進行一次移動判定，每次最多移動1格。
2. 每次移動判定前，系統會重新讀取蛇頭位置。
3. 如蛇頭位於怪獸的水平或垂直方向，怪獸會向蛇頭方向移動1格。
4. 如蛇頭同時位於不同的X軸及Y軸方向，怪獸會斜向移動1格，即X軸及Y軸各移動1格。
5. 如直接追蹤位置被障礙物或其他怪獸阻擋，系統會比較X軸及Y軸的可行位置，並選擇移動後較接近蛇頭的位置。
6. 如該次移動判定沒有可行位置，怪獸會留在原位，並在下一個2秒移動週期重新判定。
7. 抽中怪獸定格效果時，移動週期暫停；定格結束後恢復每2秒一次的移動判定。

十四、怪獸種類轉換及移動位置
1. 每隻怪獸由各自的生成時間開始計算，每5秒轉換一次種類。
2. 轉換方式為藍色巡邏怪獸轉為紅色追蹤怪獸，或紅色追蹤怪獸轉為藍色巡邏怪獸。
3. 每隻怪獸使用獨立的5秒轉換計時。
4. 怪獸轉為藍色後，會設定為水平移動方向。
5. 怪獸移動時會避開場地邊界、障礙物及其他怪獸。
6. 怪獸移動位置可以與食物或寶箱重疊。

十五、怪獸碰撞及擊退
1. 蛇身長度少於5格時，蛇與怪獸發生碰撞會按致命碰撞處理；開局無敵時間或有效護盾會優先處理該次碰撞。
2. 蛇身長度達5格或以上時：
   - 蛇頭撞到任何種類的怪獸，會將怪獸擊退。
   - 任何種類的怪獸撞到蛇頭或蛇身，亦會被擊退。
   - 正面及側面碰撞均使用相同擊退規則。
3. 擊退只會將怪獸推到附近可用位置，怪獸數量及玩家分數維持不變。
4. 擊退位置會避開場地外、障礙物、其他怪獸及蛇身。
5. 如附近沒有可用位置，怪獸會留在原位並改變移動方向。


十六、開局無敵、遊戲速度、時限及結束條件

A. 開局無敵時間
1. 正式開始遊戲後，蛇會獲得5秒無敵時間。
2. 無敵期間撞牆時，蛇會反彈並反轉移動方向。
3. 無敵期間與怪獸碰撞時，蛇會繼續遊戲。
4. 開局無敵狀態會優先處理碰撞；如同時持有護盾，護盾會繼續保留。
5. 無敵期間碰到障礙物或蛇身時，該次碰撞會被抵擋。

B. 蛇的移動速度
1. 0至9分：每160毫秒移動1格。
2. 每取得10分，移動週期縮短7毫秒。
3. 10至19分：每153毫秒移動1格。
4. 20至29分：每146毫秒移動1格。
5. 由130分開始：每75毫秒移動1格，並維持此最高速度。

C. 遊戲時限
1. 每局最長20分鐘，即1,200秒。
2. 達到1,200秒後，系統會自動結束遊戲。
3. 畫面時間顯示至999秒後會維持顯示999，遊戲計時會繼續至1,200秒。

D. 分數及最高分顯示
1. 頂部SCORE及1UP欄位以4位數字顯示。
2. 分數超過9,999分後，頂部欄位會顯示分數的最後4位數字。
3. 結算畫面及獎勵判定使用完整實際分數。
4. 最高分記錄會儲存在玩家裝置的瀏覽器本機資料。

E. 遊戲結束條件
以下情況會結束遊戲：
1. 發生第一部分定義的致命碰撞。
2. 遊戲時間達1,200秒。

遊戲結束後，結算畫面會顯示完整分數及對應獎勵結果。

十七、優惠券得分門檻
1. 0至14分：不符合優惠券資格。
2. 15至29分：滿HK$50減HK$2優惠券。
3. 30至49分：滿HK$50減HK$3優惠券。
4. 50分或以上：滿HK$50減HK$5優惠券。

十八、每日遊戲次數及積分
1. 每名會員每日最多遊戲3次。
2. 每日第1次免費。
3. 每日第2及第3次，每次扣除10積分。
4. 正式開始遊戲前，前端向伺服器建立Game Session。
5. 伺服器確認會員仍有遊戲次數及足夠積分後，遊戲才會開始。
6. 第2及第3次遊戲的積分扣除由正式會員積分系統處理。


十九、分數提交及派獎
1. 遊戲開始時，API建立唯一Session ID。
2. 遊戲結束後，前端提交會員ID、Session ID、最終分數、遊戲時間及結束原因。
3. 同一Session只接受一次有效結算。
4. 後端根據最終分數判斷獎勵級別。
5. 每局按該局最終分數派發1張對應優惠券。
6. 優惠券有效期為發出後7日。
7. 優惠券於2個工作日內派發。
8. 優惠券不可與其他優惠同時使用。

二十、正式系統對接控制
1. 會員登入身份及Access Token驗證。
2. 會員積分餘額檢查及扣分。
3. 每日遊戲次數由伺服器及資料庫記錄。
4. 每個Game Session使用唯一Session ID。
5. 同一Session只可提交一次有效分數。
6. 同一Session只可扣分及派券一次。
7. 後端驗證遊戲時間、分數增長及Session狀態。
8. 正式優惠券Template ID及派券API對接。
9. API操作記錄、錯誤處理及資料庫保存。


========================================
B. 技術棧———檔案之間的關係
========================================
Storellet Snake Game API Starter Kit

技術棧及六個檔案協作說明

1. 文件目的
本文件說明除 README.md 外，其餘六個檔案所採用的技術、各自用途，以及遊戲前端、Mock API、Node.js依賴、API規格與測試工具之間的配合方式。

六個檔案包括：
Storellet_snake_api_integrated.html
server.js
package.json
package-lock.json
openapi.yaml
Storellet_Snake_API.postman_collection.json

2. 整體技術架構

本Starter Kit採用前後端分離架構：

Storellet App／Mobile WebView／Browser
                │
                │ HTTPS／REST API／JSON
                ▼
Storellet_snake_api_integrated.html
                │
                │ Fetch API
                ▼
server.js
Node.js + Express Mock API
                │
                ├─ 建立Game Session
                ├─ 管理每日遊戲次數
                ├─ 接收遊戲分數
                ├─ 驗證Session狀態
                └─ 計算獎勵資格

其他檔案負責依賴管理、API規格及測試：

package.json
└─ 定義Node.js依賴、版本要求及啟動指令

package-lock.json
└─ 鎖定實際安裝的套件版本、依賴樹及完整性資料

openapi.yaml
└─ 定義前端與後端之間的API Contract

Postman Collection
└─ 測試API Endpoint及完整遊戲Session流程

3. 技術棧總覽

層級       |        技術           |用途
---------------------------------------------------
前端       |HTML5                 |建立遊戲頁面及WebView內容
UI         |CSS3                 |手機全屏、響應式版面及復古遊戲介面
前端邏輯    |Vanilla JavaScript   |執行遊戲、輸入、計分及API串接
遊戲渲染    |HTML5 Canvas 2D API  |繪製蛇、食物、怪獸、障礙物及寶箱
前後端通訊   |Fetch API            |從HTML呼叫後端REST API
資料格式     |JSON                 |傳送Session、分數及獎勵資料
後端Runtime |Node.js 18或以上       |執行Mock API Server
後端Framework|Express 4           |建立API Route及處理HTTP Request
跨來源設定   |CORS                 |允許WebView或Browser呼叫API
Session ID  |Node.js Crypto       |產生唯一UUID
暫存資料     |JavaScript Map       |儲存Session、每日次數及Idempotency結果
套件管理     |npm                  |安裝、鎖定及執行Node.js依賴
API規格     |OpenAPI 3.0.3        |定義Endpoint、Request、Response及錯誤碼
API測試     |Postman              |測試Endpoint及完整Session流程

4. 六個檔案的用途

4.1 Storellet_snake_api_integrated.html

角色

此檔案是遊戲前端，同時亦是API Client。

主要負責：
1.顯示遊戲介面。
2.執行蛇、食物、怪獸、障礙物及寶箱邏輯。
3.處理手機方向鍵及鍵盤輸入。
4.開始遊戲前向API建立Game Session。
5.保存API回傳的 sessionId。
6.Game Over後提交分數及遊戲結果。
7.顯示API回傳的優惠券資格。

使用技術
1.HTML5
2.CSS3
3.Vanilla JavaScript
4.Canvas 2D API
5.Fetch API
6.URL Query Parameters
7.WebView JavaScript Injection

與其他檔案的關係
1.呼叫 server.js 提供的REST API。
2.Request及Response格式應符合 openapi.yaml。
3.可使用Postman Collection模擬相同API流程。

4.2 server.js

角色：

此檔案是Node.js Mock REST API Server，用作模擬正式Storellet Backend的遊戲對接流程。

主要負責：
1.建立Game Session。
2.管理每名會員每日遊戲次數。
3.計算本次遊戲是否免費或應扣積分。
4.接收遊戲分數、遊戲時間及結束原因。
5.驗證Session、會員及提交資料。
6.根據分數計算獎勵資格。
7.使用Idempotency Key避免相同Request被重複處理。

使用技術
1.Node.js
2.Express
3.CORS
4.crypto.randomUUID()
5.JavaScript Map
6.REST API
7.JSON Request及Response

與其他檔案的關係
1.由 package.json 內的啟動指令執行。
2.使用 package.json 宣告的Express及CORS套件。
3.實際安裝版本由 package-lock.json 鎖定。
4.Endpoint及資料結構應與 openapi.yaml 一致。
5.可由Postman Collection直接測試。

4.3 package.json

角色

此檔案是Node.js專案的主要套件設定檔，負責定義：
1.專案名稱及版本。
2.Node.js版本要求。
3.Production Dependencies。
4.npm啟動及開發指令。

主要依賴

"express": "^4.21.2",
"cors": "^2.8.5"

express：建立REST API及處理HTTP Request。

cors：允許遊戲HTML或App WebView跨來源呼叫API。

常用指令

安裝依賴：

npm install

啟動API：

npm start

開發模式：

npm run dev

與其他檔案的關係

package.json
    │
    ├─ 宣告server.js需要的套件
    ├─ 定義npm start執行server.js
    └─ 由package-lock.json鎖定實際套件版本

4.4 package-lock.json

角色

此檔案由npm自動產生，用作鎖定整個Node.js專案實際安裝的依賴版本及依賴樹。

package.json可以使用版本範圍，例如：

"express": "^4.21.2"

而 package-lock.json 會記錄實際安裝的精確版本，以及Express所依賴的其他子套件版本。

主要用途
1.確保開發、UAT、CI/CD及Production安裝相同版本的套件。
2.記錄完整依賴樹。
3.記錄套件下載來源及完整性雜湊值。
4.提升安裝速度及可重現性。
5.減少因套件自動升級而出現的環境差異。

package.json與package-lock.json的分工

檔案              |        作用
-----------------|-----------------------------
package.json     |宣告專案需要哪些套件及可接受的版本範圍
package-lock.json|記錄實際安裝的精確版本及完整依賴樹

安裝方式

一般開發環境：

npm install

1.讀取 package.json 及 package-lock.json。
2.安裝依賴。
3.如依賴設定有改動，可能更新 package-lock.json。

CI、UAT或Production建議使用：

npm ci

1.嚴格按 package-lock.json 安裝。
2.不會自行修改Lock File。
3.如 package.json 與 package-lock.json 不一致，安裝會失敗，避免部署錯誤版本。

管理原則

1.package-lock.json應與package.json一同提交至版本控制。
2.不建議手動修改 package-lock.json。
3.修改依賴時，應更新 package.json，再執行 npm install產生新的Lock File。
4.Tech Team應在Code Review中一併檢查兩個檔案的變更。


4.5 openapi.yaml

角色

此檔案是前端與後端之間的API Contract，使用OpenAPI 3.0.3格式。

主要定義：
1.API Base URL。
2.Endpoint及HTTP Method。
3.Request Body。
4.Response Body。
5.Required Field。
6.Data Type。
7.HTTP Status Code。
8.Error Response。
9.Idempotency Key。
10.Bearer Token規格。
11.Session、Reward及Player Status Schema。

與其他檔案的關係
1.HTML發出的Request應符合此規格。
2.server.js的Route、Validation及Response格式應符合此規格。
3.Postman Collection的測試Request亦應符合此規格。
4.server.js目前不會在Runtime自動讀取 openapi.yaml，因此開發人員修改API時，需要同步更新兩者。


4.6 Storellet_Snake_API.postman_collection.json

角色

此檔案是Postman API測試集合，讓Tech Team及QA毋須進入遊戲畫面，亦可以直接測試API。

主要測試流程

Get game config
        ↓
Get player status
        ↓
Start game session
        ↓
取得sessionId
        ↓
Finish game session
        ↓
Get session核對結果

與其他檔案的關係
1.呼叫 server.js 提供的API。
2.Request及Response格式應符合 openapi.yaml。
3.模擬HTML的開局及結算流程。
4.正式Backend完成後，只需更新 baseUrl即可進行UAT。
5.Postman Collection只用於開發、測試及問題排查，不參與正式遊戲Runtime。


5. 六個檔案的完整協作流程

5.1 安裝及啟動

package.json
    │
    ├─ 宣告所需依賴及啟動指令
    │
package-lock.json
    │
    ├─ 鎖定實際安裝版本
    │
    ▼
npm ci／npm install
    │
    ▼
安裝Express及CORS
    │
    ▼
npm start
    │
    ▼
server.js啟動Mock API

5.2 開始遊戲

玩家按「開始遊戲」
        │
        ▼
Storellet_snake_api_integrated.html
        │
        │ POST /game/sessions/start
        ▼
server.js
        │
        ├─ 檢查當日次數
        ├─ 計算本次積分成本
        ├─ 建立sessionId
        └─ 回傳Session資料
        │
        ▼
HTML保存sessionId並開始遊戲

5.3 遊戲結算

Game Over
    │
    ▼
HTML整理score、durationMs及endReason
    │
    │ POST /game/sessions/{sessionId}/finish
    ▼
server.js
    │
    ├─ 驗證Session
    ├─ 驗證會員
    ├─ 驗證分數及時間
    ├─ 計算獎勵級別
    └─ 回傳Reward Status
    │
    ▼
HTML顯示分數及獎勵結果

5.4 規格及測試

openapi.yaml
    ├─ 規範HTML Request
    ├─ 規範server.js Response
    └─ 提供QA驗收基準

Postman Collection
    ├─ 測試server.js
    ├─ 驗證OpenAPI Contract
    └─ 模擬HTML完整API Flow

6. 執行元件與輔助元件

                檔案                         | Runtime是否直接使用 | 類別

Storellet_snake_api_integrated.html         |       是           |前端執行元件
server.js                                   |       是           |後端執行元件
package.json                                |   啟動及安裝時使用   |專案設定及依賴宣告
package-lock.json                           |    安裝時使用       |精確依賴版本鎖定
openapi.yaml                                |       否           |API規格及對接文件
Storellet_Snake_API.postman_collection.json |       否           |API測試工具

系統運行時的核心程式為：

Storellet_snake_api_integrated.html
server.js

Node.js Server能否正確及一致地安裝和啟動，則由以下兩個檔案共同管理：

package.json
package-lock.json

OpenAPI及Postman不參與正式Runtime，但負責接口統一、跨團隊對接、測試及驗收。

7. 建議部署流程

開發環境

npm install
npm run dev

UAT／CI／Production環境

npm ci
npm start

建議UAT及Production使用 npm ci，確保完全依照 package-lock.json安裝指定版本，避免環境之間出現依賴差異。

8. 正式Production對接方向

正式上線時，上層Backend應以 openapi.yaml作為接口基準，取代或改寫 server.js的Mock邏輯，並完成：
1.會員身份驗證。
2.積分餘額查詢及扣除。
3.每日遊戲次數管理。
4.Game Session永久儲存。
5.分數及遊戲時間驗證。
6.重複提交防護。
7.獎勵資格判定。
8.優惠券派發。
9.Audit Log及錯誤追蹤。
10.Production安全及Rate Limit設定。

前端HTML只需要更新API Base URL、Access Token、User ID及環境設定，遊戲核心邏輯毋須重新開發。

========================================
C. 已知漏洞及未完成的功能
========================================

1. 狀態及優先級定義

優先級        ｜定義
P0 — 上線阻塞 ｜可繞過活動規則、造成錯誤扣分／派獎、資料遺失、安全風險或核心遊戲狀態錯誤；正式上線前必須完成。
P1 — 高優先   ｜會影響遊戲公平性、客戶驗收、主要操作流程或造成明顯錯誤；建議 UAT 前完成。
P2 — 中優先   ｜不一定阻止遊戲進行，但會造成顯示、體驗、維護或營運問題。
P3 — 優化項目 ｜屬於後續改善、數據分析或管理效率提升，不影響基本遊戲運行。

狀態建議使用：

Open：尚未開始
In Progress：處理中
Ready for QA：已完成，待測試
Closed：已驗收完成
Accepted Limitation：已知限制，確認本階段不處理

A. 已確認的遊戲程式漏洞

GAME-01　護盾／無敵時間抵擋障礙物或蛇身碰撞後，蛇頭位置未被校正
優先級：P0
狀態：Open
類型：遊戲狀態／碰撞處理

現況
當蛇頭撞到障礙物或自己的蛇身，而當時仍有開局無敵時間或有效護盾，程式會取消 Game Over，但沒有將蛇頭移回碰撞前位置、反彈位置或其他合法位置。

可能影響

1.蛇頭可能進入障礙物所在格。
2.蛇頭可能與自己的蛇身重疊。
3.下一個移動週期可能再次觸發碰撞。
4.蛇身陣列可能出現重複座標，令後續自撞判定不穩定。

建議修正
1.碰撞被抵擋後，必須執行其中一種明確處理：
2.保留蛇頭在碰撞前位置；或
3.將蛇反向彈回合法格；或
4.啟用指定時間的穿透模式，並清楚定義穿透結束後的位置。

GAME-02　怪獸無法被推到安全位置時，仍會被判定為「成功擊退」

優先級：P1
狀態：Open
類型：怪獸碰撞／座標重疊

現況
當蛇撞到怪獸並符合擊退條件，但怪獸四周沒有可用位置時，程式會讓怪獸留在原位，同時仍回傳「成功擊退」。

可能影響
1.蛇頭之後會進入怪獸仍然佔用的同一格。
2.畫面可能出現蛇與怪獸重疊。
3.下一個更新週期可能出現不一致的碰撞結果。

建議修正

如怪獸沒有安全位置可被推開，應改為以下其中一項：
1.取消蛇該次移動；
2.將蛇反彈；
3.將怪獸移至經全場搜尋所得的最近安全位置；
4.明確判定該次擊退失敗並按規則處理碰撞。

GAME-03　遊戲規則頁與實際程式邏輯不一致

優先級：P1
狀態：Open
類型：內容／驗收規格

已知不一致

1.規則頁寫永年車仔麵令蛇身增加 5 格，但實際程式只增加 1 格，並增加 5 分。
2.規則頁寫蛇身「多過 5 節」及由側面碰撞才可擊退怪獸；實際程式為蛇身達 5 格或以上，正面、側面、蛇撞怪獸或怪獸撞蛇均可能觸發擊退。
3.規則頁寫藍色巡邏怪獸速度慢過蛇；實際開局時兩者同為每 160 毫秒一格，其後蛇會隨分數加速。
4.規則頁部分「即死」描述沒有列出開局無敵時間及護盾例外。

可能影響

1.客戶按錯誤文字驗收。
2.玩家對遊戲結果產生爭議。
3.Confirmation List、前端及 API 規格出現版本差異。

建議修正

以已簽署的 Confirmation List 作唯一規格來源，同步更新：
1.遊戲規則頁
2.獎勵頁
3.HTML 常數及邏輯
4.API Config
5.OpenAPI 範例
6.QA Test Case

GAME-04　怪獸可以覆蓋食物或寶箱

優先級：P1
狀態：Open／待確認是否接受
類型：物件碰撞／視覺及公平性

現況

怪獸移動時只會避開場地邊界、障礙物及其他怪獸，沒有避開食物及寶箱。

可能影響
1.食物或寶箱被怪獸遮蓋，玩家未必能清楚看到。
2.玩家嘗試取得食物或寶箱時，可能先觸發怪獸碰撞。
3.視覺上難以判斷同一格包含哪些物件。

建議修正

由客戶確認以下其中一種規則：
1.怪獸移動時必須避開食物及寶箱；或
2.怪獸可覆蓋，但需增加清晰的疊層顯示及碰撞優先次序說明。

GAME-05　App 進入背景後，遊戲時間及限時效果仍按真實時間計算

優先級：P1
狀態：Open
類型：WebView／App Lifecycle

現況

遊戲沒有正式 Pause 或 App Lifecycle 處理。當玩家切換 App、鎖屏或 WebView 進入背景時，畫面更新可能暫停，但遊戲使用的時間計算仍以系統時間為準。

可能影響
返回遊戲時可能出現：
1.食物已過期及重新生成。
2.護盾、雙倍分數、無敵或怪獸定格效果已結束。
3.怪獸種類已轉換。
4.遊戲總時間包含離開 App 的時間。
5.長時間離開後可直接達到 20 分鐘上限。

建議修正

需確認產品規則：
App 進入背景時自動暫停；或
App 進入背景即結束該局；或

保持現有實時計時，但必須在規則中清楚說明。

GAME-06　遊戲時間顯示與實際上限不一致

優先級：P2
狀態：Open
類型：顯示限制

現況

遊戲可進行至 1,200 秒，但頂部時間欄只顯示至 999 秒。

可能影響

最後 201 秒內，玩家無法知道實際剩餘或已使用時間。

建議修正
將時間欄擴展至 4 位數，或改為 MM:SS 格式。

GAME-07　頂部分數及最高分只顯示最後 4 位數

優先級：P2
狀態：Open
類型：顯示限制

現況

實際分數可高於 9,999，但 SCORE 及 1UP 欄只保留最後 4 位數。

可能影響

例如實際 10,250 分可能顯示為 0250，令玩家誤解分數倒退或被重設。

建議修正
限制最高分為 9,999；或
擴展顯示位數；或
使用縮寫格式並在結算頁顯示完整分數。

GAME-08　本機最高分可被修改，亦不會跨裝置同步

優先級：P2
狀態：Open／Accepted Limitation
類型：資料可信度

現況

最高分只儲存在瀏覽器 localStorage。

可能影響
1.清除 App／瀏覽器資料後最高分消失。
2.更換裝置後無法同步。
3.玩家可使用瀏覽器工具修改本機最高分。
4.同一部裝置可能混用不同會員的最高分。

建議修正

正式版本應由後端按會員儲存最高分及遊戲紀錄。

B. API 串接及流程漏洞

API-01　API 非強制模式可繞過每日次數、積分及伺服器限制
優先級：P0
狀態：Open
類型：活動規則繞過

現況

當 API 連線失敗，而 apiRequired 未設定為 true 時，前端會繼續以離線模式開始遊戲。

此處理亦可能套用於：
1.每日次數已用完的 429 回應；
2.日後正式積分不足的回應；
3.驗證失敗；
4.API Server 故障。

可能影響

玩家可在未建立有效 Session、未扣積分或已達次數上限時繼續遊玩。

建議修正

Production 必須：
1.強制 API_REQUIRED = true；
2.針對不同錯誤碼分開處理；
3.401／402／403／429 不得 fallback 至離線遊戲；
4.只有明確批准的 Demo／Local Mode 才可離線開始。

API-02　如 App 未注入 API 設定，API 功能會完全停用

優先級：P0
狀態：Open
類型：配置風險

現況

API 預設為 Disabled，需要 App WebView 或 URL Parameter 主動啟用。

可能影響

若 Production WebView 漏傳任何關鍵設定，遊戲可直接以純前端模式運行，沒有次數、扣分、分數提交及派獎控制。

建議修正

Production Build 應：
1.預設要求 API；
2.缺少 API Base URL、User ID 或 Token 時顯示阻塞錯誤；
3.不允許使用 guest-user 進入正式活動。

API-03　開始 Session 時已計算使用次數，但遊戲未必真正開始

優先級：P0
狀態：Open
類型：錯誤扣次數／扣分風險

現況

玩家按開始後，API 立即增加當日次數，之後才進入倒數及遊戲。

觸發情境
建立 Session 後關閉頁面。
倒數期間 App Crash。
WebView 被關閉。
遊戲資源初始化失敗。
玩家在正式開始前離開。

可能影響

玩家會失去一次遊戲機會，正式接積分後亦可能已被扣分，但沒有真正遊玩。

建議修正

採用兩階段流程：
1.reserve/start：保留名額但未正式扣分；
2.前端成功進入遊戲後呼叫 activate；
3.未啟動 Session 在短時間後自動取消；或
提供取消及退款機制。

API-04　分數提交失敗後沒有實際重試入口

優先級：P0
狀態：Open
類型：結果遺失／派獎遺失

現況

提交失敗時畫面會提示「請稍後重試」，但目前沒有：
1.重試按鈕；
2.自動重試；
3.本機待提交佇列；
4.App 重新開啟後的 reconciliation；
5.客服可用的補交流程。

玩家返回主頁或重新載入後，前端 Session ID 會遺失。

可能影響

已完成遊戲的玩家可能沒有遊戲紀錄及優惠券。

建議修正
1.結算頁加入「重新提交」；
2.暫存待提交結果；
3.使用相同 Idempotency Key 安全重試；
4.App 啟動時查詢未完成 Session；
5.後台提供 reconciliation job。

API-05　開始遊戲前沒有清晰顯示及確認扣分

優先級：P1
狀態：Open
類型：付費操作 UX

現況

API 回傳第幾次遊戲及應扣積分後，只以短暫訊息顯示，並立即進入倒數。訊息亦可能被倒數 Overlay 遮蓋或在遊戲初始化時被清除。

可能影響

玩家未清楚確認便開始一局需要扣分的遊戲。

建議修正

第 2、3 次遊戲前顯示置中確認視窗，包括：
1.本次所需積分；
2.現有積分；
3.今日已用及剩餘次數；
4.取消／確認按鈕；
5.確認成功後才扣分及開始遊戲。

API-06　前端沒有使用 /game/config 動態設定遊戲

優先級：P1
狀態：Open
類型：設定同步

現況

Mock API 提供 /game/config，但 HTML 沒有讀取該 Endpoint。蛇速、怪獸速度、食物時間、寶箱時間及獎勵門檻仍直接寫在 HTML 及 server.js。

可能影響
1.前端、API、OpenAPI、規則頁及 Confirmation List 容易出現不同版本。
2.修改活動規則需要重新修改及部署 HTML。

建議修正

開局前讀取版本化 Game Config，並決定哪些設定由 Server 控制、哪些必須固定於前端。

C. Mock API 的已知安全及資料漏洞

BACKEND-01　沒有正式身份驗證，userId 由前端自行傳入

優先級：P0
狀態：未完成
類型：身份冒認

現況

前端可自行指定 userId。Mock Server 雖接受 Authorization Header，但沒有驗證 Token，亦沒有從 Token 取得會員身份。

可能影響

任何人均可用其他會員的 userId 建立 Session、查詢次數或提交結果。

正式版本要求
1.驗證 Storellet Access Token／JWT；
2.由 Token 取得會員 ID；
3.忽略或核對 Request Body 內的 userId；
4.驗證活動及會員資格。

BACKEND-02　每日積分並未真正檢查或扣除

優先級：P0
狀態：未完成
類型：積分交易
現況

Mock API 只回傳 pointsCharged 數值，沒有：
1.查詢會員積分餘額；
2.積分不足判定；
3.真正扣除積分；
4.Points Ledger Transaction；
5.扣分失敗回滾；
6.重複扣分防護。

OpenAPI 雖列出積分不足回應，但 Mock Server 未實作。

BACKEND-03　優惠券未真正派發

優先級：P0
狀態：未完成
類型：獎勵派發

現況

API 只回傳 PENDING_ISSUANCE。couponTemplateCode 仍為 TO_BE_CONFIRMED，沒有建立正式 Coupon Record。

尚欠內容
1.正式 Coupon Template ID；
2.派券 API；
3.Coupon ID 回傳；
4.有效期計算；
5.防重複派發；
6.派發失敗重試；
7.派發 Audit Log；
8.會員通知。

BACKEND-04　所有資料只儲存在 Server Memory

優先級：P0
狀態：未完成
類型：資料持久化

現況

Session、每日次數及 Idempotency Response 使用 JavaScript Map 儲存。

可能影響
1.Server 重啟後所有資料消失。
2.多台 Server 之間不共享資料。
3.玩家可在不同 Instance 重複使用每日次數。
4.無法產生正式報表或客服查詢。

正式版本要求

使用正式 Database，並加入 Transaction、Index、Retention Policy 及 Backup。

BACKEND-05　分數完全由前端提交，沒有防作弊驗證

優先級：P0
狀態：未完成
類型：遊戲公平性／派獎風險

現況

API 只檢查：
1.分數為整數；
2.分數在 0 至 99,999；
3.遊戲時間在接受範圍。

API 沒有驗證分數是否可在該遊戲時間內合理取得。

可能影響
玩家可直接修改 JavaScript、攔截 Request 或自行呼叫 API，提交高分並取得獎勵。

正式版本要求

至少加入：
1.Server Session 開始及結束時間核對；
2.分數增長上限及合理性檢查；
3.遊戲事件摘要／簽名；
4.Nonce；
5.App／WebView完整性訊號；
6.異常分數風險標記；
7.高風險結果人工或延遲派獎。

BACKEND-06　Session 沒有到期、取消或中止狀態

優先級：P1
狀態：未完成
類型：Session Lifecycle

現況

Session 只有 STARTED 及 FINISHED 狀態，沒有：
1.RESERVED
2.ACTIVE
3.ABANDONED
4.EXPIRED
5.CANCELLED
6.REJECTED

可能影響

未完成 Session 永久保留，無法判斷應否退回次數或積分。

BACKEND-07　Idempotency 實作存在狀態碼及作用域問題

優先級：P0
狀態：Open
類型：重複交易控制

現況

Idempotency Cache 只保存 Response Body，沒有保存原始 HTTP Status Code。

重播已快取的錯誤結果時，Server 會以 HTTP 200 回傳錯誤 Body。

Idempotency Key 沒有按 Endpoint、會員或操作類型建立作用域。

Idempotency 記錄沒有到期時間。

可能影響
1.第一次回傳 429／400，重試可能變成 200。
2.Client 可能錯誤判定操作成功。
3.惡意重用 Key 可能取得另一操作的快取回應。
4.記憶體會持續增加。

建議修正

保存並核對：
1.HTTP Method
2.Route
3.Authenticated User ID
4.Request Body Hash
5.Response Status
6.Response Body
7.Created At／Expiry At

BACKEND-08　玩家狀態及 Session 查詢沒有存取權限控制

優先級：P0
狀態：未完成
類型：IDOR／資料私隱

現況

以下 Endpoint 沒有身份驗證：
1.查詢指定 userId 的每日次數；
2.查詢指定 sessionId 的 Session 詳情。

正式版本要求

會員只可查自己的資料；

Internal／Admin Endpoint 使用獨立權限；

不向前端回傳不必要的內部資料。

BACKEND-09　CORS、Rate Limit 及安全保護未完成

優先級：P0
狀態：未完成
類型：API Security

現況

Mock Server 接受任何 Origin，並未提供：
1.Production Origin Allowlist；
2.Rate Limit；
3.Security Headers；
4.Request Signature；
5.WAF／Bot Protection；
6.Payload及異常流量監察；
7.強制 HTTPS。

BACKEND-10　活動開始、結束及啟用狀態未受後端控制

優先級：P1
狀態：未完成
類型：Campaign Control

現況

API 沒有檢查：
1.活動開始時間；
2.活動結束時間；
3.活動啟用／停用；
4.會員是否符合資格；
5.App Version 是否受支援；
6.Maintenance Mode。

可能影響

活動結束後仍可能建立 Session 或提交結果。

BACKEND-11　沒有完整 Audit Log、監察及告警

優先級：P1
狀態：未完成
類型：營運及故障追蹤

尚欠內容
1.Request／Trace ID；
2.Session Lifecycle Log；
3.積分扣除 Log；
4.派券 Log；
5.異常分數 Log；
6.API Error Dashboard；
7.失敗率及延遲監察；
8.警告機制；
9.客服查詢介面。

BACKEND-12　OpenAPI 規格未與 Server 建立自動 Contract Validation

優先級：P2
狀態：未完成
類型：規格同步

現況

openapi.yaml、HTML、Postman Collection 及 server.js 需要人工同步。

可能影響
其中一個檔案更新後，其他檔案可能仍使用舊欄位、舊狀態碼或舊規則。

建議修正

加入：
1.OpenAPI Schema Validation Middleware；
2.Contract Test；
3.CI Pipeline；
4.Postman／Newman Test；
5.API Schema Version。

D. 尚未完成的產品功能

FEATURE-01　「我的遊戲紀錄」頁面及後端歷史紀錄

優先級：P1
狀態：未完成

目前 HTML 沒有「我的遊戲紀錄」入口、紀錄列表或對應 API。

建議顯示：
1.遊戲日期及時間；
2.最終分數；
3.本次遊戲為免費或扣分；
4.派發的優惠券；
5.派發狀態；
6.Session／Reference No.；
7.提交失敗或待處理狀態。

FEATURE-02　食物圖例固定顯示

優先級：P2
狀態：未完成

目前遊戲畫面未有固定食物圖例，玩家需要依賴規則頁記住各食物及分數。

FEATURE-03　遊戲進行中的離開按鈕及離開處理

優先級：P1
狀態：未完成

目前遊戲進行時沒有正式 Exit 按鈕，亦沒有定義：
1.離開是否計作已使用一次；
2.是否提交 0 分或當前分數；
3.已扣積分是否退回；
4.Session 應標記為何種狀態。

FEATURE-04　每日次數、剩餘次數及積分餘額介面

優先級：P1
狀態：未完成

主頁未有持續顯示：
1.今日已使用次數；
2.今日剩餘次數；
3.下一次所需積分；
4.現有積分；
5.積分不足狀態。

FEATURE-05　活動條款及細則動態管理

優先級：P1
狀態：未完成

目前 Starter Kit 未有從 Supabase／CMS／正式 API 讀取：
1.頁面標題；
2.條款內容；
3.啟用／停用狀態；
4.更新時間；
5.條款版本；
6.玩家同意紀錄。

FEATURE-06　獎勵及遊戲設定動態管理

優先級：P1
狀態：未完成

以下設定仍為硬編碼：
1.獎勵分數門檻；
2.優惠券面額；
3.Coupon Template ID；
4.遊戲次數；
5.額外遊戲積分成本；
6.食物分數及生成率；
7.怪獸速度；
8.寶箱效果及時間；
9.活動時段。

FEATURE-07　分數提交失敗的補交及對帳機制

優先級：P0
狀態：未完成

除前端重試外，後端仍有以下問題：
1.未完成 Session 查詢；
2.定時 Reconciliation Job；
3.積分已扣但遊戲未完成的處理；
4.遊戲已完成但優惠券未派的補發；
5.客服人工補發權限及 Audit Log。

FEATURE-08　正式 App WebView 身份及環境注入

優先級：P0
狀態：未完成／待 App Team 對接

需要 App Team 正式提供：
1.API Base URL；
2.Access Token；
3.Authenticated User ID；
4.Platform；
5.App Version；
6.Campaign ID；
7.Environment；
8.WebView關閉／背景／恢復事件。

FEATURE-09　遊戲分析事件及成效追蹤

優先級：P3
狀態：未完成

建議追蹤：
1.主頁曝光；
2.規則及獎勵頁開啟；
3.開始遊戲；
4.取消扣分；
5.Session建立失敗；
6.Game Over原因；
7.最終分數；
8.寶箱取得及效果；
9.分數提交結果；
10.優惠券派發及使用。

FEATURE-10　自動化測試及裝置UAT覆蓋

優先級：P1
狀態：未完成

目前未見完整自動測試，包括：
1.遊戲單元測試；
2.碰撞測試；
3.怪獸尋路測試；
4.API Contract Test；
5.Idempotency Test；
6.每日次數及跨日測試；
7.積分扣除並發測試；
8.派券重複提交測試；
9.iOS／Android WebView背景恢復測試；
10.不同屏幕尺寸及安全區測試；
11.弱網、斷網及重試測試。

E. 建議處理次序

第一階段：客戶確認及 UAT 前
1.修正 GAME-01 護盾／無敵碰撞位置。
2.修正 GAME-02 怪獸擊退重疊。
3.同步 GAME-03 規則頁與實際邏輯。
4.確認 GAME-04 怪獸是否可覆蓋食物／寶箱。
5.定義 App 進入背景時的處理方式。
6.補充每日次數及扣分確認 UI。
7.加入 Exit 及 Session 中止規則。

第二階段：正式 API UAT 前
1.強制 API，移除規則錯誤時的離線 fallback。
2.完成 Storellet身份驗證。
3.完成正式積分檢查及扣除。
4.完成 Database 及 Session Lifecycle。
5.修正 Idempotency 實作。
6.加入提交失敗重試及 reconciliation。
7.前端正式讀取 Game Config。
8.完成活動開始／結束／停用控制。

第三階段：Production 前
1.完成優惠券派發及防重。
2.完成防作弊驗證。
3.限制 CORS、加入 Rate Limit及Security Headers。
4.完成 Audit Log、監察及告警。
5.完成自動化測試及 iOS／Android 真機 UAT。
6.完成「我的遊戲紀錄」及客服對帳能力。

F. 發佈門檻建議

不建議進入 Production 的情況

只要以下任何一項仍未完成，均不建議正式上線：
1.API 可被 bypass；
2.未有正式身份驗證；
3.未有真正積分扣除；
4.未有正式優惠券派發；
5.分數只由前端自行決定；
6.Session及每日次數只儲存在Memory；
7.分數提交失敗後無法補交；
8.護盾／無敵碰撞仍可造成非法座標；
9.Idempotency重試可錯誤由4xx變成200；
10.未完成基本API存取權限及安全限制。

G. Issue Tracking 欄位

建議將以上項目匯入 Jira、GitHub Issues 或內部 Tracker，並加入以下欄位：

欄位                 |                例子
————————————————————｜——————————————————————————————————————————
Issue ID            ｜       例如 GAME-01、API-01
Title               ｜             問題名稱
Type                ｜  Bug／Feature／Security／Technical Debt
Priority            ｜           P0／P1／P2／P3
Environment         ｜        Local／UAT／Production
Owner               ｜    Frontend／Backend／App／QA／Product
Status              ｜ Open／In Progress／Ready for QA／Closed
Reproduction Steps  ｜            重現步驟
Expected Result     ｜             預期結果
Actual Result       ｜             實際結果
Acceptance Criteria ｜             驗收條件
Target Release      ｜            預計修正版本
Evidence            ｜  Screenshot／Video／Log／Session ID
