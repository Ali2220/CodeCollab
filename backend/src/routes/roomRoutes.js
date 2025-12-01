const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/auth')
const { createRoom} = require('../controllers/roomController')

// All routes are protected
router.use(protect)

router.post('/', createRoom)


module.exports = router