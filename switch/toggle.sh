#!/bin/bash

isOn=$(curl --location --request GET 'http://elgato-key-light-air-ec6e.local.:9123/elgato/lights' \
--header 'Accept: application/json' | /opt/homebrew/bin/jq -r '.lights[0].on')

if [[ $isOn -eq 1 ]]
then
    bash /Users/abel/repos/elgato-test/switch/off.sh
else 
    bash /Users/abel/repos/elgato-test/switch/on.sh
fi