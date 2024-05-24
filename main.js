"use strict";

const _ = require("underscore"),
  readline = require("readline"),
  sqlite3 = require("sqlite3").verbose();

class Main {
  constructor() {
    // Readline
    this.r1 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Command
    this.command();
  }

  command() {
    this.r1.setPrompt("Xin1337> ");
    this.r1.prompt();

    this.r1.on("line", (line) => {
      switch (line.trim()) {
        case "fps":
          this.fps();
          break;

        case "help":
          console.log("Available commands:");
          console.log("fps - Sets the frame rate to 120.");
          break;

        default:
          console.log("Command not found");
          break;
      }

      this.r1.prompt();
    });
  }

  fps() {
    
    this.r1.question(
      "Enter the location of the database file (e.g., C:\\WutheringWavesj3oFh\\Wuthering Waves Game\\Client\\Saved\\LocalStorage\\LocalStorage.db): ",
      (dbPath) => {
        let db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error(err.message);
            this.fps();
            return;
          }
        });

        db.serialize(() => {
          let query =
            "SELECT value FROM LocalStorage WHERE key = 'GameQualitySetting';";

          db.get(query, (error, result) => {
            if (error) {
              console.error(error.message);
            }

            let originalJson = result.value;

            if (originalJson == null) {
              console.log(
                "Not found! Please make sure you have the correct path to the database file."
              );
              return;
            }

            let parsedSetting = JSON.parse(originalJson);
            parsedSetting.KeyCustomFrameRate = 120;
            let updatedJson = JSON.stringify(parsedSetting);

            let updateQuery =
              "UPDATE LocalStorage SET value = ? WHERE key = 'GameQualitySetting';";

            db.run(updateQuery, updatedJson, function (error) {
              if (error) {
                console.error(error.message);
                throw error;
              }

              console.log("Frame rate updated to 120!");

              db.close((error) => {
                if (error) {
                  console.error(error.message);
                  throw error;
                }

                console.log("\nPress any key to exit...");
                process.exit();
              });
            });
          });
        });
      }
    );
  }
}

new Main();
