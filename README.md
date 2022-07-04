# Elgato Key Camera Bind
This is an experimental script to make Elgato's Key Light Air turn on and off acording to your webcam's current status. 

The main idea here is to automate the task of turning it on/off for people that always use it on video calls.

The script tries to detect camera activity from system logs and change the Key Light status accordingly, by making HTTP requests to the device.

## How to run it
You can try the script by cloning this repository and then running one of the following commands:

```sh ./camera-bind/camera-bind-linux.sh```

or

```sh ./camera-bind/camera-bind-macos.sh```

With the script running, try to make some application use your webcam (i.e. https://meet.google.com). It should turn Elgato Key Light on and off whenever you enable/disable your webcam.  

## How to make it run as a service
### Linux
In order to make the script start automatically on startup in Linux, you can create a `systemctl` daemon. To do so, create the file `/etc/systemd/system/elgato-cam-bind.service` with the following contents:
```
[Unit]
Description=Elgato Key Camera Bind

[Service]
Type=simple
User=root
ExecStart=PATH_WHERE_YOU_CLONED_THIS_REPO/elgatokey-cam-bind/camera-bind/camera-bind-linux.sh
Restart=on-failure

[Install]
WantedBy=default.target
``` 

Then enable and start the service: 

```
sudo systemctl daemon-reload
sudo systemctl enable --now elgato-cam-bind.service  
```
