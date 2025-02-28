const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const CheckRoleMiddleware = require("../middleware/CheckRoleMiddleware");

router.post("/add", orderController.create);
router.get("/all", orderController.getAll); // Только для админа
router.get("/:id", orderController.getOne); // Только для админа
router.delete(
  "/delete/order/:id",
  CheckRoleMiddleware("ADMIN"),
  orderController.delete
); // Только для админа
router.put("/:id/payment", CheckRoleMiddleware("ADMIN"),  orderController.updatePaymentStatus);

module.exports = router;
