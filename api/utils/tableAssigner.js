// Utility function to calculate the required table sizes based on the number of people
function getRequiredTableSizes(peopleCount) {
    if (!peopleCount || peopleCount <= 0) return [];

    const standardSizes = [8, 6, 4, 2]; 
    let remaining = peopleCount;
    let requiredSizesMap = {};

    while (remaining > 0) {
        let suitableSize = [...standardSizes]
            .sort((a, b) => a - b)
            .find(size => size >= remaining);

        let sizeToTable;
        if (suitableSize) {
            sizeToTable = suitableSize;
            remaining -= suitableSize;
        } else {
            sizeToTable = Math.max(...standardSizes);
            remaining -= sizeToTable;
        }

        requiredSizesMap[sizeToTable] = (requiredSizesMap[sizeToTable] || 0) + 1;
    }

    return requiredSizesMap;
}

module.exports = { getRequiredTableSizes };