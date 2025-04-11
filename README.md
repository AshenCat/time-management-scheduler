# Integrated Tracker APP

My personal workout and finance tracker

## Commands
`docker-compose up` to run dev server and db

## TODO

-   Base Workout Route
    -   [x] Base Workout view
    -   [x] Base Workout detail modal
    -   [ ] Base Workout data
        -   [x] Base Workout data bicep
        -   [x] Base Workout data tricep
        -   [x] Base Workout data shoulder
        -   [ ] Base Workout data chest
        -   [ ] Base Workout data back
        -   [ ] Base Workout data core
        -   [ ] Base Workout data leg
-   Workout Session

    -   [ ] countdown timer hook
    -   [ ] workout transitions

-   [x] Dockerize application

    -   [x] spawn database service
    -   [x] dockerize client app

-   Auth

    -   [ ] safeguard routes
    -   [ ] error handling

-   finances
    -   finance routes
        -   [x] auth guard
        -   [ ] group-by query param
    -   dashboard
        -   [ ] Mutations
            -   [x] Create
            -   [x] Read
                -   [ ] Filter Expenses List
                    -   [ ] filter only bills
                    -   [ ] filter by properties
                        -   [ ] sort
                            -   [ ] by value
                            -   [ ] by date
            -   [x] Update
            -   [x] Delete
        -   [ ] expenses graph
        -   [ ] income graph
        -   [ ] investment graph

## Bugs:

### HIGH PRIORITY

-   [x] Docker - ~~next 15 currently has very little support while developing using docker. High priority but will have to wait for actual solution~~

### MID PRIORITY

-   [ ] finance - find a suitable way to make input take multiple values for selecting tags
-   [ ] finance - add expense looks atrocious
-   [ ] finance - accumulator for net income is not counting 1 time pay properly

### LOW PRIORITY

-   [ ] finance - EDIT and DELETE button animations not working
-   [ ] finance - editing tags and notes should be shown by default if there was initial values
