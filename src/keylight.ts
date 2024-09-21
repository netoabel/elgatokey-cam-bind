import axios from "axios";
import * as http from "http";
import { logger } from "./util/logger";

const MIN_BRIGHTNESS = 2;
const MAX_BRIGHTNESS = 100;
const REQUEST_TIMEOUT_MS = 3000;
const KEYLIGHT_URL =
  "http://elgato-key-light-air-ec6e.local.:9123/elgato/lights";

const agentForHttp4: http.Agent = new http.Agent({ family: 4 });

interface KeyLightState {
  on: number;
  brightness: number;
  temperature: number;
}

interface State extends Partial<KeyLightState> {}

async function setBrightness(brightness: number): Promise<void> {
  logger.info(`Setting keylight brightness to ${brightness}`);
  await setState({ brightness: brightness });
}

async function increaseBrightness(by: number): Promise<void> {
  logger.info(`Increasing keylight brightness by ${by}`);

  const state: KeyLightState | void = await getCurrentState();
  let brightness = state.brightness + by;
  if (brightness > MAX_BRIGHTNESS) brightness = MAX_BRIGHTNESS;

  await setState({ brightness });
}

async function decreaseBrightness(by: number): Promise<void> {
  logger.info(`Decreasing keylight brightness by ${by}`);

  const state: KeyLightState | void = await getCurrentState();
  let brightness = state.brightness - by;
  if (brightness < MIN_BRIGHTNESS) brightness = MIN_BRIGHTNESS;

  await setState({ brightness });
}

async function toggleState(): Promise<void> {
  const state: KeyLightState | void = await getCurrentState();
  await setState({ on: 1 - state.on });
}

async function setState(state: State) {
  logger.info(`Setting keylight state to ${JSON.stringify(state)}`);
  await axios.put(
    KEYLIGHT_URL,
    { lights: [state] },
    {
      httpAgent: agentForHttp4,
      timeout: REQUEST_TIMEOUT_MS,
    },
  );
}

async function getCurrentState(): Promise<KeyLightState> {
  let state: boolean | undefined;

  const res = await axios.get(KEYLIGHT_URL, {
    httpAgent: agentForHttp4,
    timeout: REQUEST_TIMEOUT_MS,
  });
  return res?.data?.lights[0];
}

export {
  setBrightness,
  setState,
  toggleState,
  increaseBrightness,
  decreaseBrightness,
};
