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
1.1.4 When the snake is fewer than 5 cells long, the snake's head hits a monster.
1.1.5 When the snake is fewer than 5 cells long, a monster hits the snake's head or body.

The game ends immediately when a fatal collision occurs.

1.2 Game Board
1.2.1 The game board is 20 cells wide and 29 cells high, with a total of 580 cells.
1.2.2 Each cell corresponds to a 20 × 20 pixel game unit.
1.2.3 The wall is the outermost boundary of the game board.

1.3 Snake Controls and Movement Cycle
1.3.1 The player controls the snake using the up, down, left, and right directional buttons at the bottom of the screen.
1.3.2 When opened on a computer, the keyboard arrow keys can also be used.
1.3.3 The snake cannot make an immediate 180-degree turn. For example, when the snake is moving right, it cannot immediately turn left.
1.3.4 The “snake movement cycle” means the time between the snake automatically moving forward by 1 cell and its next automatic forward movement by 1 cell.
1.3.5 The snake's initial movement cycle is 160 milliseconds.
1.3.6 For every 10 points earned, the movement cycle is reduced by 7 milliseconds, down to a minimum of 75 milliseconds.
1.3.7 Only one valid directional input is accepted per movement cycle. The new direction takes effect on the snake's next movement.
1.3.8 Pressing a directional button on mobile triggers light vibration. The actual effect depends on device and WebView support.


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
1.15.1 When the snake is fewer than 5 cells long, a collision between the snake and a monster is treated as a fatal collision. The initial invincibility period or an active shield takes precedence in handling the collision.
1.15.2 When the snake is 5 cells long or more:
   - If the snake's head hits any type of monster, the monster is knocked back.
   - If any type of monster hits the snake's head or body, the monster is also knocked back.
   - The same knockback rules apply to both frontal and side collisions.
1.15.3 Knockback only pushes the monster to a nearby available position. The number of monsters and the player's score remain unchanged.
1.15.4 The knockback position avoids areas outside the game board, obstacles, other monsters, and the snake's body.
1.15.5 If there is no available nearby position, the monster remains in place and changes its movement direction.


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
2. Technology Stack — Relationships Between Files
========================================
Storellet Snake Game API Starter Kit

Technology Stack and Collaboration of the Six Files

2.1 Document Purpose
This document explains the technologies used by the six files other than README.md, the purpose of each file, and how the game frontend, Mock API, Node.js dependencies, API specification, and testing tools work together.

The six files are:
Storellet_snake_api_integrated.html
server.js
package.json
package-lock.json
openapi.yaml
Storellet_Snake_API.postman_collection.json

2.2 Overall Technical Architecture

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

2.3 Technology Stack Overview

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

2.4 Purpose of the Six Files

2.4.1 Storellet_snake_api_integrated.html

Role

This file is the game frontend and also acts as the API Client.

Main responsibilities:
2.4.1.1 Displays the game interface.
2.4.1.2 Runs the snake, food, monster, obstacle, and treasure chest logic.
2.4.1.3 Handles mobile directional buttons and keyboard input.
2.4.1.4 Creates a Game Session through the API before the game starts.
2.4.1.5 Stores the sessionId returned by the API.
2.4.1.6 Submits the score and game result after Game Over.
2.4.1.7 Displays the coupon eligibility returned by the API.

Technologies used
2.4.1.8 HTML5
2.4.1.9 CSS3
2.4.1.10 Vanilla JavaScript
2.4.1.11 Canvas 2D API
2.4.1.12 Fetch API
2.4.1.13 URL Query Parameters
2.4.1.14 WebView JavaScript Injection

Relationship with other files
2.4.1.15 Calls the REST API provided by server.js.
2.4.1.16 Request and Response formats should comply with openapi.yaml.
2.4.1.17 The same API flow can be simulated using the Postman Collection.

2.4.2 server.js

Role:

This file is a Node.js Mock REST API Server used to simulate the game integration flow of the production Storellet Backend.

Main responsibilities:
2.4.2.1 Creates Game Sessions.
2.4.2.2 Manages each member's daily game attempts.
2.4.2.3 Calculates whether the current game is free or whether points should be deducted.
2.4.2.4 Receives the game score, game duration, and end reason.
2.4.2.5 Validates the Session, member, and submitted data.
2.4.2.6 Calculates reward eligibility based on the score.
2.4.2.7 Uses an Idempotency Key to prevent the same Request from being processed repeatedly.

Technologies used
2.4.2.8 Node.js
2.4.2.9 Express
2.4.2.10 CORS
2.4.2.11 crypto.randomUUID()
2.4.2.12 JavaScript Map
2.4.2.13 REST API
2.4.2.14 JSON Request and Response

Relationship with other files
2.4.2.15 Run by the start command in package.json.
2.4.2.16 Uses the Express and CORS packages declared in package.json.
2.4.2.17 The actual installed versions are locked by package-lock.json.
2.4.2.18 Endpoints and data structures should be consistent with openapi.yaml.
2.4.2.19 Can be tested directly using the Postman Collection.

2.4.3 package.json

Role

This file is the main package configuration file for the Node.js project and defines:
2.4.3.1 Project name and version.
2.4.3.2 Node.js version requirements.
2.4.3.3 Production Dependencies.
2.4.3.4 npm start and development commands.

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

2.4.4 package-lock.json

Role

This file is automatically generated by npm and locks the exact dependency versions and dependency tree installed for the entire Node.js project.

package.json may use a version range, for example:

"express": "^4.21.2"

package-lock.json records the exact version actually installed, as well as the versions of other sub-packages required by Express.

Main purposes
2.4.4.1 Ensures that development, UAT, CI/CD, and Production install the same package versions.
2.4.4.2 Records the complete dependency tree.
2.4.4.3 Records package download sources and integrity hashes.
2.4.4.4 Improves installation speed and reproducibility.
2.4.4.5 Reduces environment differences caused by automatic package upgrades.

Division of responsibilities between package.json and package-lock.json

File              |        Purpose
-----------------|-----------------------------
package.json     | Declares which packages the project needs and the acceptable version ranges
package-lock.json| Records the exact installed versions and the complete dependency tree

Installation method

General development environment:

npm install

2.4.4.6 Reads package.json and package-lock.json.
2.4.4.7 Installs dependencies.
2.4.4.8 If dependency settings change, package-lock.json may be updated.

Recommended for CI, UAT, or Production:

npm ci

2.4.4.9 Installs strictly according to package-lock.json.
2.4.4.10 Does not modify the Lock File automatically.
2.4.4.11 If package.json and package-lock.json are inconsistent, installation fails, preventing deployment of incorrect versions.

Management principles

2.4.4.12 package-lock.json should be committed to version control together with package.json.
2.4.4.13 Manual editing of package-lock.json is not recommended.
2.4.4.14 When changing dependencies, update package.json and then run npm install to generate a new Lock File.
2.4.4.15 The Tech Team should review changes to both files during Code Review.


2.4.5 openapi.yaml

Role

This file is the API Contract between the frontend and backend and uses the OpenAPI 3.0.3 format.

Main definitions:
2.4.5.1 API Base URL.
2.4.5.2 Endpoint and HTTP Method.
2.4.5.3 Request Body.
2.4.5.4 Response Body.
2.4.5.5 Required Field.
2.4.5.6 Data Type.
2.4.5.7 HTTP Status Code.
2.4.5.8 Error Response.
2.4.5.9 Idempotency Key.
2.4.5.10 Bearer Token specification.
2.4.5.11 Session, Reward, and Player Status Schema.

Relationship with other files
2.4.5.12 Requests sent by the HTML should comply with this specification.
2.4.5.13 Routes, Validation, and Response formats in server.js should comply with this specification.
2.4.5.14 Test Requests in the Postman Collection should also comply with this specification.
2.4.5.15 server.js currently does not automatically read openapi.yaml at Runtime, so developers must update both files when modifying the API.


2.4.6 Storellet_Snake_API.postman_collection.json

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
2.4.6.1 Calls the API provided by server.js.
2.4.6.2 Request and Response formats should comply with openapi.yaml.
2.4.6.3 Simulates the HTML start-game and settlement flow.
2.4.6.4 After the production Backend is completed, only the baseUrl needs to be updated for UAT.
2.4.6.5 The Postman Collection is used only for development, testing, and troubleshooting and does not participate in the production game Runtime.


2.5 Complete Collaboration Flow of the Six Files

2.5.1 Installation and Startup

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

2.5.2 Starting the Game

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

2.5.3 Game Settlement

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

2.5.4 Specification and Testing

openapi.yaml
    ├─ Specifies HTML Requests
    ├─ Specifies server.js Responses
    └─ Provides QA acceptance criteria

Postman Collection
    ├─ Tests server.js
    ├─ Validates the OpenAPI Contract
    └─ Simulates the complete HTML API Flow

2.6 Runtime Components and Supporting Components

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

2.7 Recommended Deployment Flow

Development environment

npm install
npm run dev

UAT／CI／Production environment

npm ci
npm start

It is recommended to use npm ci for UAT and Production to ensure that installation follows package-lock.json exactly and avoids dependency differences between environments.

2.8 Production Integration Direction

At production launch, the upstream Backend should use openapi.yaml as the interface standard, replace or rewrite the Mock logic in server.js, and complete:
2.8.1 Member identity authentication.
2.8.2 Points balance enquiry and deduction.
2.8.3 Daily game attempt management.
2.8.4 Permanent Game Session storage.
2.8.5 Score and game duration validation.
2.8.6 Duplicate submission protection.
2.8.7 Reward eligibility determination.
2.8.8 Coupon issuance.
2.8.9 Audit Log and error tracking.
2.8.10 Production security and Rate Limit settings.

The frontend HTML only needs to update the API Base URL, Access Token, User ID, and environment settings. The core game logic does not need to be redeveloped.

========================================
3. Known Issues and Incomplete Features
========================================

3.1 Status and Priority Definitions

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

3.2 Confirmed Game Program Issues

3.2.1 GAME-01 — The snake head position is not corrected after a shield or invincibility blocks a collision with an obstacle or the snake's body
Priority: P0
Status: Open
Type: Game State／Collision Handling

Current Situation
When the snake's head hits an obstacle or its own body while the initial invincibility period or an active shield is still in effect, the program cancels Game Over but does not move the snake's head back to its pre-collision position, a rebound position, or another valid position.

Potential Impact

3.2.1.1 The snake's head may enter the cell occupied by an obstacle.
3.2.1.2 The snake's head may overlap its own body.
3.2.1.3 The next movement cycle may trigger another collision.
3.2.1.4 The snake body array may contain duplicate coordinates, making subsequent self-collision detection unstable.

Recommended Fix
3.2.1.5 After a collision is blocked, one of the following explicit actions must be performed:
3.2.1.6 Keep the snake's head at its pre-collision position; or
3.2.1.7 Bounce the snake back to a valid cell in the opposite direction; or
3.2.1.8 Enable a pass-through mode for a defined period and clearly define the position when pass-through ends.

3.2.2 GAME-02 — A monster is still treated as “successfully knocked back” when it cannot be moved to a safe position

Priority: P1
Status: Open
Type: Monster Collision／Coordinate Overlap

Current Situation
When the snake hits a monster and meets the knockback conditions, but there is no available position around the monster, the program leaves the monster in place while still returning “successful knockback”.

Potential Impact
3.2.2.1 The snake's head may then enter the same cell still occupied by the monster.
3.2.2.2 The snake and monster may overlap visually.
3.2.2.3 The next update cycle may produce inconsistent collision results.

Recommended Fix

If the monster cannot be pushed to a safe position, use one of the following approaches:
3.2.2.4 Cancel the snake's movement for that cycle;
3.2.2.5 Bounce the snake back;
3.2.2.6 Move the monster to the nearest safe position found through a full-board search;
3.2.2.7 Explicitly treat the knockback as failed and process the collision according to the rules.

3.2.3 GAME-03 — The game rules page is inconsistent with the actual program logic

Priority: P1
Status: Open
Type: Content／Acceptance Specification

Known Inconsistencies

3.2.3.1 The rules page states that Wing Nin Cart Noodles increase the snake's body by 5 cells, but the actual program increases the body by only 1 cell and adds 5 points.
3.2.3.2 The rules page states that the snake must be “more than 5 segments” long and collide from the side to knock back a monster. The actual program uses a snake length of 5 cells or more, and knockback may be triggered by frontal or side collisions, whether the snake hits the monster or the monster hits the snake.
3.2.3.3 The rules page states that the blue patrol monster is slower than the snake. In the actual program, both move at 1 cell every 160 milliseconds at the start, after which the snake accelerates as its score increases.
3.2.3.4 Some “instant death” descriptions on the rules page do not mention the exceptions for initial invincibility and shield protection.

Potential Impact

3.2.3.5 The client may perform acceptance testing against incorrect wording.
3.2.3.6 Players may dispute game results.
3.2.3.7 The Confirmation List, frontend, and API specifications may use different versions.

Recommended Fix

Use the signed Confirmation List as the single source of truth and synchronise the following:
3.2.3.8 Game rules page
3.2.3.9 Rewards page
3.2.3.10 HTML constants and logic
3.2.3.11 API Config
3.2.3.12 OpenAPI examples
3.2.3.13 QA Test Cases

3.2.4 GAME-04 — Monsters can overlap food or treasure chests

Priority: P1
Status: Open／Pending confirmation on whether this is acceptable
Type: Object Collision／Visual and Fairness

Current Situation

When moving, monsters avoid only the game board boundary, obstacles, and other monsters. They do not avoid food or treasure chests.

Potential Impact
3.2.4.1 Food or treasure chests may be covered by a monster and may not be clearly visible to the player.
3.2.4.2 When attempting to collect food or a treasure chest, the player may trigger a monster collision first.
3.2.4.3 It is difficult to determine visually which objects occupy the same cell.

Recommended Fix

The client should confirm one of the following rules:
3.2.4.4 Monsters must avoid food and treasure chests when moving; or
3.2.4.5 Monsters may overlap them, but the game must provide clear layered display and define collision priority.

3.2.5 GAME-05 — Game time and timed effects continue using real time after the App enters the background

Priority: P1
Status: Open
Type: WebView／App Lifecycle

Current Situation

The game has no formal Pause or App Lifecycle handling. When the player switches Apps, locks the screen, or the WebView enters the background, visual updates may pause, but time calculations continue using system time.

Potential Impact
When returning to the game:
3.2.5.1 Food may have expired and respawned.
3.2.5.2 Shield, double score, invincibility, or monster freeze effects may have ended.
3.2.5.3 Monster types may have changed.
3.2.5.4 Total game time includes the time spent outside the App.
3.2.5.5 A long absence may cause the game to reach the 20-minute limit immediately.

Recommended Fix

The product rule must be confirmed:
Pause automatically when the App enters the background; or
End the current game immediately when the App enters the background; or

Keep the current real-time behaviour, but state it clearly in the rules.

3.2.6 GAME-06 — The displayed game time is inconsistent with the actual limit

Priority: P2
Status: Open
Type: Display Limitation

Current Situation

The game can run for up to 1,200 seconds, but the timer at the top displays only up to 999 seconds.

Potential Impact

During the final 201 seconds, the player cannot know the actual elapsed or remaining time.

Recommended Fix
Extend the timer to 4 digits, or change it to MM:SS format.

3.2.7 GAME-07 — The score and high score at the top display only the last 4 digits

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

3.2.8 GAME-08 — The local high score can be modified and is not synchronised across devices

Priority: P2
Status: Open／Accepted Limitation
Type: Data Reliability

Current Situation

The high score is stored only in browser localStorage.

Potential Impact
3.2.8.1 The high score disappears after App or browser data is cleared.
3.2.8.2 The high score cannot be synchronised after changing devices.
3.2.8.3 Players can use browser tools to modify the local high score.
3.2.8.4 Different members using the same device may share the same high score.

Recommended Fix

The production version should store high scores and game records in the backend by member.

3.3 API Integration and Flow Issues

3.3.1 API-01 — Non-mandatory API mode can bypass daily attempts, points, and server restrictions
Priority: P0
Status: Open
Type: Campaign Rule Bypass

Current Situation

When the API connection fails and apiRequired is not set to true, the frontend continues by starting the game in offline mode.

This handling may also apply to:
3.3.1.1 A 429 response when daily attempts are exhausted;
3.3.1.2 Future insufficient-points responses;
3.3.1.3 Authentication failures;
3.3.1.4 API Server outages.

Potential Impact

A player may continue playing without a valid Session, without point deduction, or after reaching the daily attempt limit.

Recommended Fix

Production must:
3.3.1.5 Enforce API_REQUIRED = true;
3.3.1.6 Handle different error codes separately;
3.3.1.7 Never fallback to offline gameplay for 401／402／403／429;
3.3.1.8 Allow offline start only in explicitly approved Demo／Local Mode.

3.3.2 API-02 — API functionality is completely disabled if the App does not inject API settings

Priority: P0
Status: Open
Type: Configuration Risk

Current Situation

The API is Disabled by default and must be actively enabled by the App WebView or URL Parameter.

Potential Impact

If the Production WebView omits any critical setting, the game may run entirely in frontend-only mode without attempt limits, point deductions, score submission, or reward controls.

Recommended Fix

The Production Build should:
3.3.2.1 Require the API by default;
3.3.2.2 Display a blocking error when the API Base URL, User ID, or Token is missing;
3.3.2.3 Prevent guest-user from entering a production campaign.

3.3.3 API-03 — A game attempt is counted when a Session starts, even if the game does not actually begin

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
3.3.3.1 reserve/start: reserve an attempt without formal point deduction;
3.3.3.2 Call activate after the frontend successfully enters the game;
3.3.3.3 Automatically cancel an unactivated Session after a short period; or
Provide a cancellation and refund mechanism.

3.3.4 API-04 — There is no actual retry option after score submission fails

Priority: P0
Status: Open
Type: Result Loss／Reward Loss

Current Situation

When submission fails, the screen displays “Please try again later”, but there is currently no:
3.3.4.1 Retry button;
3.3.4.2 Automatic retry;
3.3.4.3 Local pending-submission queue;
3.3.4.4 Reconciliation after reopening the App;
3.3.4.5 Customer-service resubmission process.

After the player returns to the home page or reloads, the frontend Session ID is lost.

Potential Impact

A player who completed the game may have no game record and receive no coupon.

Recommended Fix
3.3.4.6 Add “Resubmit” to the result screen;
3.3.4.7 Store pending results locally;
3.3.4.8 Safely retry using the same Idempotency Key;
3.3.4.9 Query incomplete Sessions when the App starts;
3.3.4.10 Provide a backend reconciliation job.

3.3.5 API-05 — Point deduction is not clearly displayed and confirmed before the game starts

Priority: P1
Status: Open
Type: Paid Operation UX

Current Situation

After the API returns the attempt number and required point deduction, the information is shown only as a brief message and the countdown begins immediately. The message may also be covered by the countdown Overlay or cleared during game initialisation.

Potential Impact

The player may begin a game that requires point deduction without clearly confirming it.

Recommended Fix

Before the second and third games, display a centred confirmation dialog containing:
3.3.5.1 Points required for this game;
3.3.5.2 Current points balance;
3.3.5.3 Attempts used and remaining today;
3.3.5.4 Cancel／Confirm buttons;
3.3.5.5 Deduct points and start the game only after confirmation succeeds.

3.3.6 API-06 — The frontend does not use /game/config for dynamic game settings

Priority: P1
Status: Open
Type: Configuration Synchronisation

Current Situation

The Mock API provides /game/config, but the HTML does not read this Endpoint. Snake speed, monster speed, food duration, treasure chest timing, and reward thresholds remain hard-coded in both the HTML and server.js.

Potential Impact
3.3.6.1 The frontend, API, OpenAPI, rules page, and Confirmation List can easily use different versions.
3.3.6.2 Changing campaign rules requires modifying and redeploying the HTML.

Recommended Fix

Read a versioned Game Config before the game starts and determine which settings are controlled by the Server and which must remain fixed in the frontend.

3.4 Known Security and Data Issues in the Mock API

3.4.1 BACKEND-01 — No formal authentication; userId is supplied by the frontend

Priority: P0
Status: Incomplete
Type: Impersonation

Current Situation

The frontend can specify userId directly. Although the Mock Server accepts an Authorization Header, it does not validate the Token or derive the member identity from the Token.

Potential Impact

Anyone can use another member's userId to create a Session, check attempts, or submit a result.

Production Requirements
3.4.1.1 Validate the Storellet Access Token／JWT;
3.4.1.2 Derive the member ID from the Token;
3.4.1.3 Ignore or verify the userId in the Request Body;
3.4.1.4 Validate campaign and member eligibility.

3.4.2 BACKEND-02 — Daily points are not actually checked or deducted

Priority: P0
Status: Incomplete
Type: Points Transaction
Current Situation

The Mock API only returns a pointsCharged value and does not:
3.4.2.1 Query the member's points balance;
3.4.2.2 Determine insufficient points;
3.4.2.3 Actually deduct points;
3.4.2.4 Create a Points Ledger Transaction;
3.4.2.5 Roll back after a deduction failure;
3.4.2.6 Prevent duplicate deductions.

Although OpenAPI includes an insufficient-points response, the Mock Server does not implement it.

3.4.3 BACKEND-03 — Coupons are not actually issued

Priority: P0
Status: Incomplete
Type: Reward Issuance

Current Situation

The API only returns PENDING_ISSUANCE. couponTemplateCode remains TO_BE_CONFIRMED, and no production Coupon Record is created.

Outstanding Items
3.4.3.1 Production Coupon Template ID;
3.4.3.2 Coupon issuance API;
3.4.3.3 Coupon ID response;
3.4.3.4 Validity period calculation;
3.4.3.5 Duplicate issuance prevention;
3.4.3.6 Issuance failure retry;
3.4.3.7 Issuance Audit Log;
3.4.3.8 Member notification.

3.4.4 BACKEND-04 — All data is stored only in Server Memory

Priority: P0
Status: Incomplete
Type: Data Persistence

Current Situation

Sessions, daily attempts, and Idempotency Responses are stored using JavaScript Map.

Potential Impact
3.4.4.1 All data is lost after the Server restarts.
3.4.4.2 Data is not shared between multiple Servers.
3.4.4.3 Players may use daily attempts repeatedly across different Instances.
3.4.4.4 Production reports and customer-service enquiries cannot be supported.

Production Requirements

Use a production Database and add Transactions, Indexes, a Retention Policy, and Backup.

3.4.5 BACKEND-05 — Scores are submitted entirely by the frontend with no anti-cheat validation

Priority: P0
Status: Incomplete
Type: Game Fairness／Reward Risk

Current Situation

The API checks only that:
3.4.5.1 The score is an integer;
3.4.5.2 The score is between 0 and 99,999;
3.4.5.3 The game duration is within the accepted range.

The API does not validate whether the score could reasonably be achieved within the submitted game duration.

Potential Impact
Players can modify JavaScript, intercept the Request, or call the API directly to submit a high score and obtain a reward.

Production Requirements

At minimum, add:
3.4.5.4 Server-side validation of Session start and end times;
3.4.5.5 Score growth limits and reasonableness checks;
3.4.5.6 Game event summary／signature;
3.4.5.7 Nonce;
3.4.5.8 App／WebView integrity signals;
3.4.5.9 Risk flags for abnormal scores;
3.4.5.10 Manual review or delayed reward issuance for high-risk results.

3.4.6 BACKEND-06 — Sessions have no expiry, cancellation, or abandonment status

Priority: P1
Status: Incomplete
Type: Session Lifecycle

Current Situation

Sessions have only STARTED and FINISHED statuses, without:
3.4.6.1 RESERVED
3.4.6.2 ACTIVE
3.4.6.3 ABANDONED
3.4.6.4 EXPIRED
3.4.6.5 CANCELLED
3.4.6.6 REJECTED

Potential Impact

Incomplete Sessions remain permanently and it is not possible to determine whether attempts or points should be returned.

3.4.7 BACKEND-07 — The Idempotency implementation has status-code and scope issues

Priority: P0
Status: Open
Type: Duplicate Transaction Control

Current Situation

The Idempotency Cache stores only the Response Body and does not store the original HTTP Status Code.

When a cached error result is replayed, the Server returns the error Body with HTTP 200.

The Idempotency Key is not scoped by Endpoint, member, or operation type.

Idempotency records have no expiry time.

Potential Impact
3.4.7.1 An initial 429／400 response may become 200 on retry.
3.4.7.2 The Client may incorrectly treat the operation as successful.
3.4.7.3 Malicious reuse of a Key may retrieve the cached response of another operation.
3.4.7.4 Memory usage will continue to grow.

Recommended Fix

Store and validate:
3.4.7.5 HTTP Method
3.4.7.6 Route
3.4.7.7 Authenticated User ID
3.4.7.8 Request Body Hash
3.4.7.9 Response Status
3.4.7.10 Response Body
3.4.7.11 Created At／Expiry At

3.4.8 BACKEND-08 — Player status and Session enquiries have no access control

Priority: P0
Status: Incomplete
Type: IDOR／Data Privacy

Current Situation

The following Endpoints have no authentication:
3.4.8.1 Query the daily attempts of a specified userId;
3.4.8.2 Query the Session details of a specified sessionId.

Production Requirements

Members may access only their own data;

Internal／Admin Endpoints must use separate permissions;

Do not return unnecessary internal data to the frontend.

3.4.9 BACKEND-09 — CORS, Rate Limit, and security protection are incomplete

Priority: P0
Status: Incomplete
Type: API Security

Current Situation

The Mock Server accepts any Origin and does not provide:
3.4.9.1 Production Origin Allowlist;
3.4.9.2 Rate Limit;
3.4.9.3 Security Headers;
3.4.9.4 Request Signature;
3.4.9.5 WAF／Bot Protection;
3.4.9.6 Payload and abnormal traffic monitoring;
3.4.9.7 Mandatory HTTPS.

3.4.10 BACKEND-10 — Campaign start, end, and enabled status are not controlled by the backend

Priority: P1
Status: Incomplete
Type: Campaign Control

Current Situation

The API does not check:
3.4.10.1 Campaign start time;
3.4.10.2 Campaign end time;
3.4.10.3 Campaign enabled／disabled status;
3.4.10.4 Member eligibility;
3.4.10.5 Supported App Version;
3.4.10.6 Maintenance Mode.

Potential Impact

Sessions may still be created or results submitted after the campaign ends.

3.4.11 BACKEND-11 — No complete Audit Log, monitoring, or alerting

Priority: P1
Status: Incomplete
Type: Operations and Incident Tracking

Outstanding Items
3.4.11.1 Request／Trace ID;
3.4.11.2 Session Lifecycle Log;
3.4.11.3 Point deduction Log;
3.4.11.4 Coupon issuance Log;
3.4.11.5 Abnormal score Log;
3.4.11.6 API Error Dashboard;
3.4.11.7 Failure-rate and latency monitoring;
3.4.11.8 Alert mechanism;
3.4.11.9 Customer-service enquiry interface.

3.4.12 BACKEND-12 — The OpenAPI specification has no automatic Contract Validation with the Server

Priority: P2
Status: Incomplete
Type: Specification Synchronisation

Current Situation

openapi.yaml, HTML, Postman Collection, and server.js must be synchronised manually.

Potential Impact
After one file is updated, the others may continue using old fields, old status codes, or old rules.

Recommended Fix

Add:
3.4.12.1 OpenAPI Schema Validation Middleware;
3.4.12.2 Contract Tests;
3.4.12.3 CI Pipeline;
3.4.12.4 Postman／Newman Tests;
3.4.12.5 API Schema Version.

3.5 Incomplete Product Features

3.5.1 FEATURE-01 — “My Game Records” page and backend history records

Priority: P1
Status: Incomplete

The current HTML has no “My Game Records” entry, record list, or corresponding API.

Recommended display fields:
3.5.1.1 Game date and time;
3.5.1.2 Final score;
3.5.1.3 Whether the game was free or required points;
3.5.1.4 Coupon issued;
3.5.1.5 Issuance status;
3.5.1.6 Session／Reference No.;
3.5.1.7 Submission failed or pending status.

3.5.2 FEATURE-02 — Fixed food legend display

Priority: P2
Status: Incomplete

The current game screen has no fixed food legend. Players must rely on the rules page to remember each food item and score.

3.5.3 FEATURE-03 — Exit button and exit handling during gameplay

Priority: P1
Status: Incomplete

There is currently no formal Exit button during gameplay, and the following are not defined:
3.5.3.1 Whether exiting counts as one used attempt;
3.5.3.2 Whether to submit 0 points or the current score;
3.5.3.3 Whether deducted points are refunded;
3.5.3.4 Which status should be assigned to the Session.

3.5.4 FEATURE-04 — Daily attempts, remaining attempts, and points balance interface

Priority: P1
Status: Incomplete

The home page does not continuously display:
3.5.4.1 Attempts used today;
3.5.4.2 Attempts remaining today;
3.5.4.3 Points required for the next game;
3.5.4.4 Current points balance;
3.5.4.5 Insufficient-points status.

3.5.5 FEATURE-05 — Dynamic management of campaign terms and conditions

Priority: P1
Status: Incomplete

The current Starter Kit does not read the following from Supabase／CMS／the production API:
3.5.5.1 Page title;
3.5.5.2 Terms and conditions content;
3.5.5.3 Enabled／disabled status;
3.5.5.4 Updated time;
3.5.5.5 Terms version;
3.5.5.6 Player consent record.

3.5.6 FEATURE-06 — Dynamic management of rewards and game settings

Priority: P1
Status: Incomplete

The following settings remain hard-coded:
3.5.6.1 Reward score thresholds;
3.5.6.2 Coupon values;
3.5.6.3 Coupon Template ID;
3.5.6.4 Number of game attempts;
3.5.6.5 Point cost for additional games;
3.5.6.6 Food scores and spawn rates;
3.5.6.7 Monster speed;
3.5.6.8 Treasure chest effects and durations;
3.5.6.9 Campaign period.

3.5.7 FEATURE-07 — Resubmission and reconciliation mechanism for failed score submissions

Priority: P0
Status: Incomplete

In addition to frontend retry, the backend still lacks:
3.5.7.1 Incomplete Session enquiry;
3.5.7.2 Scheduled Reconciliation Job;
3.5.7.3 Handling when points were deducted but the game was not completed;
3.5.7.4 Reissuance when the game was completed but the coupon was not issued;
3.5.7.5 Customer-service manual reissuance permissions and Audit Log.

3.5.8 FEATURE-08 — Production App WebView identity and environment injection

Priority: P0
Status: Incomplete／Pending App Team integration

The App Team must formally provide:
3.5.8.1 API Base URL;
3.5.8.2 Access Token;
3.5.8.3 Authenticated User ID;
3.5.8.4 Platform;
3.5.8.5 App Version;
3.5.8.6 Campaign ID;
3.5.8.7 Environment;
3.5.8.8 WebView close／background／resume events.

3.5.9 FEATURE-09 — Game analytics events and performance tracking

Priority: P3
Status: Incomplete

Recommended tracking:
3.5.9.1 Home page impression;
3.5.9.2 Rules and rewards page opens;
3.5.9.3 Start game;
3.5.9.4 Cancel point deduction;
3.5.9.5 Session creation failure;
3.5.9.6 Game Over reason;
3.5.9.7 Final score;
3.5.9.8 Treasure chest collection and effect;
3.5.9.9 Score submission result;
3.5.9.10 Coupon issuance and usage.

3.5.10 FEATURE-10 — Automated testing and device UAT coverage

Priority: P1
Status: Incomplete

No complete automated testing is currently available, including:
3.5.10.1 Game unit tests;
3.5.10.2 Collision tests;
3.5.10.3 Monster pathfinding tests;
3.5.10.4 API Contract Tests;
3.5.10.5 Idempotency Tests;
3.5.10.6 Daily attempt and cross-day tests;
3.5.10.7 Concurrent point deduction tests;
3.5.10.8 Duplicate-submission coupon issuance tests;
3.5.10.9 iOS／Android WebView background-resume tests;
3.5.10.10 Different screen sizes and safe-area tests;
3.5.10.11 Weak network, disconnection, and retry tests.

3.6 Recommended Handling Order

3.6.1 Phase 1: Client Confirmation and Before UAT

3.6.1.1 Fix GAME-01 shield／invincibility collision position.
3.6.1.2 Fix GAME-02 monster knockback overlap.
3.6.1.3 Synchronise GAME-03 rules page and actual logic.
3.6.1.4 Confirm whether GAME-04 monsters may overlap food／treasure chests.
3.6.1.5 Define handling when the App enters the background.
3.6.1.6 Add daily attempt and point-deduction confirmation UI.
3.6.1.7 Add Exit and Session termination rules.

3.6.2 Phase 2: Before Production API UAT

3.6.2.1 Enforce the API and remove offline fallback when campaign-rule errors occur.
3.6.2.2 Complete Storellet identity authentication.
3.6.2.3 Complete production points checking and deduction.
3.6.2.4 Complete the Database and Session Lifecycle.
3.6.2.5 Fix the Idempotency implementation.
3.6.2.6 Add retry and reconciliation for failed submissions.
3.6.2.7 Make the frontend read Game Config in production.
3.6.2.8 Complete campaign start／end／disable controls.

3.6.3 Phase 3: Before Production

3.6.3.1 Complete coupon issuance and duplicate prevention.
3.6.3.2 Complete anti-cheat validation.
3.6.3.3 Restrict CORS and add Rate Limit and Security Headers.
3.6.3.4 Complete Audit Log, monitoring, and alerting.
3.6.3.5 Complete automated testing and iOS／Android physical-device UAT.
3.6.3.6 Complete “My Game Records” and customer-service reconciliation capabilities.

3.7 Recommended Release Gates

3.7.1 Conditions Under Which Production Launch Is Not Recommended

Production launch is not recommended if any of the following remains incomplete:

3.7.1.1 The API can be bypassed;
3.7.1.2 No production identity authentication;
3.7.1.3 No actual point deduction;
3.7.1.4 No production coupon issuance;
3.7.1.5 Scores are determined solely by the frontend;
3.7.1.6 Sessions and daily attempts are stored only in Memory;
3.7.1.7 Failed score submissions cannot be resubmitted;
3.7.1.8 Shield／invincibility collisions can still create invalid coordinates;
3.7.1.9 Idempotency retries can incorrectly change 4xx responses into 200;
3.7.1.10 Basic API access control and security restrictions are incomplete.

3.7.2 Issue Tracking Fields

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


========================================
3.8 Code Review and Recommended Improvements
========================================

3.8.1 Overall Assessment

The project is generally well structured and functionally complete.

3.8.1.1 The README is detailed and includes installation, usage, and customization guidance.
3.8.1.2 The code structure is clear. The game logic is separated into `preload`, `create`, and `update` functions.
3.8.1.3 The project has no external asset dependency. Visual elements are generated with graphics code, making the game easy to run and deploy.
3.8.1.4 Core gameplay functionality is complete, including collision detection, physics, scoring, and the win condition.
3.8.1.5 Several areas can still be improved to make the code easier to maintain and the game experience more complete.

3.8.2 Code Quality

3.8.2.1 Magic Numbers

Some hard-coded values are scattered throughout the code, for example:

```javascript
player.body.setVelocityY(-400);
coin.body.setBounce(0.5);
```

The purpose of values such as `-400` and `0.5` is not immediately clear when reading the code.

Recommended improvement:

Define named constants near the top of `game.js`:

```javascript
const JUMP_VELOCITY = -400;
const COIN_BOUNCE = 0.5;
```

Then use the constants in the game logic:

```javascript
player.body.setVelocityY(JUMP_VELOCITY);
coin.body.setBounce(COIN_BOUNCE);
```

This makes the code easier to understand, maintain, and customize.

3.8.2.2 Timer Cleanup

The `setTimeout` calls around lines 112–114 and 162–168 do not appear to have cleanup handling.

Possible impact:

3.8.2.2.1 A timeout may continue running after the relevant scene or game state has ended.
3.8.2.2.2 Repeated restarts may create multiple pending timers.
3.8.2.2.3 Old callbacks may update objects that are no longer active.
3.8.2.2.4 This may cause memory leaks or inconsistent game behaviour.

Recommended improvement:

3.8.2.2.5 Store each timeout ID.
3.8.2.2.6 Clear active timeouts when restarting, leaving, or destroying the scene.
3.8.2.2.7 Where possible, use Phaser timer events so that timers follow the Phaser scene lifecycle.

Example using `setTimeout` cleanup:

```javascript
let activeTimeoutId = null;

activeTimeoutId = window.setTimeout(() => {
  // Timed game logic.
}, 1000);

function clearActiveTimeout() {
  if (activeTimeoutId !== null) {
    window.clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }
}
```

Example using a Phaser timer event:

```javascript
const timerEvent = this.time.delayedCall(1000, () => {
  // Timed game logic.
});
```

When the scene shuts down, remove any timer events that must not continue:

```javascript
this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
  timerEvent.remove(false);
});
```

3.8.3 Game Functionality

3.8.3.1 Mobile Support

The HTML includes responsive CSS, but the current game controls only support keyboard input.

Possible impact:

3.8.3.1.1 Mobile users cannot control the game properly.
3.8.3.1.2 The responsive layout does not provide a complete mobile gameplay experience.
3.8.3.1.3 The game may work visually inside a mobile browser or WebView but remain unplayable.

Recommended improvement:

Add on-screen touch controls for:

3.8.3.1.4 Move left.
3.8.3.1.5 Move right.
3.8.3.1.6 Jump.
3.8.3.1.7 Pause, where applicable.

The touch buttons should:

3.8.3.1.8 Support `pointerdown` and `pointerup` events.
3.8.3.1.9 Prevent accidental page scrolling while playing.
3.8.3.1.10 Be large enough for mobile use.
3.8.3.1.11 Respect device safe areas.
3.8.3.1.12 Work consistently in both mobile browsers and App WebViews.

3.8.3.2 Game State Management

The current game does not provide pause or restart functionality.

Possible impact:

3.8.3.2.1 Players cannot temporarily stop the game.
3.8.3.2.2 Players may need to reload the page after losing or winning.
3.8.3.2.3 The user experience is less complete on both desktop and mobile.
3.8.3.2.4 Timers and physics may continue running when the player expects the game to be paused.

Recommended improvement:

Introduce clear game states, for example:

```javascript
const GAME_STATE = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  WON: 'WON',
  GAME_OVER: 'GAME_OVER',
};
```

The game should then provide:

3.8.3.2.5 A pause button.
3.8.3.2.6 A resume button.
3.8.3.2.7 A restart button.
3.8.3.2.8 A complete reset of player position, score, collectibles, timers, and win state.
3.8.3.2.9 Input blocking while the game is paused, won, or over.

3.8.4 Recommended Implementation Order

3.8.4.1 Replace important magic numbers with named constants.
3.8.4.2 Add cleanup for all `setTimeout` calls and Phaser timer events.
3.8.4.3 Add mobile touch controls.
3.8.4.4 Add explicit game state management.
3.8.4.5 Add pause, resume, and restart functions.
3.8.4.6 Test restart behaviour to confirm that timers and event listeners are not duplicated.
3.8.4.7 Test the game on desktop browsers, mobile browsers, and App WebViews.

3.8.5 Suggested Acceptance Criteria

3.8.5.1 All important gameplay values are defined as named constants.
3.8.5.2 Restarting the game does not create duplicate timers or event listeners.
3.8.5.3 No timer callback runs after its scene has been shut down.
3.8.5.4 The game can be fully controlled by keyboard.
3.8.5.5 The game can be fully controlled by touch on mobile devices.
3.8.5.6 Pause stops player movement, physics, score updates, and timed events.
3.8.5.7 Resume restores the game without resetting progress.
3.8.5.8 Restart returns the game to a clean initial state.
3.8.5.9 Winning or losing displays a clear restart option.
3.8.5.10 The game works without external image assets.
