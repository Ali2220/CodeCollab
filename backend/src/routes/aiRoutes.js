const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {getCodeSuggestions, reviewCode, explainCode, fixCode} = require('../controllers/aiController')

// All routes are protected
router.use(protect)

router.post('/suggest', getCodeSuggestions)
router.post('/review', reviewCode)
router.post('/explain', explainCode)
router.post('/fix', fixCode)

module.exports = router;
