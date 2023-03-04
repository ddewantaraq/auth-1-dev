const {
  signIn
} = require('../../../controllers/auth')
const User = require('../../../models/user')
const redisClient = require('../../../commons/redis')
const { tokenSigning } = require("../../../commons/jwt");
const coreService = require("../../../services");

jest.mock('../../../models/user', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../../commons/redis', () => ({
  createClient: jest.fn(),
  get: jest.fn(),
  set: jest.fn()
}));
jest.mock('../../../services', () => ({
  sidGeneration: jest.fn()
}));
jest.mock('../../../commons/jwt', () => ({
  tokenSigning: jest.fn()
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('signIn', () => {
  it('should return an error message if no user is found', async () => {
    const req = { body: { email: 'invalid@email.com' } };
    const mockRes = mockResponse();
    User.findOne.mockResolvedValue(null);

    await signIn(req, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: null,
      msg: "sign in not successfully",
      error: "invalid data",
      success: false
    });
  });

  it('should return an error message if the user is already logged in', async () => {
    const req = { body: { email: 'dewatara@gmail.com' } };
    const mockRes = mockResponse();
    User.findOne.mockResolvedValue({ email: 'dewatara@gmail.com' });
    redisClient.get.mockReturnValueOnce('loggedIn_dewatara@gmail.com');

    await signIn(req, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: null,
      msg: "sign in not successfully",
      error: "you only able to login one device",
      success: false
    });
  });

  it('should return a success message if the sign in is successful', async () => {
    const req = { body: { email: 'dewatara@gmail.com' } };
    const mockRes = mockResponse();
    User.findOne.mockResolvedValue({ email: 'dewatara@gmail.com' });
    redisClient.get.mockReturnValueOnce(null);
    tokenSigning.mockResolvedValue('token123')
    coreService.sidGeneration.mockResolvedValue({encSid: 'encsid', plainSid: 'sid'})

    await signIn(req, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {token: 'token123'},
      msg: "sign in successfully",
      success: true
    });
  });
});