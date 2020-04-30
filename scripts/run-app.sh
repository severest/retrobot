#!/bin/ash
set -e
bin/rails db:migrate
bin/rails recurring:init
bin/rails s -b 0.0.0.0
