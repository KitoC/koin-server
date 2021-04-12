const getZeroBalanceCoins = require("../getZeroBalanceCoins");
const normalizeCoinData = require("../normalizeCoinData");

describe("utils/coinspot/getZeroBalanceCoins", () => {
  describe("when provided transaction history and current balances", () => {
    it("returns array with any coins that are now at 0 balance and not included in balances array", () => {
      const transactions = {
        buyorders: [],
        sellorders: [
          {
            otc: false,
            market: "VTHO/AUD",
            amount: 5132.52425,
            created: "2021-02-13T05:20:50.534Z",
            audfeeExGst: 4.18841126,
            audGst: 0.41884113,
            audtotal: 456.12,
          },
        ],
      };

      const balances = [
        { short_name: "BTC", rate: 0.1, balance: 1, fiat_value: 0.1 },
      ];

      const expectedResult = [
        { short_name: "BTC", rate: 0.1, balance: 1, fiat_value: 0.1 },
        { short_name: "VTHO", rate: 0, balance: 0, fiat_value: 0 },
      ];

      expect(getZeroBalanceCoins({ transactions, balances })).toEqual(
        expectedResult
      );
    });
  });
});
