# Retrobot [![build status](https://travis-ci.org/severest/retrobot.svg?branch=master)](https://travis-ci.org/severest/retrobot)

## Installation

1. Install ruby 2.4.1
2. Install node 9.11.2
3. Install yarn

## Development

```
gem install bundler
bundle install
rake db:create # config/database.yml assumes local db has no root password
rake db:migrate
yarn install --pure-lockfile

# start rails backend
rails s
# in another shell
yarn run dev
```

Navigate to <http://localhost:8080>

## Running tests

### Javascript

```
yarn run test:ci
```

### Ruby

```
rake
```

### Running selenium tests locally

1. Ensure you Chrome selenium driver is update to date
2. `yarn run dev`
3. `LOCAL_TESTING=1 rake test:system`
