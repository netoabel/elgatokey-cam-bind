#!/bin/bash
currentPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit; pwd -P )
cd "$currentPath" || exit

currentStatus="Off"

OS="`uname`"
case $OS in
  'Linux')
    OS='linux'
    ;;
  'Darwin') 
    OS='macos'
    ;;
  *) 
    echo "Unsupported Operating System."
    exit;
  ;;
esac

isCameraOnMac(){
    cameraStatus=$(log show --predicate 'subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"' --last 3m | grep -E -o '"VDCAssistant_Power_State" = [a-zA-Z]+' | tail -1 | awk '{print $3}')
    [ "$cameraStatus" = "On" ] && isCameraOn=1 || isCameraOn=0
    echo "$isCameraOn"
}

isCameraOnLinux(){
    cameraActivityLog=$(lsof /dev/video0)
    firstSevenChars=${cameraActivityLog:0:7}
    [ "$firstSevenChars" != "COMMAND" ]; isCameraOn=$?
    echo "$isCameraOn"
}

while true
do
    isCameraOn=$([ "$OS" = "macos" ] && echo "$(isCameraOnMac)" || echo "$(isCameraOnLinux)" )

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