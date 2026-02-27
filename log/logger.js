const fs = require("fs")
const path = require("path")
const eventBus = require("../eventBus")
const logFilePath = path.join(__dirname, "data", "log.txt")


function writeLog(message) {
    const now = new Date().toISOString()
    const logLine = `[${now}] | ${message}\n`
    fs.appendFile(logFilePath, logLine, (err) => {
        if (err) {
            console.error(`An error occured while writing log : ${err}`)
        }
    })
}

function displayLog(message) {
    const now = new Date().toISOString();
    console.log(`[${now}] | ${message}`)
}



eventBus.on("route:access", ({ endpoint, method, email, ip }) => {
    const email_line = email ? ` by '${email}'` : "";
    const logLine = `[route:access] | [${method} ${endpoint}] |${email_line} from IP [${ip}]`
    writeLog(logLine)
    displayLog(logLine)
})

eventBus.on("auth:attempt", ({email, ip}) => {
    writeLog(`auth:attempt | '${email}' from ip adress [${ip}]`)
})

eventBus.on('auth:success', ({ email, ip }) => {
    writeLog(`auth:success | '${email}' from ip adress [${ip}]`);
});

eventBus.on('auth:failure', ({ email, ip }) => {
    writeLog(`auth:failure | '${email}' from ip adress [${ip}]`);
});

eventBus.on('reservation:failure', ({ email, ip }) => {
    writeLog(`reservation:failure | '${email}' from ip adress [${ip}]`);
});

eventBus.on('reservation:success', ({ email, ip }) => {
    writeLog(`reservation:success | '${email}' from ip adress [${ip}]`);
});

