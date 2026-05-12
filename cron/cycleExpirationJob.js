
import cron from "node-cron";

import {
  completeExpiredCycles,
} from "../services/cycleService.js";

// ======================================
// RUN EVERY MIDNIGHT
// ======================================

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log(
      "Running cycle expiration job..."
    );

    try {
      const result =
        await completeExpiredCycles();

      console.log(
        `Completed ${result.processed} cycle(s)`
      );
    } catch (error) {
      console.error(
        "Cycle expiration error:",
        error
      );
    }
  }
);
