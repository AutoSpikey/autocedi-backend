require("dotenv").config()
const axios = require("axios");
const baseUrl = process.env.EMTECH_BASE_URL
const autocediWallet = process.env.INSTITUTIONAL_WALLET_ID
const tokenId = process.env.ECEDI_TOKEN_ID
const institutionName = "AUTOCEDI"

async function getHeaders() {
    return {
        headers: {
            Authorization: 'Bearer ' + await getAuthToken()
        }
    }
}

async function getAuthToken() {
    const payload = {
        clientId: process.env.EMTECH_CLIENT_ID,
        clientSecret: process.env.EMTECH_CLIENT_SECRET_KEY
    }

    const { data } = await axios.post(`${baseUrl}/v1/auth/token`, payload)
    return data.accessToken
}

async function createWallet(userId) {
    const { data } = await axios.post(`${baseUrl}/v1/wallets`,
        {
            "countryCode": "GH",
            "institutionName": institutionName,
            "tokenId": tokenId,
            "userId": userId,
            "kycLevel": "UNVERIFIED"
        }, await getHeaders())
    return data;
}

async function transfer(source, destination, amount) {
    axios.post(`${baseUrl}/v1/transactions`, {
        source, destination, amount
    }, await getHeaders())
}

async function getWallets() {
    const { data } = await axios.get(`${baseUrl}/v1/wallets`, await getHeaders())
    return data;
}

async function getWallet(id) {
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

module.exports = {
    createWallet
}