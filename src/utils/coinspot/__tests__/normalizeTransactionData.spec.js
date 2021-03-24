const normalizeTransactionData = require("../normalizeTransactionData");

describe("utils/coinspot/normalizeTransactionData", () => {
  describe("when provided a coinspot transaction object & type", () => {
    it("normalizes the coin balance into expected shape", () => {
      const testData = {
        otc: false,
        market: "BTC/AUD",
        amount: 0.08125146,
        created: "2020-04-26T23:31:47.847Z",
        audfeeExGst: 9.00090009,
        audGst: 0.90009001,
        audtotal: 1000,
      };
      const expectedResult = {
        type: "BUY",
        otc: testData.otc,
        market: testData.market,
        amount: testData.amount,
        created: testData.created,
        transaction_fee: testData.audfeeExGst + testData.audGst,
        fiat_value: testData.audtotal,
        fiat_currency: "AUD",
      };

      expect(normalizeTransactionData("BUY", testData)).toEqual(expectedResult);
    });
  });
});
