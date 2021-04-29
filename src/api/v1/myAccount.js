const router = require("express").Router({ mergeParams: true });
const api = require("../../_config/api");

const endpoint = `/api/v1/my-account/apps/${process.env.USER_SERVICE_APP_ID}/settings`;

router.get("/settings", async (req, res, next) => {
  try {
    const { data } = await api.userService.get(`${endpoint}`, {
      headers: { ["Authorization"]: req.headers.authorization },
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch("/settings", async (req, res, next) => {
  try {
    console.log(req.body);
    const { data } = await api.userService.patch(`${endpoint}`, req.body);

    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
