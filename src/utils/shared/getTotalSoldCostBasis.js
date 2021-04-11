const getTotalSoldCostBasis = (transactions = []) => {
  return transactions.reduce((total, next) => {
    if (next.type === "SELL") {
      total += next.cost_basis;
    }

    return total;
  }, 0);
};

module.exports = getTotalSoldCostBasis;
