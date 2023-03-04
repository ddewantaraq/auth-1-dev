describe('signIn', () => {
  it('should return an error message if no user is found', async () => {
    const req = { body: { email: 'invalid@email.com' } };
    const res = {
      sendErrorMsg: jest.fn(),
    };
    await signIn(req, res);
    expect(res.sendErrorMsg).toHaveBeenCalledWith(res, {
      msg: 'sign in not successfully',
      error: 'invalid data',
    });
  });

  it('should return an error message if the user is already logged in', async () => {
    const req = { user: { encUserEmail: 'encUserEmail' } };
    redisClient.get.mockReturnValueOnce('loggedIn_encUserEmail');
    const res = {
      sendErrorMsg: jest.fn(),
    };
    await signIn(req, res);
    expect(res.sendErrorMsg).toHaveBeenCalledWith(res, {
      msg: 'sign in not successfully',
      error: 'you only able to login one device',
    });
  });

  it('should return a success message if the sign in is successful', async () => {
    const user = {};
    const req = { body: { email: 'valid@email.com' } };
    User.findOne.mockReturnValueOnce(user);
    const returnedData = { token: 'token' };
    generateNewToken.mockReturnValueOnce(returnedData);
    const res = {
      sendSuccessMsg: jest.fn(),
    };
    await signIn(req, res);
    expect(res.sendSuccessMsg).toHaveBeenCalledWith(res, {
      msg: 'sign in successfully',
      data: returnedData,
    });
  });
});