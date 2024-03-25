import axios from "axios";
import axiosRetry from "axios-retry";
import * as http from "http";
import { logger } from "./util/logger/logger";

const RETRY_BASE_INTERVAL = 1500;
const MAX_RETRIES = 5;

axiosRetry(axios, {
  retries: MAX_RETRIES,
  retryDelay: (retryCount) => {
    return RETRY_BASE_INTERVAL * retryCount;
  },
  onRetry: (retryCount, error) => {
    logger.error(`Request to keylight failed. ${error.cause}`);
    logger.info(`Retrying (${retryCount})...`);
  },
});

const agentForHttp4: http.Agent = new http.Agent({ family: 4 });
const keylightUrl: string =
  "http://elgato-key-light-air-ec6e.local.:9123/elgato/lights";

async function turnOn(): Promise<void> {
  logger.info("Turning Keylight On...");
  await setState(true);
}

async function turnOff(): Promise<void> {
  logger.info("Turning Keylight Off...");
  await setState(false);
}

async function setState(state: boolean): Promise<void> {
  try {
    await axios.put(
      keylightUrl,
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
    const res = await axios.get(keylightUrl, { httpAgent: agentForHttp4 });
    state = !!+res?.data?.lights[0]?.on;
  } catch (err: any) {
    logger.error(err.message);
  }

  return state;
}

export { toggleState, turnOn, turnOff };
