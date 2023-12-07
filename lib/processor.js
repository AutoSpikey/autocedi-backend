const cron = require("node-cron")
const emtech = require("./emtech")
const User = require("../models/user.model")
const Automation = require("../models/automation.model")

async function processTimeAutos(autos) {
    autos = [autos[0]]
    for (const auto of autos) {
        cron.schedule(auto.trigger.cron, executeAutomation)
    }
}

async function processInit() {
    cron.schedule("*/3 * * * * *", () => console.log("original"))
}

async function processEventAutos() {
    console.log("[processor][processEventAutos] started")

    const processAutomations = await Automation.find({ "trigger.type": "receive" })

    for (let auto of [processAutomations[0]]) {
        executeAutomation(auto)
    }
}

const getAmountToPay = async (data) => {

    let { act, wallet, auto } = data;

    let amount

    if (act.field === "amount") {
        amount = act.value
    } else if (act.field === "percentage of balance") {
        const balance = wallet.balances[0].amount / 100
        amount = (act.value / 100) * balance
    } else if (act.field === "percentage of received amount") {
        // get sum of all newTransactions
        console.log("getting new transactions...")
        const newTransactions = await emtech.getNewTransactions(wallet.id, auto.createdAt, auto.lastTransactionHash)
        amount = newTransactions.reduce((acc, cur) => acc + cur.amount, 0)
    } else amount = 0;
    return amount
}

async function executeAll() {
    const automations = await Automation.find()
    for (let auto of automations) {
        await executeAutomation(auto)
    }
}

async function processAutomationById(id){
    const automation = await Automation.findOne({oid: id});
    await executeAutomation(automation)
}

async function executeAutomation(auto) {
    console.log("found auto", auto.oid)
    const user = await User.findOne({ oid: auto.userId });
    if (!user) { console.error("user not found"); return 1; }
    console.log("found user", user.oid)

    console.log("getting wallet")
    const wallet = await emtech.getWallet(user.walletId)
    console.log("received wallet", wallet.id)

    for (let act of auto.actions) {
        const amount = await getAmountToPay({
            act, auto, wallet
        })
        const source = wallet.id;
        const destination = act.destination

        console.log("transfer amount: " + amount + " from " + source + " to " + destination)
    }

    console.log("");
}

module.exports = { processTimeAutos, processEventAutos, executeAutomation, processInit, executeAll, processAutomationById }