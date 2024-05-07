const express = require("express");
const router = express.Router();

const InstancesController = require("../controllers/instances");
const { requireAuth } = require("../middlewares/auth");

router.get("/:serviceType", requireAuth, InstancesController.getInstances);

module.exports = router;