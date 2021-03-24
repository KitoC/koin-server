const removeFIATCoin = (data) => {
  return data.filter(({ short_name }) => short_name !== "AUD");
};

module.exports = removeFIATCoin;
