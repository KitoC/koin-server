const getUnrealizedCostBasis = (transactions) => {
  const buyOrders = transactions
    .filter((t) => t.type === "BUY")
    .filter(({ amount, realized }) => amount !== realized);

  return buyOrders.reduce((unrealizedProfit, transaction) => {
    const fraction = transaction.realized / transaction.amount || 1;
    const unrealizedCostBasis = transaction.fiat_value * fraction;

    return (unrealizedProfit += unrealizedCostBasis);
  }, 0);
};

module.exports = getUnrealizedCostBasis;
