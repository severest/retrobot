#!/bin/bash
set -e
QUEUES=mailers,default bin/rails jobs:work
