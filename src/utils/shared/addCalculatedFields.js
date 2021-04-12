const sum = require("lodash/sum");
const getCoinsOwnTransactions = require("./getCoinsOwnTransactions");
const calculateCostBases = require("./calculateCostBases");
const getTotalSoldCostBasis = require("./getTotalSoldCostBasis");
const getUnrealizedCostBasis = require("./getUnrealizedCostBasis");
const getRealizedProfit = require("./getRealizedProfit");

const getPercentageDifference = (difference, original) => {
  return (difference / original) * 100;
};

const addCalculatedFields = ({
  transactions: all_transactions,
  coin,
  options = { cost_basis_type: "FIFO" },
}) => {
  const { fiat_value, short_name } = coin;

  const transactions = calculateCostBases(
    options.cost_basis_type,
    getCoinsOwnTransactions(coin, all_transactions)
  );

  const getAudTotal = ({ audtotal }) => audtotal;

  const realized_cost_basis = getTotalSoldCostBasis(transactions);
  const unrealized_cost_basis = getUnrealizedCostBasis(transactions);

  const unrealized_profit = fiat_value - unrealized_cost_basis;
  const realized_profit = getRealizedProfit(transactions);

  return {
    ...coin,
    realized_profit,
    unrealized_profit,
    realized_cost_basis,
    unrealized_cost_basis,
    transactions,
  };
};

module.exports = addCalculatedFields;
