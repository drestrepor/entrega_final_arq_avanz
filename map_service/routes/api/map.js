const express = require("express");
const router = express.Router();
const mapController = require("../../controllers/api/mapControllerApi");

router.get("/", mapController.list);

module.exports = router;
