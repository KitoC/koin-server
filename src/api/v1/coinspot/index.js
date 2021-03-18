const router = require("express").Router({ mergeParams: true });
const balances = require("./balances");

router.use("/balances", balances);

module.exports = router;
