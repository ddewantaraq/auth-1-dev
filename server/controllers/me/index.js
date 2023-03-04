const { sendSuccessMsg } = require("../../commons/response");

const getMe = async (req, res) => {
  const {sid, ...user} = req?.user
  return sendSuccessMsg(res, {
    msg: "fetch me successfully",
    data: user ?? [],
  });
};

module.exports = {
  getMe,
};
