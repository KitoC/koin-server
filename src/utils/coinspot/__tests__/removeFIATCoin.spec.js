const removeFIATCoin = require("../removeFIATCoin");

describe("utils/coinspot/removeFIATCoin", () => {
  describe("when a FIAT coin balance exists", () => {
    it("removes FIAT coin balance from array", () => {
      const testData = [
        { short_name: "AUD", balance: 5 },
        { short_name: "BTC", balance: 5 },
        { short_name: "VET", balance: 5 },
        { short_name: "DOGE", balance: 5 },
      ];
      const expectedResult = [
        { short_name: "BTC", balance: 5 },
        { short_name: "VET", balance: 5 },
        { short_name: "DOGE", balance: 5 },
      ];

      expect(removeFIATCoin(testData)).toEqual(expectedResult);
    });
  });
});
