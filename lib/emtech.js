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
    const payload = {
        clientId: process.env.EMTECH_CLIENT_ID,
        clientSecret: process.env.EMTECH_CLIENT_SECRET_KEY
    }

    const { data } = await axios.post(`${process.env.EMTECH_BASE_URL}/v1/auth/token`, payload)
    return data.accessToken
}

// Create an instance of Axios
const api = axios.create({ baseURL: process.env.EMTECH_BASE_URL });

// Add a request interceptor
api.interceptors.request.use(
    async (config) => {
        // Add headers to all requests
        config.headers.Authorization = `Bearer ${await getAuthToken()}`;
        config.headers.Accept = "application/json";

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Request error:", error.response.data);
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
    console.log("Transfer payload", JSON.stringify({
        "amount": amount,
        "destinationWalletId": destination,
        "sourceWalletId": source,
        "tokenId": process.env.ECEDI_TOKEN_ID,
        "latitude": 39.810556,
        "longitude": -98.556111
    }))

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

async function getTransactionHistory(walletId) {
    const { data } = await api.get(`/v1/wallets/${walletId}/transactions`,
        {
            params: {
                limit: 1,
                isCreditTransaction: true
            }
        }
    )

   return data
}

async function getNewTransactions(walletId, automationCreatedAt, lastTransactionHash) {
    console.log("get transaction history for " + walletId + ", automation created at " + lastTransactionHash + ", last transaction hash " + lastTransactionHash)
    let page = 1;
    let transactionsAfterHash = [];

    try {
        // Continue fetching pages until the desired hash is found or there are no more transactions
        while (true) {
            const response = await api.get(`/v1/wallets/${walletId}/transactions`, {
                params: {
                    offset: (page - 1) * 10,  // Adjust the limit as needed
                    limit: 10  // Adjust the limit as needed
                }
            });
            // go to next page on next iteration
            page++;

            const transactions = response.data.transactions;

            if (transactions.length === 0) {
                // No more transactions, break out of the loop
                break;
            }

            // Check each transaction for the desired hash
            for (const transaction of transactions) {
                // if transaction happened before the automation was created, don't do it.
                if(transaction.createdAt < automationCreatedAt){
                    console.log("transaction happened before automation was created. skip")
                    break;
                }
                console.log("transaction happened after automation was created. continue")

                // If lastTransactionHash is provided and found, break out of the loop
                if (lastTransactionHash && transaction.hash === lastTransactionHash) {
                    console.log("transaction already looked at. skip")
                    break;
                }

                console.log("transaction happened after the last transaction observed. add it...")

                // Add transactions after the saved hash to the result array
                transactionsAfterHash.push(transaction);
                console.log("transaction added")
            }

            // If the desired hash is found, break out of the loop
            if (lastTransactionHash && transactions.some(transaction => transaction.hash === lastTransactionHash)) {
                break;
            }

            // Move to the next page
            page++;
            if(response.data.totalPages <= page) break;

        }

        console.log("found", transactionsAfterHash.length, "new transactions");
        return transactionsAfterHash;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error; // Handle the error as needed
    }
}

module.exports = {
    createWallet, transfer, getWallet, loadWallet, getTransactionHistory, getNewTransactions
}