const normalizeCoinData = (coin) => {
  const [short_name, attributes] = Object.entries(coin)[0];
  const { balance, rate, audbalance: fiat_value } = attributes;

  return { short_name, balance, rate, fiat_value };
};

module.exports = normalizeCoinData;
