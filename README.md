![build status](https://travis-ci.org/severest/retrobot.svg?branch=master)

## Installation

1. Install ruby 2.4.1
2. Install node 6.12.2
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

<http://localhost:8080>
