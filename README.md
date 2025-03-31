# Integrated Tracker APP

My personal workout and finance tracker

## TODO
- Base Workout Route
  - [x] Base Workout view
  - [x] Base Workout detail modal
  - [ ] Base Workout data
    - [x] Base Workout data bicep
    - [ ] Base Workout data tricep
    - [ ] Base Workout data shoulder
    - [ ] Base Workout data chest
    - [ ] Base Workout data back
    - [ ] Base Workout data core
    - [ ] Base Workout data leg
- Workout Session
  - [ ] countdown timer hook
  - [ ] workout transitions

- [ ] Dockerize application
  - [x] spawn database service
  - [ ] dockerize client app

- Auth
  - [ ] safeguard routes
  - [ ] error handling

- finances
  - finance routes
    - [x] auth guard
    - [ ] group-by query param
  - dashboard
    - [ ] Mutations
      - [x] Create
      - [x] Read
      - [ ] Update
      - [x] Delete
    - [ ] expenses graph
    - [ ] income graph
    - [ ] investment graph

## Bugs:
- [ ] update finance date input disabled does not send to server action
- [ ] update finance tags and notes not sending due to animateprescence transition