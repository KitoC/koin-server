const router = require("express").Router({ mergeParams: true });
const v1 = require("./v1");

router.use("/api/v1", v1);

module.exports = router;
