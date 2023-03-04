const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const tokenSigning = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: user?.id, email: user?.email, sid: user?.encSid },
      process.env.JWT_SECRET,
      { expiresIn: `${process.env.EXPIRE_TOKEN * 1000}` ?? `${3600 * 1000}` }, // as milliseconds
      (err, token) => {
        if (err) {
          return reject(err)
        }

        return resolve(token)
      }
    );
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token,
      process.env.JWT_SECRET, {complete: true},
      (err, authData) => {
        if (err) {
          return reject(err)
        }

        return resolve(authData)
      }
    );
  });
};

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.decode(token, {complete: true},
      (err, authData) => {
        if (err) {
          return reject(err)
        }

        return resolve(authData)
      }
    );
  });
};

module.exports = {
  tokenSigning,
  verifyToken,
  decodeToken
};
