require("dotenv").config()
const axios = require("axios");
const tokenId = process.env.ECEDI_TOKEN_ID
const institutionName = "AUTOCEDI"

let token = null;

async function getAuthToken() {
    const payload = {
        clientId: process.env.EMTECH_CLIENT_ID,
        clientSecret: process.env.EMTECH_CLIENT_SECRET_KEY
    }

    const { data } = await axios.post(`${process.env.EMTECH_BASE_URL}/v1/auth/token`, payload)

    token = data.accessToken
    return token;
}
getAuthToken();

// Create an instance of Axios
const api = axios.create({ baseURL: process.env.EMTECH_BASE_URL });

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Add headers to all requests
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json"
        return config;
    },
    (error) => {
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