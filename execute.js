require("dotenv").config()
const db = require("./lib/db");
const { executeAutomation } = require("./lib/processor");
const Automation = require("./models/automation.model");

async function run() {
    console.log("trying to connect to mongo")
    await db.connect().then(() => {
        console.log("connected to mongo")
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

    console.log("executing all automations")
    await executeAll()
    // emtech.transfer(source, destination, amount)
    process.exit(0)
}
run()
// emtech.transfer(source, destination, amount)

