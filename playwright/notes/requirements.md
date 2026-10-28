# Requirements

## Table of Contents

1. [Scope](#scope)
2. [Functional Requirements](#functional-requirements)
3. [Acceptance Criteria](#acceptance-criteria)

## Scope

### In scope

- Pages:
  - /play
  - /inventory
- API
  - GET /api/builds
  - POST /api/builds

### Out of scope

- Login
- / (Home)
- /api
- Component testing
- Unit testing
- Performance testing
- Accessibility testing

## Functional Requirements

Builds under test: FR-02 to FR-09 and FR-11 to FR-18 must hold for every build type:

1. Thief (default selection)
2. Knight
3. Mage
4. Brigadier

| ID    | Page / API | Requirement                                                                                                                                            |
| ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-01 | /play      | Character name is required (3 to 20 characters); the user starts by clicking start                                                                     |
| FR-02 | /play      | Selecting a build type (thief, knight, mage, brigadier) shows that build's stats (strength, agility, wisdom, magic)                                    |
| FR-03 | /play      | Clicking the click-task button 5 times levels up the character, for every build                                                                        |
| FR-04 | /play      | Selecting a file in the upload-task levels up the character, for every build                                                                           |
| FR-05 | /play      | Typing `Lorem Ipsum` in the typer-task levels up the character, for every build                                                                        |
| FR-06 | /play      | Moving the slider all the way to the right levels up the character, for every build                                                                    |
| FR-07 | /play      | After completing a task, its input is disabled, for every build                                                                                        |
| FR-08 | /play      | Completing a task shows a toast that disappears automatically after 3 seconds, for every build                                                         |
| FR-09 | /play      | Bonus: easter egg activates berserk mode, so every later level-up maxes the stats, for every build                                                     |
| FR-10 | /inventory | The build selector offers the four builds (thief, knight, mage, brigadier)                                                                             |
| FR-11 | /inventory | Selecting a different build resets the equipment slots and repopulates the bag with that build's items, also when switching back to the previous build |
| FR-12 | /inventory | The bag contains four build-specific items per build: two weapons and two armor pieces                                                                 |
| FR-13 | /inventory | There are two weapon slots and two armor slots, so all four items can be equipped simultaneously                                                       |
| FR-14 | /inventory | Dragging a weapon onto a weapon slot equips it, removes it from the bag and shows a success toast                                                      |
| FR-15 | /inventory | Dragging an armor piece onto an armor slot equips it, removes it from the bag and shows a success toast                                                |
| FR-16 | /inventory | Dragging an item onto the wrong slot type shows an error toast and leaves the item in the bag                                                          |
| FR-17 | /inventory | Dragging an item onto an occupied slot shows an error toast and leaves the item in the bag                                                             |
| FR-18 | /inventory | Once all four items are equipped the bag shows an "All items equipped" message                                                                         |
| FR-19 | GET /api/builds | Returns all builds as a JSON object keyed by name, including the four built-in builds and any custom builds                                       |
| FR-20 | GET /api/builds | With `?build=<name>` returns only that build                                                                                                      |
| FR-21 | GET /api/builds | With an unknown `?build=<name>` returns 404                                                                                                       |
| FR-22 | POST /api/builds | A valid custom build is created (201) and returned as `{ build }`, with the name trimmed and lowercased; it is then returned by GET                |
| FR-23 | POST /api/builds | A body without a `build` object is rejected (400)                                                                                                 |
| FR-24 | POST /api/builds | A missing, empty or non-string `name` is rejected (400)                                                                                           |
| FR-25 | POST /api/builds | Each stat (strength, agility, wisdom, magic) must be an integer from 0 to 10; anything else is rejected (400)                                     |
| FR-26 | POST /api/builds | The sum of all four stats cannot exceed 10; a larger sum is rejected (400)                                                                        |
| FR-27 | POST /api/builds | A name that already exists, built-in or custom and compared case-insensitively, is rejected (409)                                                 |

## Acceptance Criteria

The criteria of FR-02 to FR-09 and FR-11 to FR-18 must be executed once per build: thief, knight, mage and brigadier. On `/play`, "started a character" means a character started with that build.

### FR-01 Character name and start

- **Given** the user is on `/play`, where they enter a name, select a build and click start
- **When** they click start without entering a name
- **Then** the character is not started (the name is a required field)

- **Given** the user is on `/play`
- **When** they enter a name of fewer than 3 or more than 20 characters and click start
- **Then** the character is not started

- **Given** the user is on `/play`
- **When** they enter a name of 3 to 20 characters (boundaries included), select a build and click start
- **Then** the character is started

### FR-02 Build changes stats

Applies to each build: thief (default), knight, mage and brigadier.

- **Given** the user is on `/play` and thief is the default selected build
- **Then** the stats shown match the thief build

- **Given** the user is on `/play`
- **When** they select a build (knight, mage or brigadier)
- **Then** the strength, agility, wisdom and magic stats change to match that build
- **And** the stats match what `GET /api/builds` returns for that build

### FR-03 Click task

- **Given** the user has started a character on `/play` with the click task not yet completed
- **When** they click the click-task button 5 times
- **Then** the character levels up
- **And** a confirmation message is shown

### FR-04 Upload task

- **Given** the user has started a character on `/play` with the upload task not yet completed
- **When** they select a file in the upload task
- **Then** the character levels up
- **And** a confirmation message is shown

### FR-05 Typer task

- **Given** the user has started a character on `/play` with the typer task not yet completed
- **When** they type `Lorem Ipsum` in the typer task
- **Then** the character levels up
- **And** a confirmation message is shown

### FR-06 Slider task

- **Given** the user has started a character on `/play` with the slider task not yet completed
- **When** they move the slider all the way to the right
- **Then** the character levels up
- **And** a confirmation message is shown

### FR-07 Completed task inputs are disabled

- **Given** the user has started a character on `/play`
- **When** they complete a task (click, upload, typer or slider)
- **Then** the input related to that task is disabled

### FR-08 Toast on task completion

- **Given** the user has started a character on `/play`
- **When** they complete a task
- **Then** a toast notification is shown
- **And** it disappears automatically after 3 seconds

### FR-09 Berserk mode (bonus)

- **Given** the user has started a character on `/play` and has not yet completed the typer task
- **When** they type `all your base are belong to us` in the typer task
- **Then** berserk mode is activated
- **And** every subsequent level-up maxes out the stats

### FR-10 Build selector

- **Given** the user is on `/inventory`
- **Then** a build selector is shown
- **And** it offers the four builds: thief, knight, mage and brigadier

### FR-11 Changing build resets the inventory

- **Given** the user is on `/inventory` and has equipped one or more items
- **When** they select a different build
- **Then** the equipment slots are emptied
- **And** the bag is repopulated with the items of the selected build

- **Given** the user has equipped one or more items on `/inventory`, switched to a different build and then switched back to the previous build
- **Then** the previously equipped items are no longer equipped (all equipment slots are empty)
- **And** the bag contains all four items of that build again

### FR-12 Bag contents

- **Given** the user is on `/inventory`
- **When** they select a build
- **Then** the bag contains four items specific to that build
- **And** two of them are weapons and two are armor pieces

Expected items per build (`data-item-name`, taken from `src/data/character-builds.ts`):

| Build     | Weapons                 | Armor                             |
| --------- | ----------------------- | --------------------------------- |
| thief     | `knife`, `katana`       | `leather_armor`, `silver_armor`   |
| knight    | `knife`, `longsword`    | `partial_plate`, `full_plate`     |
| mage      | `staff`, `staff`        | `cloak`, `silver_armor`           |
| brigadier | `bronze_mace`, `hammer` | `brigadier_armor`, `silver_armor` |

### FR-13 Equipment slots

- **Given** the user is on `/inventory`
- **Then** there are two weapon slots and two armor slots
- **And** all four items can be equipped at the same time

### FR-14 Equip a weapon

- **Given** the user is on `/inventory` with a weapon in the bag and an empty weapon slot
- **When** they drag the weapon onto the weapon slot
- **Then** the weapon is equipped in that slot
- **And** it is removed from the bag
- **And** a success toast is shown

### FR-15 Equip an armor piece

- **Given** the user is on `/inventory` with an armor piece in the bag and an empty armor slot
- **When** they drag the armor piece onto the armor slot
- **Then** the armor piece is equipped in that slot
- **And** it is removed from the bag
- **And** a success toast is shown

### FR-16 Wrong slot type

- **Given** the user is on `/inventory` with an item in the bag
- **When** they drag a weapon onto an armor slot, or an armor piece onto a weapon slot
- **Then** an error toast is shown
- **And** the item stays in the bag
- **And** the slot stays empty

### FR-17 Occupied slot

- **Given** the user is on `/inventory` and a slot already holds an equipped item
- **When** they drag another item onto that slot
- **Then** an error toast is shown
- **And** the dragged item stays in the bag
- **And** the slot keeps its original item

### FR-18 All items equipped

- **Given** the user is on `/inventory`
- **When** they have equipped all four items
- **Then** the bag shows an "All items equipped" message

### FR-19 Get all builds

- **Given** the API is running
- **When** a client sends `GET /api/builds`
- **Then** the response status is 200
- **And** the body is a JSON object keyed by build name containing thief, knight, mage and brigadier
- **And** it also contains every custom build created earlier

### FR-20 Get one build

- **Given** the API is running
- **When** a client sends `GET /api/builds?build=<name>` with a built-in or existing custom build name
- **Then** the response status is 200
- **And** the body contains only that build, keyed by its name

### FR-21 Get an unknown build

- **Given** the API is running
- **When** a client sends `GET /api/builds?build=<name>` with a name that does not exist
- **Then** the response status is 404

### FR-22 Create a custom build

Custom builds are held in memory, are shared by all tests and are reset when the server restarts, so every test uses a unique build name.

- **Given** the API is running and the name is not used yet
- **When** a client sends `POST /api/builds` with a `build` object containing a name and valid strength, agility, wisdom and magic
- **Then** the response status is 201
- **And** the body is `{ build }` with the submitted stats and the name trimmed and lowercased
- **And** `GET /api/builds?build=<name>` returns the new build

### FR-23 Missing build object

- **Given** the API is running
- **When** a client sends `POST /api/builds` with an empty body or a body without a `build` object
- **Then** the response status is 400

### FR-24 Invalid name

- **Given** the API is running
- **When** a client sends `POST /api/builds` with a name that is missing, empty, only whitespace or not a string
- **Then** the response status is 400
- **And** no build is created

### FR-25 Invalid stats

- **Given** the API is running
- **When** a client sends `POST /api/builds` with a stat that is missing, not a number, not an integer, negative or greater than 10
- **Then** the response status is 400
- **And** no build is created

- **Given** the API is running
- **When** a client sends `POST /api/builds` with stats at the boundaries 0 and 10 (and a sum of at most 10)
- **Then** the response status is 201

### FR-26 Total stats limit

- **Given** the API is running
- **When** a client sends `POST /api/builds` with stats that add up to more than 10 (for example 11)
- **Then** the response status is 400
- **And** no build is created

- **Given** the API is running
- **When** a client sends `POST /api/builds` with stats that add up to exactly 10
- **Then** the response status is 201

### FR-27 Unique build names

- **Given** a build with a given name already exists (thief, knight, mage, brigadier or a custom build)
- **When** a client sends `POST /api/builds` with the same name, in any letter case
- **Then** the response status is 409
- **And** the existing build is unchanged
