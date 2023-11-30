function obfuscate(data, keys=[]) {
    const keysToObfuscate = [
        "password", "pin", "username", ...keys
    ]

    for(const key of keysToObfuscate) {
        if(key in data){
            delete data[key]
        }
    }

    return data
}

module.exports = { obfuscate }