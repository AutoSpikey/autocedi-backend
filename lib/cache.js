const fs = require('fs');
const path = require('path');

const FILEPATH = path.join(__dirname, "../storage/cache.json")

if (!fs.existsSync(FILEPATH)) {
    fs.writeFileSync(FILEPATH, JSON.stringify({}));
}

async function exists(key){
    const raw = fs.readFileSync(FILEPATH, "utf8")
    const data = JSON.parse(raw)
    return key in data
}

async function get(key) {
    // read the key from json file and return it
    const raw = fs.readFileSync(FILEPATH, "utf8")
    const data = JSON.parse(raw)
    return data[key]
}

async function set(key, value) {
    const raw = fs.readFileSync(FILEPATH, "utf8")
    const data = JSON.parse(raw)
    data[key] = value
    fs.writeFileSync(FILEPATH, JSON.stringify(data));
}

module.exports = { exists, get, set }