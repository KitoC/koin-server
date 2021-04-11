const arraySort = require("array-sort");
const sumBy = require("lodash/sumBy");
const round = require("lodash/round");

const COST_BASIS_TYPES = { FIFO: "FIFO", LIFO: "LIFO", HIFO: "HIFO" };

const addZeroRealized = (order) => {
  order.realized = 0;

  return order;
};

const stripRealized = (order) => {
  delete order.realized;

  return order;
};

const filterByType = (type) => (order) => type === order.type;

const getRate = (order) => order.fiat_value / order.amount;
const compareByRate = (a, b) => getRate(a) - getRate(b);

const getBuyAmountToBeRealized = (buyorder, amountToRealize) => {
  const amountLeftUnrealized = buyorder.amount - buyorder.realized;
  const shouldTakeRemainder = amountToRealize >= amountLeftUnrealized;

  return shouldTakeRemainder ? amountLeftUnrealized : amountToRealize;
};

const getNexCostBasis = (buyorder, realized) => {
  const fraction = buyorder.amount / realized;
  const fiat_value = buyorder.fiat_value / fraction;

  return { amount: realized, fiat_value };
};

const basisTypeSortingScheme = {
  FIFO: (orders) => arraySort(orders, "created"),
  LIFO: (orders) => arraySort(orders, "created", { reverse: true }),
  HIFO: (orders) => orders.sort(compareByRate).reverse(),
};

const calculateCostBases = (type, transactions = []) => {
  const sortedTransactions = arraySort(transactions, "created");

  const sortBuyOrders = basisTypeSortingScheme[type];
  let buyorders = sortBuyOrders(
    sortedTransactions.filter(filterByType("BUY")).map(addZeroRealized)
  );

  let sellorders = sortedTransactions.filter(filterByType("SELL"));

  sellorders = sellorders.map((sellorder) => {
    let costBasis = [];

    buyorders = buyorders.map((buyorder, index) => {
      const canRealizeFrom =
        buyorder.created <= sellorder.created &&
        buyorder.realized < buyorder.amount;

      if (canRealizeFrom) {
        const amountToRealize = sellorder.amount - sumBy(costBasis, "amount");

        if (amountToRealize) {
          const realized = getBuyAmountToBeRealized(buyorder, amountToRealize);

          buyorder.realized += realized;

          costBasis.push(getNexCostBasis(buyorder, realized));
        }
      }

      return buyorder;
    });

    sellorder.cost_basis = round(sumBy(costBasis, "fiat_value"), 2);

    return sellorder;
  });

  return arraySort(
    [
      ...sortedTransactions.filter(filterByType("BUY")).map(stripRealized),
      ...sellorders,
    ],
    "created"
  );
};

module.exports = calculateCostBases;
module.exports.addZeroRealized = addZeroRealized;
module.exports.stripRealized = stripRealized;
module.exports.getRate = getRate;
module.exports.getBuyAmountToBeRealized = getBuyAmountToBeRealized;
