#!/bin/bash
curl --location --request PUT 'http://elgato-key-light-air-ec6e.local.:9123/elgato/lights' \
--header 'Content-Type: application/json' \
--data-raw '{"lights":[{"on":1}],"numberOfLights":1}'
