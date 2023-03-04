const { body } = require('express-validator')
const signupValidationRules = () => {
  return [
    body('firstName').isString(),
    body('lastName').isString(),
    body('email').isEmail(),
  ]
}

const signinValidationRules = () => {
  return [
    body('email').isEmail(),
  ]
}

module.exports = {
  signupValidationRules,
  signinValidationRules
}