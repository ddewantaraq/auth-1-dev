const {
  sendErrorMsg
} = require('../commons/response')
const { verifyToken, decodeToken } = require("../commons/jwt");
const User = require("../models/user");
const redisClient = require('../commons/redis');
const coreService = require('../services');

async function validateToken(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader === 'undefined') {
    console.log('userValidator:undefined bearer')
    return sendErrorMsg(res, { msg: "Unauthorized", error: 'Unauthorized' }, {errorCode: 401});
  }

  const token = bearerHeader.split(" ")[1]
  try {
    let decodedToken = null
    if (req?.decodeOnly) {
      decodedToken = await decodeToken(token)
      delete req?.decodeOnly
    } else {
      decodedToken = await verifyToken(token)
    }
    if (!decodedToken) {
      console.log(e, ' userValidator:decodedToken error')
      return sendErrorMsg(res, { msg: "Unauthorized", error: 'Unauthorized' }, {errorCode: 401});
    }

    const plainSid = await redisClient.get('sid_' + decodedToken?.payload?.sid)

    if (!plainSid) {
      return sendErrorMsg(res, { msg: "Unauthorized", error: 'Unauthorized' }, {errorCode: 401});
    }
    const decryptedSid = coreService.decryptData(decodedToken?.payload?.sid)
    if (plainSid !== decryptedSid) {
      return sendErrorMsg(res, { msg: "Unauthorized", error: 'Unauthorized' }, {errorCode: 401});
    }

    const user = await User.findOne({ where: { id: decodedToken?.payload?.userId } });

    if (user === null) {
      return sendErrorMsg(res, { msg: "Unauthorized", error: 'Unauthorized' }, {errorCode: 401});
    }
    
    const result = {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      sid: decodedToken?.payload?.sid,
      encUserEmail: decodedToken?.payload?.encUserEmail
    }
    req.user = result
    return next()
  } catch (e) {
    console.log(e, ' userValidator:error')
    return sendErrorMsg(res, { msg: "Unauthorized", error: 'Unauthorized' }, {errorCode: 401});
  }
}

const userValidator = async (req, res, next) => {
  return await validateToken(req, res, next);
}

const tokenDecoder = async (req, res, next) => {
  req?.decodeOnly = true
  return await validateToken(req, res, next);
}

module.exports = {
  userValidator,
  tokenDecoder
}