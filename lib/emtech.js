require("dotenv").config()
const axios = require("axios");

const { createClient } = require('redis');

let redis = null;
async function connectRedis() {
    return await createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
}

const tokenId = process.env.ECEDI_TOKEN_ID
const institutionName = "AUTOCEDI"
const TOKEN_KEY = "EMTECH_TOKEN"

async function getAuthToken() {
    if (!redis) redis = await connectRedis()
    if (await redis.exists(TOKEN_KEY)) {
        console.log("token exists getting from redis")
        return await redis.get(TOKEN_KEY);
    }

    console.log("doesn't exist in redis, creating new one")

    const payload = {
        clientId: process.env.EMTECH_CLIENT_ID,
        clientSecret: process.env.EMTECH_CLIENT_SECRET_KEY
    }

    const { data } = await axios.post(`${process.env.EMTECH_BASE_URL}/v1/auth/token`, payload)
    const token = data.accessToken
    await redis.set(TOKEN_KEY, token, "EX", "300") // expire token after 5 minutes
    const tokenInRedis = await redis.get(TOKEN_KEY);
    return tokenInRedis
}

// Create an instance of Axios
const api = axios.create({ baseURL: process.env.EMTECH_BASE_URL });

// Add a request interceptor
api.interceptors.request.use(
    async (config) => {
        // Add headers to all requests
        config.headers.Authorization = `Bearer ${await getAuthToken()}`;
        config.headers.Accept = "application/json";
        contokenInRedis
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);``

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Request error:", error.response.data.message);
        return Promise.reject(error);
    }
);


async function createWallet(userId) {
    const { data } = await api.post(`/v1/wallets`,
        {
            "countryCode": "GH",
            "institutionName": institutionName,
            "tokenId": tokenId,
            "userId": userId,
            "kycLevel": "UNVERIFIED"
        })
    return data;
}

async function transfer(source, destination, amount) {
    const { data } = await api.post(`/v1/transfers`, {
        "amount": amount,
        "destinationWalletId": destination,
        "sourceWalletId": source,
        "tokenId": process.env.ECEDI_TOKEN_ID,
        "latitude": 39.810556,
        "longitude": -98.556111
    })

    return data
}

async function loadWallet(destination, amount) {
    return await this.transfer(process.env.INSTITUTIONAL_WALLET_ID, destination, amount)
}

async function getWallets() {
    const { data } = await api.get(`/v1/wallets`)
    return data;
}

async function getWallet(id) {
    const { data } = await api.get(`/v1/wallets/${id}`)
    return data;
}

async function getLastWalletTransaction(walletId) {
    const { data } = await api.get(`postman-echo.com/v1/wallets/${walletId}/transactions`, {
        params: {
            "isCreditTransaction": true,
            "limit": 1
        }
    })

    console.log(data)

    return {};
}

async function getTokens() {
    const { data } = await api.get(`/v1/tokens`, {
        params: {
            list: "all"
        }
    })
    return data;
}

async function getToken(tokenId) {
    const { data } = await api.get(`/v1/tokens/${tokenId}`)
    return data;
}

module.exports = {
    createWallet, transfer, getWallet, loadWallet, getLastWalletTransaction
}