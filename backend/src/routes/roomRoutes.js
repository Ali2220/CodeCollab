const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/auth')
const { createRoom, getRooms, getRoomById, joinRoom, leaveRoom, deleteRoom} = require('../controllers/roomController')
const {handleValidationErrors, validateRoom} = require('../utils/validators')

// All routes are protected
router.use(protect)

router.post('/', validateRoom, handleValidationErrors, createRoom)
router.get('/', getRooms)

router.get('/:roomId', getRoomById)
router.delete('/:roomId', deleteRoom)

router.post('/:roomId/join', joinRoom)
router.post("/:roomId/leave", leaveRoom)


module.exports = router