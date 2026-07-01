function toDate(value) {
    return value instanceof Date ? value : new Date(String(value).replace(" ", "T"));
}

const pad = (n) => String(n).padStart(2, "0");

function formatDate(value) {
    const d = toDate(value);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTime(value) {
    const d = toDate(value);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

module.exports = { formatDate, formatTime };
