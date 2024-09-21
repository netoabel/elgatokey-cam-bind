import { program } from "@commander-js/extra-typings";
import * as keylight from "./keylight";
import { logger } from "./util/logger";

program
  .command("toggle")
  .description("Toggle the keylight state (on/off)")
  .action(async () => {
    try {
      await keylight.toggleState();
    } catch (err: any) {
      logger.error(`Error changing the current keylight state: ${err.message}`);
    }
  });

const brightness = program
  .command("brightness")
  .description("changes the brightness settings");

brightness
  .command("set")
  .description("sets the brightness to a specific value")
  .argument("<value>")
  .action(async (value) => {
    try {
      await keylight.setBrightness(parseInt(value));
    } catch (err: any) {
      logger.error(`Error setting the brightness: ${err.message}`);
    }
  });

brightness
  .command("increase")
  .description("increases the brightness")
  .option(
    "-b, --by <number>",
    "amount of brightness to add to the current value",
    "1",
  )
  .action(async (options) => {
    try {
      await keylight.increaseBrightness(parseInt(options.by));
    } catch (err: any) {
      logger.error(`Error increasing the brightness: ${err.message}`);
    }
  });

brightness
  .command("decrease")
  .description("decreases the brightness")
  .option(
    "-b, --by <number>",
    "amount of brightness to reduce from the current value",
    "1",
  )
  .action(async (options) => {
    try {
      await keylight.decreaseBrightness(parseInt(options.by));
    } catch (err: any) {
      logger.error(`Error decreasing the brightness: ${err.message}`);
    }
  });

program.parse();
