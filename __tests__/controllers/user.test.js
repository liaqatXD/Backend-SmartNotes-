const { createUser,getUser,updateUser } = require('../../controllers/userController'); 
const userModel = require("../../models/user");

jest.mock("../../models/user");

const httpMocks = require("node-mocks-http");

// testing creating user

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a user successfully", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/users",
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the create method of userModel
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123"
    };
    userModel.create.mockResolvedValueOnce(userData);

    await createUser(req, res);

    expect(userModel.create).toHaveBeenCalledWith(userData);

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual(userData);
  });

  test("should handle errors while creating user", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/users",
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the create method of userModel to throw an error
    userModel.create.mockRejectedValueOnce(new Error("Database error"));

    await createUser(req, res);

    expect(userModel.create).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ "error": "Database error" });
  });
});

/***** testing getting user details *******/ 

describe("getUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should get a user successfully", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/users/test@example.com",
      params: {
        email: "test@example.com"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the findOne method of userModel
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123"
    };
    userModel.findOne.mockResolvedValueOnce(userData);

    await getUser(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual(userData);
  });

  test("should handle error when no user found", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/users/nonexistent@example.com",
      params: {
        email: "nonexistent@example.com"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the findOne method of userModel to return null
    userModel.findOne.mockResolvedValueOnce(null);

    await getUser(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: "nonexistent@example.com" });
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ "error": "No user found." });
  });

  test("should handle errors while getting user", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/users/test@example.com",
      params: {
        email: "test@example.com"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the findOne method of userModel to throw an error
    userModel.findOne.mockRejectedValueOnce(new Error("Database error"));

    await getUser(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ "error": "Database error" });
  });
});


/***** testing updating user details *******/ 
describe("updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update a user successfully", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/users/test@example.com",
      params: {
        email: "test@example.com"
      },
      body: {
        username: "updateduser",
        password: "updatedpassword"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the updateOne method of userModel
    userModel.updateOne.mockResolvedValueOnce({ nModified: 1 });

    await updateUser(req, res);

    expect(userModel.updateOne).toHaveBeenCalledWith(
      { email: "test@example.com" },
      {
        $set: {
          username: "updateduser",
          password: "updatedpassword"
        }
      }
    );

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({ "success": "user details updated successfully." });
  });

  test("should handle errors while updating user", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/users/test@example.com",
      params: {
        email: "test@example.com"
      },
      body: {
        username: "updateduser",
        password: "updatedpassword"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the updateOne method of userModel to throw an error
    userModel.updateOne.mockRejectedValueOnce(new Error("Database error"));

    await updateUser(req, res);

    expect(userModel.updateOne).toHaveBeenCalledWith(
      { email: "test@example.com" },
      {
        $set: {
          username: "updateduser",
          password: "updatedpassword"
        }
      }
    );
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ "error": "Database error" });
  });
});
