const addCalculatedFields = require("../addCalculatedFields");

describe("utils/coinspot/addCalculatedFields", () => {
  describe("when provided a coinspot coin balance object", () => {
    it("normalizes the coin balance into expected shape", () => {
      const transactions = {
        buyorders: [
          {
            market: "BTC/AUD",
            amount: 6,
            created: "2021-02-13T05:20:50.534Z",
            audfeeExGst: 0.1,
            audGst: 0.1,
            audtotal: 6,
          },
        ],
        sellorders: [
          {
            market: "BTC/AUD",
            amount: 1,
            created: "2021-02-13T05:20:50.534Z",
            audfeeExGst: 0.1,
            audGst: 0.1,
            audtotal: 1,
          },
          {
            market: "DOGE/AUD",
            amount: 1,
            created: "2021-02-13T05:20:50.534Z",
            audfeeExGst: 0.1,
            audGst: 0.1,
            audtotal: 1,
          },
        ],
      };

      const coin = { short_name: "BTC", rate: 2, balance: 5, aud_balance: 10 };
      const getCoinTransactions = (t) => t.market.includes("BTC");

      const expectedResult = {
        ...coin,
        unrealized_profit: 6,
        total_buy_order_amount: 6,
        total_sell_order_amount: 1,
        percentage_difference: 100,
        buy_orders: transactions.buyorders.filter(getCoinTransactions),
        sell_orders: transactions.sellorders.filter(getCoinTransactions),
        gainz: 5,
      };

      // console.

      expect(addCalculatedFields({ transactions, coin })).toEqual(
        expectedResult
      );
    });
  });
});
