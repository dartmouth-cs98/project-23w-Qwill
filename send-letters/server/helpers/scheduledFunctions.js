import { schedule } from "node-cron";

export function initScheduledJobs() {
  const pingServer = schedule("*/12 * * * *", () => {
    console.log("Pinging server to stay awake...");
  });

  pingServer.start();
};
