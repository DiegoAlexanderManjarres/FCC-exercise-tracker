const { body, validationResult } = require('express-validator/check')


exports.checkUserId = (req, res, next) => {
   return body('userId').trim().isLength({ min: 9, max: 10 })
}

exports.checkUserName = (req, res, next) => {
   return body('new-user').trim().isLength({ min: 3, max: 30 })
}

exports.checkDescription = (req, res, next) => {
   return body('description').trim().isLength({ min: 3, max: 60 })
}

exports.checkDuration = (req, res, next) => {
   return body('duration').trim().isLength({ min: 1, max: 3 })
}


exports.ifValidationFails = (req, res, next) => {
   const erros = validationResult(req)
   if(!erros.isEmpty()) {
      return res.status(422).json('Invalid Input')
   } 
  next()
}