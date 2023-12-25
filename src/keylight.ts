import axios from "axios";
import * as http from "http";
import { logger } from "./util/logger/logger";

const agentForHttp4: http.Agent = new http.Agent({ family: 4 });
const lightUrl: string =
  "http://elgato-key-light-air-ec6e.local.:9123/elgato/lights";

async function turnOn(): Promise<void> {
  await setState(true);
}

async function turnOff(): Promise<void> {
  await setState(false);
}

async function setState(state: boolean): Promise<void> {
  try {
    await axios.put(
      lightUrl,
      { lights: [{ on: state }] },
      { httpAgent: agentForHttp4 }
    );
  } catch (err: any) {
    logger.error(err.message);
  }
}

async function toggleState(): Promise<void> {
  const currentState: boolean | void = await getCurrentState();
  const newState: boolean = !currentState;
  await setState(newState);
}

async function getCurrentState(): Promise<boolean | void> {
  let state: boolean | undefined;

  try {
    const res = await axios.get(lightUrl, { httpAgent: agentForHttp4 });
    state =
      res &&
      res.data &&
      res.data.lights &&
      res.data.lights[0] &&
      !!+res.data.lights[0].on;
  } catch (err: any) {
    logger.error(err.message);
  }

  return state;
}

export { turnOn, turnOff };
