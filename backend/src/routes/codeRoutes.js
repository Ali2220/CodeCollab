const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { saveCode, getCodeHistory, getCurrentCode, getCodeVersion } = require("../controllers/codeController");
// All routes are protected
router.use(protect);

router.post("/:roomId", saveCode);
router.get('/:roomId/history', getCodeHistory)
router.get('/:roomId/current', getCurrentCode)
router.get('/:roomId/version/:version', getCodeVersion)

module.exports = router;
