const getCoinsOwnTransactions = require("../getCoinsOwnTransactions");

describe("utils/shared/getCoinsOwnTransactions", () => {
  describe("when provided a coin balance object and transactions", () => {
    const coin = { short_name: "BTC", rate: 2, balance: 100, fiat_value: 200 };
    const transactions = [
      { market: "BTC/AUD" },
      { market: "BTC/AUD" },
      { market: "BTC/AUD" },
      { market: "VET/AUD" },
      { market: "VTHO/AUD" },
      { market: "BTC/VET" },
      { market: "VET/BTC" },
    ];

    it("adds all sold transaction costBases and returns a total", () => {
      const result = getCoinsOwnTransactions(coin, transactions);
      expect(result.length).toEqual(4);
    });
  });
});
