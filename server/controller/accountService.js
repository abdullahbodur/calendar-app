const { comparePasswordInModel } = require("../helpers/input/inputH");
const User = require("../model/User");

const service = {
  signUp: async (name, email, password) => {
    name = name.trim();
    email = email.trim();

    const account = await User.create({
      name,
      email,
      password,
    });

    if (!account)
      return {
        status: 400,
        data: account,
        message: "Account has not created",
      };

    return {
      status: 200,
      data: account,
      message: "OK",
    };
  },

  signIn: async (email, password) => {
    try {
      email.toLowerCase();

      email = email.trim();

      const account = await User.findOne({ email: email }).select("+password");

      if (account === null || !account.password)
        return {
          status: 400,
          data: null,
          message: "Email or Password is wrong, Please try again",
        };

      if (!comparePasswordInModel(password, account.password))
        return {
          status: 400,
          data: null,
          message: "Email or Password is wrong, Please try again",
        };

      if (account.blocked)
        return {
          status: 403,
          data: null,
          message: "You are blocked",
        };

      return { status: 200, data: account, message: "OK" };
    } catch (error) {
      return { status: 400, data: null, message: "Something wrong!" };
    }
  },
};

module.exports = service;
