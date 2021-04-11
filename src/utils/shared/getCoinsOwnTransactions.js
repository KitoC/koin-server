const getCoinTransactions = (coin, transactions) => {
  return transactions.filter((transaction) => {
    return transaction.market.includes(coin.short_name);
  });
};

module.exports = getCoinTransactions;
