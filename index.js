require('dotenv').config()
const app = require("./app");
const db = require("./lib/db");
const logger = require("./logger")
const PORT = 3000

// Connect to MongoDB
async function main(){
    await db.connect().catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

    app.listen(PORT, () => {
        logger.info("This is the info message")      
        console.log('listening on port ' + PORT);
    })
}

main();