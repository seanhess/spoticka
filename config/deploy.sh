#!/bin/bash

echo ""
echo "===================="
echo "DEPLOY"
echo "===================="

npm install

# set up node server
sudo cp config/upstart.conf /etc/init/spoticka.conf
sudo stop spoticka
sudo start spoticka

# Make sure rethinkdb is on
# /etc/init.d/rethinkdb restart
