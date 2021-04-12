const getZeroBalanceCoins = ({ transactions, balances }) => {
  const nextBalances = balances;
  const allTransactions = [
    ...transactions.buyorders,
    ...transactions.sellorders,
  ];

  allTransactions.map((coin) => {
    const shouldAdd = !nextBalances.filter(({ short_name }) => {
      return coin.market.includes(short_name);
    }).length;

    const [short_name] = coin.market.split("/");

    if (shouldAdd && !nextBalances.find((b) => b.short_name === short_name)) {
      const normalizedCoin = {
        short_name,
        fiat_value: 0,
        balance: 0,
        rate: 0,
      };

      nextBalances.push(normalizedCoin);
    }
  });

  return nextBalances;
};

module.exports = getZeroBalanceCoins;
