const cron = require("node-cron")
const emtech = require("./emtech")
const User = require("../models/user.model")
const Automation = require("../models/automation.model")

async function processTimeAutos() {
    const timeAutomations = await Automation.find({ "trigger.type": "time" })

    for (let auto of timeAutomations) {
        const cronString = auto.trigger.cron === "" ? "* * * * *" : auto.trigger.cron
        console.log("cronString", cronString)
        cron.schedule(cronString, async () => {
            executeAutomation(auto)
        })
    }

    console.log("successfully scheduled", timeAutomations.length, "time autos")
}

function scheduleTimeAuto(auto){
    console.log("scheduling new time auto")
    if(auto.trigger.type === "time"){
        cron.schedule(auto.trigger.cron, async () => {
            executeAutomation(auto)
        })
    }
}

async function processEventAutos() {
    console.log("[processor][processEventAutos] started")

    const processAutomations = await Automation.find({ "trigger.type": "receive" })

    for (let auto of processAutomations) {
        if (await checkEvent(auto)) {
            console.log("event holds. executing");
            await executeAutomation(auto)
        }
    }

    console.log("successfully scheduled", processAutomations.length, "event autos");
}

async function checkEvent(auto) {
    console.log("checkEvent", auto)
    const newTransactions = await emtech.getNewTransactions(auto.walletId)
    console.log("newTransactions", newTransactions)
    const lastTransaction = [...newTransactions].pop()
    if (auto.trigger.field === "amount") {
        return (lastTransaction.amount / 100) === auto.trigger.amount
    } else if (auto.trigger.field === "sender"){
        console.log("allowing from sender")
        // return (lastTransaction.contraWallet === auto.trigger.amount)
        // TODO fix automation model to keep transaction sender wallet
        return true
    }
    return false
}

const getAmountToPay = async (data) => {
    let { act, wallet, newTransactions } = data;

    console.log("auto transaction field:", act.field)

    let amount

    if (act.field === "amount") {
        amount = act.value
    } else if (act.field === "percentage of balance") {
        const balance = wallet.balances[0].amount / 100
        amount = (act.value / 100) * balance
    } else if (act.field === "percentage of received amount") {
        // get sum of all newTransactions
        console.log("getting new transactions...")
        amount = newTransactions.reduce((acc, cur) => acc + cur.amount, 0)
    } else amount = 0;
    return String(Math.floor(amount))
}

async function executeAll() {
    const automations = await Automation.find()
    for (let auto of automations) {
        await executeAutomation(auto)
    }
}

async function processAutomationById(id) {
    const automation = await Automation.findOne({ oid: id });
    await executeAutomation(automation)
}

async function executeEventAutomationById(autoId){
    console.log("auto id", autoId)
    const auto = await Automation.findOne({ oid: autoId });
    const ans = await checkEvent(auto)
    if(ans) await executeAutomation(auto)
    else console.log("won't execute auto")
}

async function executeAutomation(auto) {
    const startTime = Date.now()

    console.log("found auto", auto.oid)
    const user = await User.findOne({ oid: auto.userId });
    if (!user) { console.error("user not found"); return 1; }
    console.log("found user", user.oid)

    console.log("getting wallet")
    const wallet = await emtech.getWallet(user.walletId)
    console.log("received wallet", wallet.id)

    for (let act of auto.actions) {

        const newTransactions = await emtech.getNewTransactions(wallet.id, auto.createdAt, auto.lastTransactionHash)

        // register last transaction hash
        if (newTransactions.length > 0) {
            const lastTransaction = [...newTransactions].pop()
            auto.lastTransactionHash = lastTransaction.hash
            await auto.save().then(() => console.log(`${auto.oid} last transaction has updated`));
        }

        const amount = await getAmountToPay({
            act, wallet, newTransactions
        })
        const source = wallet.id;
        const destination = act.destination


        console.log("transfer amount: " + amount + " from " + source + " to " + destination)

        try {
            const newTransactionResponse = await emtech.transfer(source, destination, amount)

            const finishTime = Date.now()
            auto.lastTransactionHash = newTransactionResponse.hash
            auto.history = [...auto.history, {
                startTime, finishTime, success: true, logs: "transaction finished"
            }]
            auto.lastRan = Date.now()
            await auto.save().then(() => console.log(`${auto.oid} last transaction hash set to `));


        } catch (err) {
            console.error(`${err.response.status} ${err.response.statusText}`);
        }
    }

    console.log("");
}

module.exports = {
    processTimeAutos,
    processEventAutos,
    executeAutomation,
    executeAll,
    processAutomationById,
    executeEventAutomationById,
    scheduleTimeAuto
}