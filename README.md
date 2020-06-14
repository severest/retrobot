# Retrobot [![build status](https://travis-ci.org/severest/retrobot.svg?branch=master)](https://travis-ci.org/severest/retrobot)

## Installation

1. Install ruby 2.4.1 ([RVM](http://rvm.io/rvm/install) is a good way to manage Ruby)
2. Install node 9.11.2 ([NVM](https://github.com/nvm-sh/nvm#installing-and-updating) is a good way to manager node versions)
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
