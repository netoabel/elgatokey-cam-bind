import axios from "axios";
import * as http from "http";
import { logger } from "./util/logger";

const REQUEST_TIMEOUT_MS = 3000;
const KEYLIGHT_URL =
  "http://elgato-key-light-air-ec6e.local.:9123/elgato/lights";

const agentForHttp4: http.Agent = new http.Agent({ family: 4 });

async function setState(state: boolean): Promise<void> {
  logger.info(`Setting keylight state to: ${state}`);
  await axios.put(
    KEYLIGHT_URL,
    { lights: [{ on: state }] },
    { httpAgent: agentForHttp4, timeout: REQUEST_TIMEOUT_MS },
  );
}

async function toggleState(): Promise<void> {
  const currentState: boolean | void = await getCurrentState();
  const newState: boolean = !currentState;
  await setState(newState);
}

async function getCurrentState(): Promise<boolean | void> {
  let state: boolean | undefined;

  try {
    const res = await axios.get(KEYLIGHT_URL, { httpAgent: agentForHttp4 });
    state = !!+res?.data?.lights[0]?.on;
  } catch (err: any) {
    logger.error(err.message);
  }

  return state;
}

export { setState, toggleState };
