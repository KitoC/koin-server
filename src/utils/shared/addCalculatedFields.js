const sum = require("lodash/sum");
const getCoinsOwnTransactions = require("./getCoinsOwnTransactions");
const calculateCostBases = require("./calculateCostBases");
const getTotalSoldCostBasis = require("./getTotalSoldCostBasis");

const getPercentageDifference = (difference, original) => {
  return (difference / original) * 100;
};

// const getCoinsOwnTransactionsWithCostBasis = (coin, transactions) => {
//   return calculateCostBases(
//     options.cost_basis_type,
//     getCoinsOwnTransactions(coin, transactions)
//   );
// };

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
  // const total_buy_order_amount = sum(buy_orders.map(getAudTotal));
  // const total_sell_order_amount = sum(sell_orders.map(getAudTotal));
  // const total_aud_spent = total_buy_order_amount - total_sell_order_amount;

  // const profit = aud_balance - total_aud_spent;

  // const percentage_difference = getPercentageDifference(
  //   profit,
  //   total_aud_spent
  // );

  // const gainz = aud_balance + total_sell_order_amount - total_buy_order_amount;

  const total_sold_cost_basis = getTotalSoldCostBasis(transactions);

  const unrealized_profit = fiat_value - total_sold_cost_basis;

  return {
    // profit,
    // total_aud_spent,
    // total_buy_order_amount,
    // total_sell_order_amount,
    // percentage_difference,
    unrealized_profit,
    ...coin,
    transactions,
    // gainz,
  };
};

module.exports = addCalculatedFields;
