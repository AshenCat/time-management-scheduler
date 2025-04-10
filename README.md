# Integrated Tracker APP

My personal workout and finance tracker

## Commands
`docker-compose up` to run db
    - note: client app will be dockerized with compose soon
`docker run -it --expose 3000 -p 3000:3000 --env-file .env -v .:/app kliffordagujar/integrated-tracker` to run in seperate container

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

-   [ ] Dockerize application

    -   [x] spawn database service
    -   [ ] dockerize client app

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

-   [ ] Docker - next 15 currently has very little support while developing using docker. High priority but will have to wait for actual solution

### MID PRIORITY

-   [ ] finance - find a suitable way to make input take multiple values for selecting tags
-   [ ] finance - add expense looks atrocious

### LOW PRIORITY

-   [ ] finance - EDIT and DELETE button animations not working
-   [ ] finance - editing tags and notes should be shown by default if there was initial values
