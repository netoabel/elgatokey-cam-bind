const axios = require("axios");
const http = require('http');
const args = require('yargs').argv;

const agent = new http.Agent({ family: 4 });
const lightUrl = "http://elgato-key-light-air-ec6e.local.:9123/elgato/lights";

if (args.toggle) {
    toggleState();
} else {
    switchState(args.state || 0);
}

async function switchState(state){
    try{
        await axios.put(
            lightUrl, 
            { "lights":[{ "on": state }] },
            { httpAgent: agent }
        );
    } catch(err){
        console.log(err.message);
    }
}

async function toggleState(){
    const currentState = await getCurrentState();
    const on = currentState && currentState.on;

    switchState(Math.abs(on - 1));
}

async function getCurrentState(){
    try{
        const res = await axios.get(
            lightUrl, 
            { httpAgent: agent }
        );

        return res && res.data && res.data.lights && res.data.lights[0];
    } catch(err){
        console.log(err.message);
    }
}