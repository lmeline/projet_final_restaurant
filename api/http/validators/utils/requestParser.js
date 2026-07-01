/**
 * Validate that the body only contains allowed fields and return a clean object
 * holding just those fields (prevents mass-assignment of unexpected keys).
 */
function parseFields(body, allowedFields) {
    const picked = {};

    for (const key of Object.keys(body)) {
        if (!allowedFields.includes(key)) {
            return { error: `Illegal field detected: \`${key}\`. Only ${allowedFields.join(", ")} are allowed.` };
        }
        picked[key] = body[key];
    }

    return picked;
}

module.exports = parseFields;
