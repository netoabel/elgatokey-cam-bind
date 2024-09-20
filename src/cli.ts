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
  .description("[coming soon] increases the brightness")
  .option(
    "-b, --by <number>",
    "amount of brightness to add to the current value",
    "1",
  )
  .action((options) => {
    console.log(`Increase brightnes by ${options.by}`);
  });

brightness
  .command("decrease")
  .description("[coming soon] decreases the brightness")
  .option(
    "-b, --by <number>",
    "amount of brightness to reduce from the current value",
    "1",
  )
  .action((options) => {
    console.log(`Decrease brightnes by ${options.by}`);
  });

program.parse();
