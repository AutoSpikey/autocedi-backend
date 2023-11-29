require("dotenv").config()
const axios = require("axios");
const baseUrl = process.env.EMTECH_BASE_URL
const Cache = require("./cache")

async function getHeaders() {
    return {
        headers: {
            Authorization: 'Bearer ' + await getAuthToken()
        }
    }
}

async function getAuthToken() {
    const TOKEN = "token"
    if (await Cache.exists(TOKEN)) {
        const tokenData = await Cache.get(TOKEN)
        // check if the token has not already expired
        if (Date.now() < tokenData.expiresAt)
            return tokenData.token
    }

    const payload = {
        clientId: process.env.EMTECH_CLIENT_ID,
        clientSecret: process.env.EMTECH_CLIENT_SECRET_KEY
    }

    const { data } = await axios.post(`${baseUrl}/v1/auth/token`, payload)
    const expiresAt = Date.now() + (data.expirySeconds * 1000)
    await Cache.set(TOKEN, { token: data.accessToken, expiresAt })
    return (await Cache.get(TOKEN)).token
}

async function createWallet(payload) {
    const { data } = await axios.post(`${baseUrl}/v1/wallets`, payload, await getHeaders())
    return data;
}

async function getWallets() {
    const { data } = await axios.get(`${baseUrl}/v1/wallets`, await getHeaders())
    return data;
}

async function getTokens() {
    const { data } = await axios.get(`${baseUrl}/v1/tokens`, {
        headers: {
            Authorization: 'Bearer ' + await getAuthToken()
        },
        params: {
            list: "all"
        }
    })
    return data;
}

async function getToken(tokenId) {
    const { data } = await axios.get(`${baseUrl}/v1/tokens/${tokenId}`, {
        headers: {
            Authorization: 'Bearer ' + await getAuthToken()
        }
    })
    return data;
}
