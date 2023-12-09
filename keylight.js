const axios = require("axios");
const http = require("http");
const args = require("yargs").argv;

const agentForHttp4 = new http.Agent({ family: 4 });
const lightUrl = "http://elgato-key-light-air-ec6e.local.:9123/elgato/lights";

if (args.toggle) {
  toggleState();
} else if (args.state) {
  setState(args.state);
}

async function toggleState() {
  const currentState = await getCurrentState();

  const newState = toggle(currentState);

  setState(newState);
}

async function setState(state) {
  try {
    await axios.put(
      lightUrl,
      { lights: [{ on: state }] },
      { httpAgent: agentForHttp4 }
    );
  } catch (err) {
    console.log(err.message);
  }
}

function toggle(binaryBit) {
  return Math.abs(binaryBit - 1);
}

async function getCurrentState() {
  try {
    const res = await axios.get(lightUrl, { httpAgent: agentForHttp4 });

    return (
      res &&
      res.data &&
      res.data.lights &&
      res.data.lights[0] &&
      res.data.lights[0].on
    );
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { setState, toggleState };
