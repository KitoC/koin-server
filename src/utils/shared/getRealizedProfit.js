const getRealizedProfit = (transactions) => {
  return transactions
    .filter(({ type }) => type === "SELL")
    .reduce((total, next) => (total += next.fiat_value - next.cost_basis), 0);
};

module.exports = getRealizedProfit;
