#!/bin/bash

currentStatus="Off"

while [ true ]
do
    cameraActivityLog=$(log show --predicate 'subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"' --last 3m)
    lastSixChars=${cameraActivityLog: -6}

    cameraStatus=$(echo $lastSixChars | tr -cd '[:alnum:]._-')

    if [[ $cameraStatus = "On" ]] && [[ $currentStatus = "Off" ]];
    then
        /bin/bash /Users/abel/repos/elgato-test/switch/on.sh
        currentStatus="On"
    elif [[ $cameraStatus = "Off" ]] && [[ $currentStatus = "On" ]];
    then
        /bin/bash /Users/abel/repos/elgato-test/switch/off.sh
        currentStatus="Off"
    fi

    sleep 1
done