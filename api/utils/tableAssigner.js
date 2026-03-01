function assignTables(availableTables, peopleCount) {
  let bestCombination = null;
  let bestWaste = Infinity;

  const n = availableTables.length;

  for (let mask = 1; mask < (1 << n); mask++) {
    let combination = [];
    let totalSeats = 0;

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        combination.push(availableTables[i]);
        totalSeats += availableTables[i].seats;
      }
    }

    if (totalSeats >= peopleCount) {
      const waste = totalSeats - peopleCount;

      if (
        waste < bestWaste ||
        (waste === bestWaste && combination.length < bestCombination?.length)
      ) {
        bestWaste = waste;
        bestCombination = combination;
      }
    }
  }

  return bestCombination;
}


module.exports = assignTables;