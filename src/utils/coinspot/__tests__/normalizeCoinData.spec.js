const normalizeCoinData = require("../normalizeCoinData");

describe("utils/coinspot/normalizeCoinData", () => {
  describe("when provided a coinspot coin balance object", () => {
    it("normalizes the coin balance into expected shape", () => {
      const testData = { btc: { rate: 0.1, balance: 1, audbalance: 0.1 } };
      const expectedResult = {
        short_name: "btc",
        rate: 0.1,
        balance: 1,
        fiat_value: 0.1,
      };

      expect(normalizeCoinData(testData)).toEqual(expectedResult);
    });
  });
});
