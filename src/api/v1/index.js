const router = require("express").Router({ mergeParams: true });
const coinspot = require("./coinspot");

router.use("/coinspot", coinspot);

module.exports = router;
