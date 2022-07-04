#!/bin/bash
currentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit; pwd -P )
cd "$currentPath" || exit

currentStatus="Off"

while true
do
    cameraActivityLog=$(log show --predicate 'subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"' --last 3m)
    lastSixChars=${cameraActivityLog: -6}

    cameraStatus=$(echo $lastSixChars | tr -cd '[:alnum:]._-')

    if [[ $cameraStatus = "On" ]] && [[ $currentStatus = "Off" ]];
    then
        /bin/bash ../switch/on.sh
        currentStatus="On"
    elif [[ $cameraStatus = "Off" ]] && [[ $currentStatus = "On" ]];
    then
        /bin/bash ../switch/off.sh
        currentStatus="Off"
    fi

    sleep 1
done
