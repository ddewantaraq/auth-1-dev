const { getMe } = require("../../../controllers/me");

const req = {
  user: {
    sid: 'some-id',
    name: 'John',
    age: 25
  }
}

const res = {
  sendSuccessMsg: jest.fn()
}

it('should return the correct response', async () => {
  await getMe(req, res);

  expect(res.sendSuccessMsg).toHaveBeenCalledWith(res, {
    msg: 'fetch me successfully',
    data: {
      name: 'John',
      age: 25
    }
  });
});