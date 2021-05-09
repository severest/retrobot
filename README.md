# Retrobot [![Build Status](https://sean.semaphoreci.com/badges/retrobot/branches/master.svg?style=shields)](https://sean.semaphoreci.com/projects/retrobot)

## Installation

1. Install ruby 2.7.1
2. Install node 12.16.3
3. Install yarn

## Development

```
gem install bundler
bundle install
bin/rails db:create # config/database.yml assumes local db has no root password
bin/rails db:migrate
yarn install --pure-lockfile

# start rails backend
bin/rails s
```

Navigate to <http://localhost:3000>

## Running tests

### Javascript

```
yarn run test:ci
```

### Ruby

```
bin/rails test
```

### Running selenium tests locally

1. Ensure you Firefox geckodriver selenium driver is update to date
3. `NODE_ENV=test bin/rails test:system`
