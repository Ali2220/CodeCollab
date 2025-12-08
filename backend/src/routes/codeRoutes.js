const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { saveCode, getCodeHistory } = require("../controllers/codeController");
// All routes are protected
router.use(protect);

router.post("/:roomId", saveCode);
router.get('/:roomId/history', getCodeHistory)

module.exports = router;
