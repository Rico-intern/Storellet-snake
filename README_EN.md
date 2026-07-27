Storellet Jai Snake Game
Document purpose: To explain the game rules, underlying logic, and system integration rules.

Important Notes
1. Items 1 to 16 cover the game rules and underlying operational logic.
2. Items 17 to 20 cover the system integration rules for member points, daily game attempts, score submission, and coupon issuance.

========================================
A. Game Rules and Underlying Logic
========================================

1. Game Objective and Definition of Fatal Collision
The player controls the snake to eat food on the game board and earn points while avoiding walls, obstacles, the snake's own body, and monsters.

A “fatal collision” means any of the following collisions occurs while the snake is not protected by the initial invincibility period or an active shield:
1. The snake's head hits a wall.
2. The snake's head hits an obstacle.
3. The snake's head hits its own body.
4. When the snake is fewer than 5 cells long, the snake's head hits a monster.
5. When the snake is fewer than 5 cells long, a monster hits the snake's head or body.

The game ends immediately when a fatal collision occurs.

2. Game Board
1. The game board is 20 cells wide and 29 cells high, with a total of 580 cells.
2. Each cell corresponds to a 20 × 20 pixel game unit.
3. The wall is the outermost boundary of the game board.

3. Snake Controls and Movement Cycle
1. The player controls the snake using the up, down, left, and right directional buttons at the bottom of the screen.
2. When opened on a computer, the keyboard arrow keys can also be used.
3. The snake cannot make an immediate 180-degree turn. For example, when the snake is moving right, it cannot immediately turn left.
4. The “snake movement cycle” means the time between the snake automatically moving forward by 1 cell and its next automatic forward movement by 1 cell.
5. The snake's initial movement cycle is 160 milliseconds.
6. For every 10 points earned, the movement cycle is reduced by 7 milliseconds, down to a minimum of 75 milliseconds.
7. Only one valid directional input is accepted per movement cycle. The new direction takes effect on the snake's next movement.
8. Pressing a directional button on mobile triggers light vibration. The actual effect depends on device and WebView support.


4. Manhattan Distance Calculation
Manhattan distance is used to calculate the number of cells between an obstacle and the snake's initial body.

Calculation:
Manhattan distance = horizontal cell difference + vertical cell difference

Examples:
1. If two positions differ by 3 cells horizontally and 0 cells vertically, the Manhattan distance is 3 cells.
2. If two positions differ by 2 cells horizontally and 1 cell vertically, the Manhattan distance is 3 cells.
3. If two positions differ by 2 cells horizontally and 2 cells vertically, the Manhattan distance is 4 cells.

The Manhattan distance between an obstacle and every cell of the snake's initial body must be at least 4 cells.


5. Initial Snake Generation
1. The snake's initial length is 3 cells.
2. The snake's initial movement direction is right.
3. The snake is generated before obstacles, food, and monsters.
4. Every cell of the snake's initial body remains at least 2 cells away from the game board boundary.
5. When obstacles are generated, each obstacle remains at least 4 Manhattan-distance cells away from every cell of the snake's initial body.
6. When a monster is generated, its position does not overlap the snake's body.

6. Food Types, Scores, and Snake Growth
There are five types of food on the game board:
1. Egg: 1 point
2. Shiitake Mushroom: 1 point
3. Sliced Beef: 1 point
4. Topping: 1 point
5. Wing Nin Cart Noodles: 5 points

Each time the snake eats one food item, its body increases by 1 cell.

7. Food Generation and Refresh
1. Each time food is generated, Wing Nin Cart Noodles have a 10% spawn probability.
2. The remaining 90% is distributed equally among Egg, Shiitake Mushroom, Sliced Beef, and Topping, giving each a 22.5% probability.
3. At the start of the game, 3 food items are generated on the board.
4. A food item is not generated in a position that overlaps the snake's body, an obstacle, another food item, a treasure chest, or a monster.
5. Food can be generated in cells along the edge of the game board.
6. Each food item has an independent lifespan of 12 seconds.
7. When a food item is eaten or has existed for 12 seconds, the system removes it and immediately generates a new food item, keeping 3 food items on the board.


8. Obstacle Generation
1. At the start of each game, the system randomly generates 7 to 11 obstacles.
2. Once generated at the start of the game, obstacle positions remain fixed until the game ends.
3. Obstacles remain at least 2 cells away from the game board boundary.
4. The Manhattan distance between an obstacle and every cell of the snake's initial body must be at least 4 cells.
5. Obstacles do not overlap each other.
6. Obstacles may be adjacent vertically or horizontally, forming short walls or passages.


9. Treasure Chest Generation
1. After the game starts, a treasure chest spawn check is performed every 15 seconds.
2. Each check has a 50% chance of generating 1 treasure chest.
3. A maximum of 1 treasure chest can exist on the board at any time.
4. A maximum of 8 treasure chests can be generated in each game.
5. A treasure chest is not generated in a position that overlaps the snake's body, an obstacle, food, or a monster.
6. A treasure chest remains until collected by the snake or until the game ends.

10. Treasure Chest Effects
There are four treasure chest effects, each with the same selection probability of 25%:

1. Halve the snake's body length
   - The snake's body length is rounded up.
   - A minimum body length of 3 cells is retained.

2. Double score for 10 seconds
   - Normal food increases from 1 point to 2 points.
   - Wing Nin Cart Noodles increase from 5 points to 10 points.
   - The snake's body still increases by 1 cell per food item.

3. Shield for 10 seconds
   - The shield can block one collision with a wall, obstacle, the snake's body, or a monster.
   - The shield ends immediately after successfully blocking a collision.
   - The shield expires immediately when the 10-second countdown ends.

4. Freeze all monsters for 5 seconds
   - All monsters stop moving for 5 seconds.
   - Monster type conversion timers continue running.

If the same timed effect is selected again before the existing effect ends, its countdown restarts from the moment it is selected again.


11. Monster Generation and Quantity
1. One monster is generated immediately when the game starts.
2. The initial monster has a 50% chance of being a blue patrol monster and a 50% chance of being a red tracking monster.
3. A monster's spawn position remains at least 2 cells away from the game board boundary.
4. A monster's spawn position does not overlap the snake's body, an obstacle, food, a treasure chest, or another monster.
5. After the game starts, 1 additional monster is added every 30 seconds.
6. A maximum of 5 monsters can exist on the board at the same time.

12. Blue Patrol Monster Logic and Movement Cycle
1. The “blue patrol monster movement cycle” means the time between the monster completing one movement decision and moving forward by up to 1 cell, and its next movement decision.
2. The blue patrol monster's movement cycle is fixed at 160 milliseconds.
3. During each movement cycle, the monster moves by no more than 1 cell.
4. Its basic movement direction is horizontally left or right.
5. When it reaches the left or right boundary of the game board, the monster reverses its horizontal direction.
6. When an obstacle or another monster is directly ahead, the system calculates a cell-by-cell detour route. The monster moves up or down around the obstruction, then continues in its original horizontal direction.
7. A detour route consists of single-cell horizontal or vertical movements.
8. If no valid position can be found during the movement cycle, the monster remains in place and reassesses during the next 160-millisecond movement cycle.
9. When the monster freeze effect is active, the movement cycle is paused. After the freeze ends, movement decisions resume once every 160 milliseconds.

13. Red Tracking Monster Logic
1. The red tracking monster makes one movement decision every 2 seconds and moves by no more than 1 cell each time.
2. Before each movement decision, the system reads the snake head's latest position again.
3. If the snake's head is horizontally or vertically aligned with the monster, the monster moves 1 cell towards the snake's head.
4. If the snake's head differs on both the X-axis and Y-axis, the monster moves diagonally by 1 cell, meaning 1 cell on both the X-axis and Y-axis.
5. If the direct tracking position is blocked by an obstacle or another monster, the system compares valid positions on the X-axis and Y-axis and selects the movement that brings the monster closer to the snake's head.
6. If there is no valid position for that movement decision, the monster remains in place and reassesses during the next 2-second movement cycle.
7. When the monster freeze effect is active, the movement cycle is paused. After the freeze ends, movement decisions resume once every 2 seconds.

14. Monster Type Conversion and Movement Position
1. Each monster begins its own timer from its individual spawn time and changes type every 5 seconds.
2. A blue patrol monster changes into a red tracking monster, or a red tracking monster changes into a blue patrol monster.
3. Each monster has an independent 5-second conversion timer.
4. After a monster changes into a blue monster, it is assigned a horizontal movement direction.
5. When moving, monsters avoid the game board boundary, obstacles, and other monsters.
6. A monster's movement position may overlap food or a treasure chest.

15. Monster Collision and Knockback
1. When the snake is fewer than 5 cells long, a collision between the snake and a monster is treated as a fatal collision. The initial invincibility period or an active shield takes precedence in handling the collision.
2. When the snake is 5 cells long or more:
   - If the snake's head hits any type of monster, the monster is knocked back.
   - If any type of monster hits the snake's head or body, the monster is also knocked back.
   - The same knockback rules apply to both frontal and side collisions.
3. Knockback only pushes the monster to a nearby available position. The number of monsters and the player's score remain unchanged.
4. The knockback position avoids areas outside the game board, obstacles, other monsters, and the snake's body.
5. If there is no available nearby position, the monster remains in place and changes its movement direction.


16. Initial Invincibility, Game Speed, Time Limit, and End Conditions

A. Initial Invincibility Period
1. After the game officially starts, the snake receives 5 seconds of invincibility.
2. If the snake hits a wall during invincibility, it bounces back and reverses its movement direction.
3. If the snake collides with a monster during invincibility, the game continues.
4. The initial invincibility state takes precedence in handling collisions. If a shield is also active, the shield remains available.
5. If the snake hits an obstacle or its own body during invincibility, the collision is blocked.

B. Snake Movement Speed
1. 0 to 9 points: move 1 cell every 160 milliseconds.
2. For every 10 points earned, the movement cycle is reduced by 7 milliseconds.
3. 10 to 19 points: move 1 cell every 153 milliseconds.
4. 20 to 29 points: move 1 cell every 146 milliseconds.
5. From 130 points onwards: move 1 cell every 75 milliseconds and remain at this maximum speed.

C. Game Time Limit
1. Each game lasts for a maximum of 20 minutes, or 1,200 seconds.
2. The system automatically ends the game after 1,200 seconds.
3. After the on-screen timer reaches 999 seconds, it remains displayed as 999, while the game timer continues until 1,200 seconds.

D. Score and High Score Display
1. The SCORE and 1UP fields at the top display 4 digits.
2. When the score exceeds 9,999 points, the top fields display the last 4 digits of the score.
3. The result screen and reward determination use the complete actual score.
4. The high score record is stored in the browser's local data on the player's device.

E. Game End Conditions
The game ends under the following conditions:
1. A fatal collision defined in Section 1 occurs.
2. The game time reaches 1,200 seconds.

After the game ends, the result screen displays the complete score and the corresponding reward result.

17. Coupon Score Thresholds
1. 0 to 14 points: Not eligible for a coupon.
2. 15 to 29 points: HK$2 off upon spending HK$50 coupon.
3. 30 to 49 points: HK$3 off upon spending HK$50 coupon.
4. 50 points or above: HK$5 off upon spending HK$50 coupon.

18. Daily Game Attempts and Points
1. Each member may play a maximum of 3 times per day.
2. The first game each day is free.
3. The second and third games each day deduct 10 points per game.
4. Before the game officially starts, the frontend creates a Game Session with the server.
5. The game starts only after the server confirms that the member has remaining game attempts and sufficient points.
6. Point deductions for the second and third games are handled by the official member points system.


19. Score Submission and Reward Issuance
1. When the game starts, the API creates a unique Session ID.
2. After the game ends, the frontend submits the member ID, Session ID, final score, game duration, and end reason.
3. The same Session accepts only one valid settlement.
4. The backend determines the reward tier based on the final score.
5. Each game issues 1 corresponding coupon based on that game's final score.
6. The coupon is valid for 7 days after issuance.
7. The coupon is issued within 2 business days.
8. The coupon cannot be used together with other offers.

20. Production System Integration Controls
1. Member login identity and Access Token validation.
2. Member points balance checking and deduction.
3. Daily game attempts recorded by the server and database.
4. Each Game Session uses a unique Session ID.
5. The same Session can submit only one valid score.
6. The same Session can deduct points and issue a coupon only once.
7. The backend validates game duration, score growth, and Session status.
8. Production coupon Template ID and coupon issuance API integration.
9. API operation logs, error handling, and database storage.

========================================
B. Technology Stack — Relationships Between Files
========================================
Storellet Snake Game API Starter Kit

Technology Stack and Collaboration of the Six Files

1. Document Purpose
This document explains the technologies used by the six files other than README.md, the purpose of each file, and how the game frontend, Mock API, Node.js dependencies, API specification, and testing tools work together.

The six files are:
Storellet_snake_api_integrated.html
server.js
package.json
package-lock.json
openapi.yaml
Storellet_Snake_API.postman_collection.json

2. Overall Technical Architecture

This Starter Kit uses a decoupled frontend and backend architecture:

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
                ├─ Create Game Session
                ├─ Manage daily game attempts
                ├─ Receive game scores
                ├─ Validate Session status
                └─ Calculate reward eligibility

Other files handle dependency management, API specifications, and testing:

package.json
└─ Defines Node.js dependencies, version requirements, and start commands

package-lock.json
└─ Locks the exact installed package versions, dependency tree, and integrity data

openapi.yaml
└─ Defines the API Contract between the frontend and backend

Postman Collection
└─ Tests API Endpoints and the complete Game Session flow

3. Technology Stack Overview

Layer       |        Technology           | Purpose
---------------------------------------------------
Frontend       |HTML5                 | Builds the game page and WebView content
UI         |CSS3                 | Provides mobile full-screen, responsive layouts, and a retro game interface
Frontend Logic    |Vanilla JavaScript   | Runs the game, input handling, scoring, and API integration
Game Rendering    |HTML5 Canvas 2D API  | Draws the snake, food, monsters, obstacles, and treasure chests
Frontend-Backend Communication   |Fetch API            | Calls the backend REST API from the HTML
Data Format     |JSON                 | Transfers Session, score, and reward data
Backend Runtime |Node.js 18 or above       | Runs the Mock API Server
Backend Framework|Express 4           | Creates API Routes and handles HTTP Requests
Cross-Origin Configuration   |CORS                 | Allows WebView or Browser calls to the API
Session ID  |Node.js Crypto       | Generates a unique UUID
Temporary Data     |JavaScript Map       | Stores Sessions, daily attempts, and Idempotency results
Package Management     |npm                  | Installs, locks, and runs Node.js dependencies
API Specification     |OpenAPI 3.0.3        | Defines Endpoints, Requests, Responses, and error codes
API Testing     |Postman              | Tests Endpoints and the complete Session flow

4. Purpose of the Six Files

4.1 Storellet_snake_api_integrated.html

Role

This file is the game frontend and also acts as the API Client.

Main responsibilities:
1. Displays the game interface.
2. Runs the snake, food, monster, obstacle, and treasure chest logic.
3. Handles mobile directional buttons and keyboard input.
4. Creates a Game Session through the API before the game starts.
5. Stores the sessionId returned by the API.
6. Submits the score and game result after Game Over.
7. Displays the coupon eligibility returned by the API.

Technologies used
1. HTML5
2. CSS3
3. Vanilla JavaScript
4. Canvas 2D API
5. Fetch API
6. URL Query Parameters
7. WebView JavaScript Injection

Relationship with other files
1. Calls the REST API provided by server.js.
2. Request and Response formats should comply with openapi.yaml.
3. The same API flow can be simulated using the Postman Collection.

4.2 server.js

Role:

This file is a Node.js Mock REST API Server used to simulate the game integration flow of the production Storellet Backend.

Main responsibilities:
1. Creates Game Sessions.
2. Manages each member's daily game attempts.
3. Calculates whether the current game is free or whether points should be deducted.
4. Receives the game score, game duration, and end reason.
5. Validates the Session, member, and submitted data.
6. Calculates reward eligibility based on the score.
7. Uses an Idempotency Key to prevent the same Request from being processed repeatedly.

Technologies used
1. Node.js
2. Express
3. CORS
4. crypto.randomUUID()
5. JavaScript Map
6. REST API
7. JSON Request and Response

Relationship with other files
1. Run by the start command in package.json.
2. Uses the Express and CORS packages declared in package.json.
3. The actual installed versions are locked by package-lock.json.
4. Endpoints and data structures should be consistent with openapi.yaml.
5. Can be tested directly using the Postman Collection.

4.3 package.json

Role

This file is the main package configuration file for the Node.js project and defines:
1. Project name and version.
2. Node.js version requirements.
3. Production Dependencies.
4. npm start and development commands.

Main dependencies

"express": "^4.21.2",
"cors": "^2.8.5"

express: Creates the REST API and handles HTTP Requests.

cors: Allows the game HTML or App WebView to call the API across origins.

Common commands

Install dependencies:

npm install

Start the API:

npm start

Development mode:

npm run dev

Relationship with other files

package.json
    │
    ├─ Declares the packages required by server.js
    ├─ Defines npm start to execute server.js
    └─ Uses package-lock.json to lock the exact package versions

4.4 package-lock.json

Role

This file is automatically generated by npm and locks the exact dependency versions and dependency tree installed for the entire Node.js project.

package.json may use a version range, for example:

"express": "^4.21.2"

package-lock.json records the exact version actually installed, as well as the versions of other sub-packages required by Express.

Main purposes
1. Ensures that development, UAT, CI/CD, and Production install the same package versions.
2. Records the complete dependency tree.
3. Records package download sources and integrity hashes.
4. Improves installation speed and reproducibility.
5. Reduces environment differences caused by automatic package upgrades.

Division of responsibilities between package.json and package-lock.json

File              |        Purpose
-----------------|-----------------------------
package.json     | Declares which packages the project needs and the acceptable version ranges
package-lock.json| Records the exact installed versions and the complete dependency tree

Installation method

General development environment:

npm install

1. Reads package.json and package-lock.json.
2. Installs dependencies.
3. If dependency settings change, package-lock.json may be updated.

Recommended for CI, UAT, or Production:

npm ci

1. Installs strictly according to package-lock.json.
2. Does not modify the Lock File automatically.
3. If package.json and package-lock.json are inconsistent, installation fails, preventing deployment of incorrect versions.

Management principles

1. package-lock.json should be committed to version control together with package.json.
2. Manual editing of package-lock.json is not recommended.
3. When changing dependencies, update package.json and then run npm install to generate a new Lock File.
4. The Tech Team should review changes to both files during Code Review.


4.5 openapi.yaml

Role

This file is the API Contract between the frontend and backend and uses the OpenAPI 3.0.3 format.

Main definitions:
1. API Base URL.
2. Endpoint and HTTP Method.
3. Request Body.
4. Response Body.
5. Required Field.
6. Data Type.
7. HTTP Status Code.
8. Error Response.
9. Idempotency Key.
10. Bearer Token specification.
11. Session, Reward, and Player Status Schema.

Relationship with other files
1. Requests sent by the HTML should comply with this specification.
2. Routes, Validation, and Response formats in server.js should comply with this specification.
3. Test Requests in the Postman Collection should also comply with this specification.
4. server.js currently does not automatically read openapi.yaml at Runtime, so developers must update both files when modifying the API.


4.6 Storellet_Snake_API.postman_collection.json

Role

This file is a Postman API test collection that allows the Tech Team and QA to test the API directly without entering the game screen.

Main test flow

Get game config
        ↓
Get player status
        ↓
Start game session
        ↓
Obtain sessionId
        ↓
Finish game session
        ↓
Get session and verify the result

Relationship with other files
1. Calls the API provided by server.js.
2. Request and Response formats should comply with openapi.yaml.
3. Simulates the HTML start-game and settlement flow.
4. After the production Backend is completed, only the baseUrl needs to be updated for UAT.
5. The Postman Collection is used only for development, testing, and troubleshooting and does not participate in the production game Runtime.


5. Complete Collaboration Flow of the Six Files

5.1 Installation and Startup

package.json
    │
    ├─ Declares required dependencies and start commands
    │
package-lock.json
    │
    ├─ Locks the exact installed versions
    │
    ▼
npm ci／npm install
    │
    ▼
Install Express and CORS
    │
    ▼
npm start
    │
    ▼
server.js starts the Mock API

5.2 Starting the Game

Player presses “Start Game”
        │
        ▼
Storellet_snake_api_integrated.html
        │
        │ POST /game/sessions/start
        ▼
server.js
        │
        ├─ Checks today's attempts
        ├─ Calculates the point cost for this game
        ├─ Creates sessionId
        └─ Returns Session data
        │
        ▼
HTML stores sessionId and starts the game

5.3 Game Settlement

Game Over
    │
    ▼
HTML prepares score, durationMs, and endReason
    │
    │ POST /game/sessions/{sessionId}/finish
    ▼
server.js
    │
    ├─ Validates the Session
    ├─ Validates the member
    ├─ Validates the score and duration
    ├─ Calculates the reward tier
    └─ Returns Reward Status
    │
    ▼
HTML displays the score and reward result

5.4 Specification and Testing

openapi.yaml
    ├─ Specifies HTML Requests
    ├─ Specifies server.js Responses
    └─ Provides QA acceptance criteria

Postman Collection
    ├─ Tests server.js
    ├─ Validates the OpenAPI Contract
    └─ Simulates the complete HTML API Flow

6. Runtime Components and Supporting Components

                File                         | Directly Used at Runtime | Category

Storellet_snake_api_integrated.html         |       Yes           | Frontend runtime component
server.js                                   |       Yes           | Backend runtime component
package.json                                |   Used during startup and installation   | Project configuration and dependency declaration
package-lock.json                           |    Used during installation       | Exact dependency version lock
openapi.yaml                                |       No           | API specification and integration document
Storellet_Snake_API.postman_collection.json |       No           | API testing tool

The core programs during system operation are:

Storellet_snake_api_integrated.html
server.js

Whether the Node.js Server can be installed and started correctly and consistently is jointly managed by the following two files:

package.json
package-lock.json

OpenAPI and Postman do not participate in the production Runtime, but they are responsible for interface consistency, cross-team integration, testing, and acceptance.

7. Recommended Deployment Flow

Development environment

npm install
npm run dev

UAT／CI／Production environment

npm ci
npm start

It is recommended to use npm ci for UAT and Production to ensure that installation follows package-lock.json exactly and avoids dependency differences between environments.

8. Production Integration Direction

At production launch, the upstream Backend should use openapi.yaml as the interface standard, replace or rewrite the Mock logic in server.js, and complete:
1. Member identity authentication.
2. Points balance enquiry and deduction.
3. Daily game attempt management.
4. Permanent Game Session storage.
5. Score and game duration validation.
6. Duplicate submission protection.
7. Reward eligibility determination.
8. Coupon issuance.
9. Audit Log and error tracking.
10. Production security and Rate Limit settings.

The frontend HTML only needs to update the API Base URL, Access Token, User ID, and environment settings. The core game logic does not need to be redeveloped.

========================================
C. Known Issues and Incomplete Features
========================================

1. Status and Priority Definitions

Priority        ｜ Definition
P0 — Launch Blocker ｜ Can bypass campaign rules, cause incorrect point deductions or reward issuance, data loss, security risks, or core game-state errors; must be completed before production launch.
P1 — High Priority   ｜ Affects game fairness, client acceptance, major user flows, or causes clear errors; recommended to complete before UAT.
P2 — Medium Priority ｜ Does not necessarily prevent gameplay, but causes display, user experience, maintenance, or operational issues.
P3 — Optimisation Item ｜ A later improvement for analytics or management efficiency; does not affect basic game operation.

Recommended statuses:

Open: Not started
In Progress: Work in progress
Ready for QA: Completed and awaiting testing
Closed: Accepted and completed
Accepted Limitation: Known limitation that is confirmed as out of scope for the current phase

A. Confirmed Game Program Issues

GAME-01　The snake head position is not corrected after a shield or invincibility blocks a collision with an obstacle or the snake's body
Priority: P0
Status: Open
Type: Game State／Collision Handling

Current Situation
When the snake's head hits an obstacle or its own body while the initial invincibility period or an active shield is still in effect, the program cancels Game Over but does not move the snake's head back to its pre-collision position, a rebound position, or another valid position.

Potential Impact

1. The snake's head may enter the cell occupied by an obstacle.
2. The snake's head may overlap its own body.
3. The next movement cycle may trigger another collision.
4. The snake body array may contain duplicate coordinates, making subsequent self-collision detection unstable.

Recommended Fix
1. After a collision is blocked, one of the following explicit actions must be performed:
2. Keep the snake's head at its pre-collision position; or
3. Bounce the snake back to a valid cell in the opposite direction; or
4. Enable a pass-through mode for a defined period and clearly define the position when pass-through ends.

GAME-02　A monster is still treated as “successfully knocked back” when it cannot be moved to a safe position

Priority: P1
Status: Open
Type: Monster Collision／Coordinate Overlap

Current Situation
When the snake hits a monster and meets the knockback conditions, but there is no available position around the monster, the program leaves the monster in place while still returning “successful knockback”.

Potential Impact
1. The snake's head may then enter the same cell still occupied by the monster.
2. The snake and monster may overlap visually.
3. The next update cycle may produce inconsistent collision results.

Recommended Fix

If the monster cannot be pushed to a safe position, use one of the following approaches:
1. Cancel the snake's movement for that cycle;
2. Bounce the snake back;
3. Move the monster to the nearest safe position found through a full-board search;
4. Explicitly treat the knockback as failed and process the collision according to the rules.

GAME-03　The game rules page is inconsistent with the actual program logic

Priority: P1
Status: Open
Type: Content／Acceptance Specification

Known Inconsistencies

1. The rules page states that Wing Nin Cart Noodles increase the snake's body by 5 cells, but the actual program increases the body by only 1 cell and adds 5 points.
2. The rules page states that the snake must be “more than 5 segments” long and collide from the side to knock back a monster. The actual program uses a snake length of 5 cells or more, and knockback may be triggered by frontal or side collisions, whether the snake hits the monster or the monster hits the snake.
3. The rules page states that the blue patrol monster is slower than the snake. In the actual program, both move at 1 cell every 160 milliseconds at the start, after which the snake accelerates as its score increases.
4. Some “instant death” descriptions on the rules page do not mention the exceptions for initial invincibility and shield protection.

Potential Impact

1. The client may perform acceptance testing against incorrect wording.
2. Players may dispute game results.
3. The Confirmation List, frontend, and API specifications may use different versions.

Recommended Fix

Use the signed Confirmation List as the single source of truth and synchronise the following:
1. Game rules page
2. Rewards page
3. HTML constants and logic
4. API Config
5. OpenAPI examples
6. QA Test Cases

GAME-04　Monsters can overlap food or treasure chests

Priority: P1
Status: Open／Pending confirmation on whether this is acceptable
Type: Object Collision／Visual and Fairness

Current Situation

When moving, monsters avoid only the game board boundary, obstacles, and other monsters. They do not avoid food or treasure chests.

Potential Impact
1. Food or treasure chests may be covered by a monster and may not be clearly visible to the player.
2. When attempting to collect food or a treasure chest, the player may trigger a monster collision first.
3. It is difficult to determine visually which objects occupy the same cell.

Recommended Fix

The client should confirm one of the following rules:
1. Monsters must avoid food and treasure chests when moving; or
2. Monsters may overlap them, but the game must provide clear layered display and define collision priority.

GAME-05　Game time and timed effects continue using real time after the App enters the background

Priority: P1
Status: Open
Type: WebView／App Lifecycle

Current Situation

The game has no formal Pause or App Lifecycle handling. When the player switches Apps, locks the screen, or the WebView enters the background, visual updates may pause, but time calculations continue using system time.

Potential Impact
When returning to the game:
1. Food may have expired and respawned.
2. Shield, double score, invincibility, or monster freeze effects may have ended.
3. Monster types may have changed.
4. Total game time includes the time spent outside the App.
5. A long absence may cause the game to reach the 20-minute limit immediately.

Recommended Fix

The product rule must be confirmed:
Pause automatically when the App enters the background; or
End the current game immediately when the App enters the background; or

Keep the current real-time behaviour, but state it clearly in the rules.

GAME-06　The displayed game time is inconsistent with the actual limit

Priority: P2
Status: Open
Type: Display Limitation

Current Situation

The game can run for up to 1,200 seconds, but the timer at the top displays only up to 999 seconds.

Potential Impact

During the final 201 seconds, the player cannot know the actual elapsed or remaining time.

Recommended Fix
Extend the timer to 4 digits, or change it to MM:SS format.

GAME-07　The score and high score at the top display only the last 4 digits

Priority: P2
Status: Open
Type: Display Limitation

Current Situation

The actual score may exceed 9,999, but the SCORE and 1UP fields retain only the last 4 digits.

Potential Impact

For example, an actual score of 10,250 may display as 0250, causing the player to think the score has decreased or reset.

Recommended Fix
Limit the maximum score to 9,999; or
Extend the number of displayed digits; or
Use an abbreviated format and display the full score on the result screen.

GAME-08　The local high score can be modified and is not synchronised across devices

Priority: P2
Status: Open／Accepted Limitation
Type: Data Reliability

Current Situation

The high score is stored only in browser localStorage.

Potential Impact
1. The high score disappears after App or browser data is cleared.
2. The high score cannot be synchronised after changing devices.
3. Players can use browser tools to modify the local high score.
4. Different members using the same device may share the same high score.

Recommended Fix

The production version should store high scores and game records in the backend by member.

B. API Integration and Flow Issues

API-01　Non-mandatory API mode can bypass daily attempts, points, and server restrictions
Priority: P0
Status: Open
Type: Campaign Rule Bypass

Current Situation

When the API connection fails and apiRequired is not set to true, the frontend continues by starting the game in offline mode.

This handling may also apply to:
1. A 429 response when daily attempts are exhausted;
2. Future insufficient-points responses;
3. Authentication failures;
4. API Server outages.

Potential Impact

A player may continue playing without a valid Session, without point deduction, or after reaching the daily attempt limit.

Recommended Fix

Production must:
1. Enforce API_REQUIRED = true;
2. Handle different error codes separately;
3. Never fallback to offline gameplay for 401／402／403／429;
4. Allow offline start only in explicitly approved Demo／Local Mode.

API-02　API functionality is completely disabled if the App does not inject API settings

Priority: P0
Status: Open
Type: Configuration Risk

Current Situation

The API is Disabled by default and must be actively enabled by the App WebView or URL Parameter.

Potential Impact

If the Production WebView omits any critical setting, the game may run entirely in frontend-only mode without attempt limits, point deductions, score submission, or reward controls.

Recommended Fix

The Production Build should:
1. Require the API by default;
2. Display a blocking error when the API Base URL, User ID, or Token is missing;
3. Prevent guest-user from entering a production campaign.

API-03　A game attempt is counted when a Session starts, even if the game does not actually begin

Priority: P0
Status: Open
Type: Incorrect Attempt Deduction／Point Deduction Risk

Current Situation

When the player presses start, the API immediately increments the daily attempt count before the countdown and game begin.

Trigger Scenarios
Close the page after creating the Session.
The App crashes during the countdown.
The WebView is closed.
Game resources fail to initialise.
The player leaves before the game officially starts.

Potential Impact

The player loses one game attempt and, after formal points integration, may also be charged points without actually playing.

Recommended Fix

Use a two-stage flow:
1. reserve/start: reserve an attempt without formal point deduction;
2. Call activate after the frontend successfully enters the game;
3. Automatically cancel an unactivated Session after a short period; or
Provide a cancellation and refund mechanism.

API-04　There is no actual retry option after score submission fails

Priority: P0
Status: Open
Type: Result Loss／Reward Loss

Current Situation

When submission fails, the screen displays “Please try again later”, but there is currently no:
1. Retry button;
2. Automatic retry;
3. Local pending-submission queue;
4. Reconciliation after reopening the App;
5. Customer-service resubmission process.

After the player returns to the home page or reloads, the frontend Session ID is lost.

Potential Impact

A player who completed the game may have no game record and receive no coupon.

Recommended Fix
1. Add “Resubmit” to the result screen;
2. Store pending results locally;
3. Safely retry using the same Idempotency Key;
4. Query incomplete Sessions when the App starts;
5. Provide a backend reconciliation job.

API-05　Point deduction is not clearly displayed and confirmed before the game starts

Priority: P1
Status: Open
Type: Paid Operation UX

Current Situation

After the API returns the attempt number and required point deduction, the information is shown only as a brief message and the countdown begins immediately. The message may also be covered by the countdown Overlay or cleared during game initialisation.

Potential Impact

The player may begin a game that requires point deduction without clearly confirming it.

Recommended Fix

Before the second and third games, display a centred confirmation dialog containing:
1. Points required for this game;
2. Current points balance;
3. Attempts used and remaining today;
4. Cancel／Confirm buttons;
5. Deduct points and start the game only after confirmation succeeds.

API-06　The frontend does not use /game/config for dynamic game settings

Priority: P1
Status: Open
Type: Configuration Synchronisation

Current Situation

The Mock API provides /game/config, but the HTML does not read this Endpoint. Snake speed, monster speed, food duration, treasure chest timing, and reward thresholds remain hard-coded in both the HTML and server.js.

Potential Impact
1. The frontend, API, OpenAPI, rules page, and Confirmation List can easily use different versions.
2. Changing campaign rules requires modifying and redeploying the HTML.

Recommended Fix

Read a versioned Game Config before the game starts and determine which settings are controlled by the Server and which must remain fixed in the frontend.

C. Known Security and Data Issues in the Mock API

BACKEND-01　No formal authentication; userId is supplied by the frontend

Priority: P0
Status: Incomplete
Type: Impersonation

Current Situation

The frontend can specify userId directly. Although the Mock Server accepts an Authorization Header, it does not validate the Token or derive the member identity from the Token.

Potential Impact

Anyone can use another member's userId to create a Session, check attempts, or submit a result.

Production Requirements
1. Validate the Storellet Access Token／JWT;
2. Derive the member ID from the Token;
3. Ignore or verify the userId in the Request Body;
4. Validate campaign and member eligibility.

BACKEND-02　Daily points are not actually checked or deducted

Priority: P0
Status: Incomplete
Type: Points Transaction
Current Situation

The Mock API only returns a pointsCharged value and does not:
1. Query the member's points balance;
2. Determine insufficient points;
3. Actually deduct points;
4. Create a Points Ledger Transaction;
5. Roll back after a deduction failure;
6. Prevent duplicate deductions.

Although OpenAPI includes an insufficient-points response, the Mock Server does not implement it.

BACKEND-03　Coupons are not actually issued

Priority: P0
Status: Incomplete
Type: Reward Issuance

Current Situation

The API only returns PENDING_ISSUANCE. couponTemplateCode remains TO_BE_CONFIRMED, and no production Coupon Record is created.

Outstanding Items
1. Production Coupon Template ID;
2. Coupon issuance API;
3. Coupon ID response;
4. Validity period calculation;
5. Duplicate issuance prevention;
6. Issuance failure retry;
7. Issuance Audit Log;
8. Member notification.

BACKEND-04　All data is stored only in Server Memory

Priority: P0
Status: Incomplete
Type: Data Persistence

Current Situation

Sessions, daily attempts, and Idempotency Responses are stored using JavaScript Map.

Potential Impact
1. All data is lost after the Server restarts.
2. Data is not shared between multiple Servers.
3. Players may use daily attempts repeatedly across different Instances.
4. Production reports and customer-service enquiries cannot be supported.

Production Requirements

Use a production Database and add Transactions, Indexes, a Retention Policy, and Backup.

BACKEND-05　Scores are submitted entirely by the frontend with no anti-cheat validation

Priority: P0
Status: Incomplete
Type: Game Fairness／Reward Risk

Current Situation

The API checks only that:
1. The score is an integer;
2. The score is between 0 and 99,999;
3. The game duration is within the accepted range.

The API does not validate whether the score could reasonably be achieved within the submitted game duration.

Potential Impact
Players can modify JavaScript, intercept the Request, or call the API directly to submit a high score and obtain a reward.

Production Requirements

At minimum, add:
1. Server-side validation of Session start and end times;
2. Score growth limits and reasonableness checks;
3. Game event summary／signature;
4. Nonce;
5. App／WebView integrity signals;
6. Risk flags for abnormal scores;
7. Manual review or delayed reward issuance for high-risk results.

BACKEND-06　Sessions have no expiry, cancellation, or abandonment status

Priority: P1
Status: Incomplete
Type: Session Lifecycle

Current Situation

Sessions have only STARTED and FINISHED statuses, without:
1. RESERVED
2. ACTIVE
3. ABANDONED
4. EXPIRED
5. CANCELLED
6. REJECTED

Potential Impact

Incomplete Sessions remain permanently and it is not possible to determine whether attempts or points should be returned.

BACKEND-07　The Idempotency implementation has status-code and scope issues

Priority: P0
Status: Open
Type: Duplicate Transaction Control

Current Situation

The Idempotency Cache stores only the Response Body and does not store the original HTTP Status Code.

When a cached error result is replayed, the Server returns the error Body with HTTP 200.

The Idempotency Key is not scoped by Endpoint, member, or operation type.

Idempotency records have no expiry time.

Potential Impact
1. An initial 429／400 response may become 200 on retry.
2. The Client may incorrectly treat the operation as successful.
3. Malicious reuse of a Key may retrieve the cached response of another operation.
4. Memory usage will continue to grow.

Recommended Fix

Store and validate:
1. HTTP Method
2. Route
3. Authenticated User ID
4. Request Body Hash
5. Response Status
6. Response Body
7. Created At／Expiry At

BACKEND-08　Player status and Session enquiries have no access control

Priority: P0
Status: Incomplete
Type: IDOR／Data Privacy

Current Situation

The following Endpoints have no authentication:
1. Query the daily attempts of a specified userId;
2. Query the Session details of a specified sessionId.

Production Requirements

Members may access only their own data;

Internal／Admin Endpoints must use separate permissions;

Do not return unnecessary internal data to the frontend.

BACKEND-09　CORS, Rate Limit, and security protection are incomplete

Priority: P0
Status: Incomplete
Type: API Security

Current Situation

The Mock Server accepts any Origin and does not provide:
1. Production Origin Allowlist;
2. Rate Limit;
3. Security Headers;
4. Request Signature;
5. WAF／Bot Protection;
6. Payload and abnormal traffic monitoring;
7. Mandatory HTTPS.

BACKEND-10　Campaign start, end, and enabled status are not controlled by the backend

Priority: P1
Status: Incomplete
Type: Campaign Control

Current Situation

The API does not check:
1. Campaign start time;
2. Campaign end time;
3. Campaign enabled／disabled status;
4. Member eligibility;
5. Supported App Version;
6. Maintenance Mode.

Potential Impact

Sessions may still be created or results submitted after the campaign ends.

BACKEND-11　No complete Audit Log, monitoring, or alerting

Priority: P1
Status: Incomplete
Type: Operations and Incident Tracking

Outstanding Items
1. Request／Trace ID;
2. Session Lifecycle Log;
3. Point deduction Log;
4. Coupon issuance Log;
5. Abnormal score Log;
6. API Error Dashboard;
7. Failure-rate and latency monitoring;
8. Alert mechanism;
9. Customer-service enquiry interface.

BACKEND-12　The OpenAPI specification has no automatic Contract Validation with the Server

Priority: P2
Status: Incomplete
Type: Specification Synchronisation

Current Situation

openapi.yaml, HTML, Postman Collection, and server.js must be synchronised manually.

Potential Impact
After one file is updated, the others may continue using old fields, old status codes, or old rules.

Recommended Fix

Add:
1. OpenAPI Schema Validation Middleware;
2. Contract Tests;
3. CI Pipeline;
4. Postman／Newman Tests;
5. API Schema Version.

D. Incomplete Product Features

FEATURE-01　“My Game Records” page and backend history records

Priority: P1
Status: Incomplete

The current HTML has no “My Game Records” entry, record list, or corresponding API.

Recommended display fields:
1. Game date and time;
2. Final score;
3. Whether the game was free or required points;
4. Coupon issued;
5. Issuance status;
6. Session／Reference No.;
7. Submission failed or pending status.

FEATURE-02　Fixed food legend display

Priority: P2
Status: Incomplete

The current game screen has no fixed food legend. Players must rely on the rules page to remember each food item and score.

FEATURE-03　Exit button and exit handling during gameplay

Priority: P1
Status: Incomplete

There is currently no formal Exit button during gameplay, and the following are not defined:
1. Whether exiting counts as one used attempt;
2. Whether to submit 0 points or the current score;
3. Whether deducted points are refunded;
4. Which status should be assigned to the Session.

FEATURE-04　Daily attempts, remaining attempts, and points balance interface

Priority: P1
Status: Incomplete

The home page does not continuously display:
1. Attempts used today;
2. Attempts remaining today;
3. Points required for the next game;
4. Current points balance;
5. Insufficient-points status.

FEATURE-05　Dynamic management of campaign terms and conditions

Priority: P1
Status: Incomplete

The current Starter Kit does not read the following from Supabase／CMS／the production API:
1. Page title;
2. Terms and conditions content;
3. Enabled／disabled status;
4. Updated time;
5. Terms version;
6. Player consent record.

FEATURE-06　Dynamic management of rewards and game settings

Priority: P1
Status: Incomplete

The following settings remain hard-coded:
1. Reward score thresholds;
2. Coupon values;
3. Coupon Template ID;
4. Number of game attempts;
5. Point cost for additional games;
6. Food scores and spawn rates;
7. Monster speed;
8. Treasure chest effects and durations;
9. Campaign period.

FEATURE-07　Resubmission and reconciliation mechanism for failed score submissions

Priority: P0
Status: Incomplete

In addition to frontend retry, the backend still lacks:
1. Incomplete Session enquiry;
2. Scheduled Reconciliation Job;
3. Handling when points were deducted but the game was not completed;
4. Reissuance when the game was completed but the coupon was not issued;
5. Customer-service manual reissuance permissions and Audit Log.

FEATURE-08　Production App WebView identity and environment injection

Priority: P0
Status: Incomplete／Pending App Team integration

The App Team must formally provide:
1. API Base URL;
2. Access Token;
3. Authenticated User ID;
4. Platform;
5. App Version;
6. Campaign ID;
7. Environment;
8. WebView close／background／resume events.

FEATURE-09　Game analytics events and performance tracking

Priority: P3
Status: Incomplete

Recommended tracking:
1. Home page impression;
2. Rules and rewards page opens;
3. Start game;
4. Cancel point deduction;
5. Session creation failure;
6. Game Over reason;
7. Final score;
8. Treasure chest collection and effect;
9. Score submission result;
10. Coupon issuance and usage.

FEATURE-10　Automated testing and device UAT coverage

Priority: P1
Status: Incomplete

No complete automated testing is currently available, including:
1. Game unit tests;
2. Collision tests;
3. Monster pathfinding tests;
4. API Contract Tests;
5. Idempotency Tests;
6. Daily attempt and cross-day tests;
7. Concurrent point deduction tests;
8. Duplicate-submission coupon issuance tests;
9. iOS／Android WebView background-resume tests;
10. Different screen sizes and safe-area tests;
11. Weak network, disconnection, and retry tests.

E. Recommended Handling Order

Phase 1: Client Confirmation and Before UAT
1. Fix GAME-01 shield／invincibility collision position.
2. Fix GAME-02 monster knockback overlap.
3. Synchronise GAME-03 rules page and actual logic.
4. Confirm whether GAME-04 monsters may overlap food／treasure chests.
5. Define handling when the App enters the background.
6. Add daily attempt and point-deduction confirmation UI.
7. Add Exit and Session termination rules.

Phase 2: Before Production API UAT
1. Enforce the API and remove offline fallback when campaign-rule errors occur.
2. Complete Storellet identity authentication.
3. Complete production points checking and deduction.
4. Complete the Database and Session Lifecycle.
5. Fix the Idempotency implementation.
6. Add retry and reconciliation for failed submissions.
7. Make the frontend read Game Config in production.
8. Complete campaign start／end／disable controls.

Phase 3: Before Production
1. Complete coupon issuance and duplicate prevention.
2. Complete anti-cheat validation.
3. Restrict CORS and add Rate Limit and Security Headers.
4. Complete Audit Log, monitoring, and alerting.
5. Complete automated testing and iOS／Android physical-device UAT.
6. Complete “My Game Records” and customer-service reconciliation capabilities.

F. Recommended Release Gates

Conditions Under Which Production Launch Is Not Recommended

Production launch is not recommended if any of the following remains incomplete:
1. The API can be bypassed;
2. No production identity authentication;
3. No actual point deduction;
4. No production coupon issuance;
5. Scores are determined solely by the frontend;
6. Sessions and daily attempts are stored only in Memory;
7. Failed score submissions cannot be resubmitted;
8. Shield／invincibility collisions can still create invalid coordinates;
9. Idempotency retries can incorrectly change 4xx responses into 200;
10. Basic API access control and security restrictions are incomplete.

G. Issue Tracking Fields

It is recommended to import the above items into Jira, GitHub Issues, or an internal Tracker and add the following fields:

Field                 |                Example
————————————————————｜——————————————————————————————————————————
Issue ID            ｜       e.g. GAME-01, API-01
Title               ｜             Issue name
Type                ｜  Bug／Feature／Security／Technical Debt
Priority            ｜           P0／P1／P2／P3
Environment         ｜        Local／UAT／Production
Owner               ｜    Frontend／Backend／App／QA／Product
Status              ｜ Open／In Progress／Ready for QA／Closed
Reproduction Steps  ｜            Steps to reproduce
Expected Result     ｜             Expected result
Actual Result       ｜             Actual result
Acceptance Criteria ｜             Acceptance criteria
Target Release      ｜            Planned fix version
Evidence            ｜  Screenshot／Video／Log／Session ID
