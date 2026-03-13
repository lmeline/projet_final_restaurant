const parseFields = require("./utils/requestParser");
    
// Function to check the validity of the request body for creating a user
function validateCreateUserRequest(body) {

    let parsed = parseFields(body, ["firstname", "lastname", "email", "phone", "password"]);
    
    if (parsed.error) {
        return parsed;
    }

    const { email, password, firstname, lastname, phone } = parsed;

    if (typeof email !== "string") {
        return { error: "Field `email` is required and must be a string" }
    }
    if (typeof password !== "string") {
        return { error: "Field `password` is required and must be a string" }
    }
    if (typeof firstname !== "string") {
        return { error: "Field `firstname` is required and  must be a string" }
    }
    if (typeof lastname !== "string") {
        return { error: "Field `lastname` is required and must be a string" }
    }

    if (!validateEmail(email)) {
        return { error: "Field `email` is not valid" }
    }

    if (!validatePassword(password)) {
        return { error: "Field `password` is not valid, must be composed of at least 8 characters, including at least one digit and one special character" }
    }

    if (!validatePhone(phone)) {
        return { error: "Field `phone` is not valid" }
    }
    

    return body;
}

// Function to check the validity of the login request body
function validateLoginRequest(body) {

    let parsed = parseFields(body, ["email", "password"]);

    if (parsed.error) {
        return parsed;
    }

    return body;
}

// Function to check the validity of the email
function validateEmail(email) {
    if (email.length == 0) {
        return false;
    }
    if (!email.includes("@")) {
        return false;
    }
    if (email.split("@")[1].split(".").length < 2) {
        return false;
    }
    return true;
}

// Function to check the validity of the password
function validatePassword(password) {
    if (password.length == 0) {
        return false;
    }
    if (password.length < 8) {
        return false;
    }
    if (password.includes(" ")) {
        return false;
    }

    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*"];

    let score = 0;

    for (let i = 0; i < password.length; i++) {
        if (digits.includes(password[i])) {
            score++
            break
        }
    }
    for (let i = 0; i < password.length; i++) {
        if (specialChars.includes(password[i])) {
            score++
            break
        }
    }
    
    if (score < 2) {
        return false;
    }

    return true;
}

// Function to check the phone number is valid
function validatePhone(phone) {
    if (phone == undefined || phone == null) {
        return true;
    }

    if (phone.length == 0 || phone.length > 13) {
        return false;
    }

    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (let i = 0; i < phone.length; i++) {
        if (i == 0 && phone[i] == "+") {
            continue;
        }
        if (!digits.includes(phone[i])) {
            return false;
        }

    }

    return true;
}



module.exports = { validateLoginRequest, validateCreateUserRequest};