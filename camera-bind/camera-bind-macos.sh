#!/bin/bash
currentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit; pwd -P )
cd "$currentPath" || exit

currentStatus="Off"

while true
do
    cameraActivityLog=$(log show --predicate 'subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"' --last 3m)
    lastSixChars=${cameraActivityLog: -6}
    cameraStatus=$(echo $lastSixChars | tr -cd '[:alnum:]._-')
    [ $cameraStatus = "Off" ]; isCameraOn=$?

    if [[ "$isCameraOn" = 1 ]] && [[ $currentStatus = "Off" ]];
    then
        /bin/bash ../switch/on.sh
        currentStatus="On"
    elif [[ "$isCameraOn" = 0 ]] && [[ $currentStatus = "On" ]];
    then
        /bin/bash ../switch/off.sh
        currentStatus="Off"
    fi

    sleep 1
done
