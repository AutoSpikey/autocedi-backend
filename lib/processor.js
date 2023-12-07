const cron = require("node-cron")
const emtech = require("./emtech")
const User = require("../models/user.model")
const Automation = require("../models/automation.model")

async function processTimeAutos() {
    const timeAutomations = await Automation.find({ "trigger.type": "time" })

    for (let auto of timeAutomations) {
        cron.schedule(auto.trigger.cron, async () => {
            executeAutomation(auto)
        })
    }

    console.log("successfully scheduled", timeAutomations.length, "time autos")
}

async function processEventAutos() {
    console.log("[processor][processEventAutos] started")

    const processAutomations = await Automation.find({ "trigger.type": "receive" })

    for (let auto of processAutomations) {
        executeAutomation(auto)
    }

    console.log("successfully scheduled", processAutomations.length, "event autos");
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
    return amount
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

async function executeAutomation(auto) {
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
        if(newTransactions.length > 0) {
            const lastTransaction = [...newTransactions].pop()
            auto.lastTransactionHash = lastTransaction.hash
            auto.save().then(() => console.log(`${auto.oid} last transaction has updated`));
        }
        
        const amount = await getAmountToPay({
            act, wallet, newTransactions
        })
        const source = wallet.id;
        const destination = act.destination


        console.log("transfer amount: " + amount + " from " + source + " to " + destination)

        // try{
        //     await emtech.transfer(source, destination, amount)
        // }catch(err){
        //     console.error(`${err.response.status} ${err.response.statusText}`);
        // }
    }

    console.log("");
}

module.exports = { processTimeAutos, processEventAutos, executeAutomation, executeAll, processAutomationById }