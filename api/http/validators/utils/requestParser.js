function parseFields(body, allowedFields) {

    
    const actualFields = Object.keys(body);

    for (const key of actualFields) {
        if (!allowedFields.includes(key)) {
            return { error: `Illegal field detected: \`${key}\`. Only ${allowedFields.join(", ")} are allowed.` };
        }
    }

    return body;
}

module.exports = parseFields;