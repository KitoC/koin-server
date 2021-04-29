const router = require("express").Router({ mergeParams: true });
const coinspot = require("./coinspot");
const authentication = require("./authentication");
const myAccount = require("./myAccount");
const checkToken = require("../../middleware/checkToken");
// public
router.use("/authentication", authentication);

// private
router.use("/coinspot", checkToken, coinspot);
router.use("/my-account", checkToken, myAccount);

module.exports = router;
