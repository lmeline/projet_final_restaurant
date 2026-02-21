

/**
 * Validate and parse the query parameters of a request
 * @param {*} queryParams the req.query that need to be validated 
 * @param {*} expectedParams the expected params template, each key represent a param, 
 * each value represent the expected type, such as "string", "number", "boolean" or "date", 
 * an array can be given if the parameter value must be one of the values in the array 
 * example : 
 * {
 *     "param1" : "string",
 *     "param2" : "number",
 *     "param3" : ["value1", "value2", "value3"],
 *     "param4" : "boolean"
 * }
 * @returns the parsed values, converted to the expected type
 */
function validateExpectedParams(queryParams, expectedParams) {
    let parsedQuery = {};
    for (const paramKey of Object.keys(queryParams)) {
        if (!expectedParams[paramKey]) {
            return { error: `Illegal query parameter detected: \`${paramKey}\`. Only ${Object.keys(expectedParams).join(", ")} are allowed.` };
        }

        const paramType = expectedParams[paramKey];
        const value = queryParams[paramKey];


        if (Array.isArray(paramType)) {
            if (!paramType.includes(value)) {
                return { error: `Param \`${paramKey}\` must be one of \`${paramType.join(", ")}\`` };
            }
            parsedQuery[paramKey] = value;
            continue;
        }
        
        switch (paramType) {
            case "string":
                parsedQuery[paramKey] = value;
                break;
            case "number":
                if (Number.isNaN(Number(value))) {
                    return { error: `Param \`${paramKey}\` must be a number` };
                }
                parsedQuery[paramKey] = Number(value);
                break;
            case "boolean":
                if (value !== "true" && value !== "false") {
                    return { error: `Param \`${paramKey}\` must be a boolean` };
                }
                parsedQuery[paramKey] = value === "true";
                break;
            case "date":
                const date = new Date(value);
                if (Number.isNaN(date.getTime())) {
                    return { error: `Param \`${paramKey}\` must be a date (yyyy-mm-dd)` };
                }
                parsedQuery[paramKey] = date;
                break;
            default:
                return { error: `Param \`${paramKey}\` must be a ${paramType}` };
        }

        
    }
    return parsedQuery;
}

module.exports = validateExpectedParams;