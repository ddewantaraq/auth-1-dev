const { getMe } = require("../../../controllers/me");

const req = {
  user: {
    sid: 'some-id',
    name: 'John',
    age: 25
  }
}

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

it('should return the correct response', async () => {
  const mockRes = mockResponse();
  await getMe(req, mockRes);

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith({
    msg: "fetch me successfully",
    data: {
      name: 'John',
      age: 25
    },
    success: true
  });
});