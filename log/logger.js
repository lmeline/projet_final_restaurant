const fs = require("fs")
const path = require("path")
const eventBus = require("../eventBus")
const e = require("express")
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

// Routes création réservation
eventBus.on('reservation:create:success', ({reservationId, email, ip, numberOfPeople, date, time }) => {
    writeLog(`reservation:create:success | reservation_id '${reservationId}' | '${email}' from ip adress [${ip}] | numberOfPeople '${numberOfPeople}' | date '${date}' | time '${time}'`);
})
eventBus.on('reservation:create:failure', ({StatusCode, error}) => {
    writeLog(`reservation:create:failure | StatusCode '${StatusCode}' | error '${error}'`);
});

// Routes validation réservation
eventBus.on('reservation:validate:failure', ({StatusCode, error }) => {
    writeLog(`reservation:validate:failure | StatusCode '${StatusCode}' | error '${error}'`);
});
eventBus.on('reservation:success', ({reservationId }) => {
    writeLog(`reservation:success | reservation_id '${reservationId}'`);
});

// Routes annulation réservation
eventBus.on('reservation:cancel:success', ({reservationId }) => {
    writeLog(`reservation:cancel:success | reservation_id '${reservationId}'`);
});
eventBus.on('reservation:cancel:failed', ({StatusCode, error }) => {
    writeLog(`reservation:cancel:failed |StatusCode '${StatusCode}' | error '${error}'`);
});

// Routes modification réservation
eventBus.on('reservation:modify:success', ({reservationId,numberOfPeople,date,time, email, ip }) => {
    writeLog(`reservation:modify:success | reservation_id '${reservationId}' | numberOfPeople '${numberOfPeople}' | date '${date}' | time '${time}' | '${email}' from ip adress [${ip}]`);
});
eventBus.on('reservation:modify:failure', ({StatusCode, error,}) => {
    writeLog(`reservation:modify:failure | StatusCode '${StatusCode}' | error '${error}'`);
});

// Routes création table
eventBus.on('table:creation:success', ({id,capacity}) => {
    writeLog(`table:creation:success | id '${id}' | seats '${capacity}'`)
});
eventBus.on('table:creation:failed', ({StatusCode, error,capacity}) => {
    writeLog(`table:creation:failed | StatusCode '${StatusCode}' | error '${error}' | capacity '${capacity}'`)
});

// Routes recupération table par id
eventBus.on('table:get:success', ({tableId}) => {
    writeLog(`table:get:success | table_id '${tableId}'`)
});
eventBus.on('table:get:failure', ({StatusCode, error}) => {
    writeLog(`table:get:failure | StatusCode '${StatusCode}' | error '${error}'`)
});