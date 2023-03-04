const { validationResult } = require('express-validator')
const {
  sendErrorMsg
} = require('../commons/response')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return sendErrorMsg(res, {msg: 'Bad Request', error: extractedErrors})
}

module.exports = {
  validate,
}