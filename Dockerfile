FROM starefossen/ruby-node:2-10

RUN apt-get update && apt-get install -y mysql-client --no-install-recommends && rm -rf /var/lib/apt/lists/*

ENV RAILS_ENV=production

WORKDIR /retrobot
COPY Gemfile* ./
COPY yarn.lock ./
COPY package.json ./
RUN bundle install --deployment --without development test
RUN yarn install --pure-lockfile

COPY . .

RUN yarn run build

EXPOSE 3000
