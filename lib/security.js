function obfuscate(data, keys=[]) {
    const keysToObfuscate = [
        "password", "pin", ...keys
    ]

    for (const key in data) {
        if(keysToObfuscate.includes(key)){
            data[key] = "*".repeat(String(data[key]).length)
        }
    }

    return data
}

module.exports = { obfuscate }