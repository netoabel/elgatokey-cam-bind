#!/bin/bash
OS="`uname`"
case $OS in
  'Linux')
    /bin/bash ./camera-bind-linux.sh
    ;;
  'Darwin') 
    /bin/bash ./camera-bind-macos.sh
    ;;
  *) ;;
esac