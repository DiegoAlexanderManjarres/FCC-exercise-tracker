const express = require('express')

const { createUser, addExercise, getLog } = require('../controllers/controllers')
const {
   checkDescription,
   checkDuration,
   checkUserName,
   checkUserId,
   ifValidationFails
} = require('../middlewares/validators')

const router = express.Router()

router.post('/new-user', checkUserName(), ifValidationFails, createUser)

router.post(
   '/add', 
   [checkUserId(), checkDescription(), checkDuration()],
   ifValidationFails,
   addExercise
   )

router.get('/log', getLog)


module.exports = router