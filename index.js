require('dotenv').config()
const app = require("./app");
const db = require("./db");
const PORT = 3000

// Connect to MongoDB
async function main(){
    await db.connect().catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

    app.listen(PORT, () => {
        console.log('listening on port ' + PORT);
    })
}

main();