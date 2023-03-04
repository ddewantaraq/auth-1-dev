const User = require("../../models/user");
const { tokenSigning } = require("../../commons/jwt");
const { sendSuccessMsg, sendErrorMsg } = require("../../commons/response");
const coreService = require("../../services");
const redisClient = require('../../commons/redis')

async function generateNewToken(user) {
  const encUserEmail = coreService.encryptData(user?.email)
  await redisClient.set('loggedIn_' + encUserEmail, user?.email)

  // sid generation
  const {encSid, plainSid} = coreService.sidGeneration(user?.email)
  await redisClient.set('sid_' + encSid, plainSid, {
    EX: process.env.EXPIRE_TOKEN, // as seconds
    NX: true
  })
  
  const jwtPayload = {
    id: user?.id, email: user?.email, encSid: encSid, encUserEmail: encUserEmail
  }
  const token = await tokenSigning(jwtPayload);
  const returnedData = {
    token: token,
  };

  return returnedData
}

const signIn = async (req, res) => {
  const reqBody = JSON.parse(JSON.stringify(req.body));
  const user = await User.findOne({ where: { email: reqBody?.email } });
  if (user === null) {
    return sendErrorMsg(res, {
      msg: "sign in not successfully",
      error: "invalid data",
    });
  }

  // jwt sign
  try {
    const loggedInOne = await redisClient.get('loggedIn_' + req?.user?.encUserEmail)
    if (loggedInOne) {
      console.log("loggedInOne signIn:error");
      return sendErrorMsg(res, {
        msg: "sign in not successfully",
        error: "you only able to login one device",
      });
    }

    const returnedData = await generateNewToken(user)    

    return sendSuccessMsg(res, {
      msg: "sign in successfully",
      data: returnedData,
    });
  } catch (e) {
    console.log(e, " jwt:error");
    return sendErrorMsg(res, {
      msg: "sign in not successfully",
      error: "something wrong",
    });
  }
};

const signUp = async (req, res) => {
  const reqBody = JSON.parse(JSON.stringify(req.body));
  const user = await User.findOne({ where: { email: reqBody?.email } });
  if (user !== null) {
    return sendErrorMsg(res, {
      msg: "sign up not successfully",
      error: "user already exist!",
    });
  }
  try {
    await User.create({
      firstName: reqBody?.firstName,
      lastName: reqBody?.lastName,
      email: reqBody?.email,
    });
    return sendSuccessMsg(res, { msg: "sign up successfully", data: reqBody });
  } catch (e) {
    console.log(e, " signup:error");
    return sendErrorMsg(res, {
      msg: "sign up not successfully",
      error: "something wrong",
    });
  }
};

const logout = async (req, res) => {
  const loggedInOne = await redisClient.get('loggedIn_' + req?.user?.encUserEmail)
  if (!loggedInOne) {
    console.log("loggedInOne logout:error");
    return sendErrorMsg(res, {
      msg: "logout not successfully",
      error: "something wrong",
    });
  }
  const sid = await redisClient.get('sid_' + req?.user?.sid)
  if (!sid) {
    console.log("sid logout:error");
    return sendErrorMsg(res, {
      msg: "logout not successfully",
      error: "something wrong",
    });
  }

  await redisClient.del('loggedIn_' + req?.user?.encUserEmaill)
  await redisClient.del('sid_' + req?.user?.sid)
  return sendSuccessMsg(res, {
    msg: "logout successfully",
    data: [],
  });
}

const retrieveNewToken = async (req, res) => {
  const loggedInOne = await redisClient.get('loggedIn_' + req?.user?.encUserEmail)
  if (!loggedInOne) {
    console.log("loggedInOne retrieveNewToken:error");
    return sendErrorMsg(res, {
      msg: "generate new token not successfully",
      error: "something wrong",
    });
  }
  const sid = await redisClient.get('sid_' + req?.user?.sid)
  if (!sid) {
    console.log("sid retrieveNewToken:error");
    return sendErrorMsg(res, {
      msg: "generate new token not successfully",
      error: "something wrong",
    });
  }

  await redisClient.del('loggedIn_' + req?.user?.encUserEmaill)
  await redisClient.del('sid_' + req?.user?.sid)

  const returnedData = await generateNewToken(req?.user)
  return sendSuccessMsg(res, {
    msg: "generate new token successfully",
    data: returnedData,
  });
}

module.exports = {
  signIn,
  signUp,
  logout,
  retrieveNewToken
};
