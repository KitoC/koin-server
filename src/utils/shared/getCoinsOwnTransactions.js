const getCoinsOwnTransactions = (coin, transactions) => {
  return transactions.filter((transaction) => {
    const [transactionShortName] = transaction.market.split("/");

    return transactionShortName == coin.short_name;
  });
};

module.exports = getCoinsOwnTransactions;
