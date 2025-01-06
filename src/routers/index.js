const express = require("express");
const router = express.Router();
router.use("/v2/api/user", require("./userRouter/index"));
router.use("/v2/api/shop", require("./shopRouter/index"));
router.use("/v2/api/category", require("./categoryRouter/index"));
router.use("/v2/api/product", require("./productRouter/index"));
router.use("/v2/api/cart", require("./cartRouterV2/index"));
router.use("/v2/api/discount", require("./discountRouter/index"));
router.use("/v2/api/order", require("./orderServiceV5/index"));
router.use("/v2/api/comment", require("./commentRouter/index"));
router.use("/v2/api/review", require("./reviewRouter/index"));
router.use("/v2/api/favorite", require("./FavoritesProductRouter/index"));
router.use("/v2/api/location", require("./locationRouter/index"));
router.use("/v2/api/inventory", require("./inventoryRouter/index"));
router.use("/v2/api/openningHours", require("./openningHoursRouter/index"));
router.use("/v2/api/sideDish", require("./sideDishRouter/index"));
router.use("/v2/api/rcm", require("./recomment/index"));

router.use("/v2/api/momoSuccess", require("./momo/index"));

router.use("/v2/api/firebase", require("../firebase/Router/index"));
router.use("/v2/api/RedeemPoints", require("./redeemPointsRouter/index"));
module.exports = router;
