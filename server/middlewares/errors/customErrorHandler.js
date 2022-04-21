const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
  let customError = err;

  console.log(err);

  // == == == == == == == == == == == == == == == == == == == ==
  //  ERROR CODES
  // == == == == == == == == == == == == == == == == == == == ==

  if (err.name == "ValidationError") {
    customError = new CustomError(err.message);
  }

  if (err.code == 11000 && err.message.includes("email")) {
    customError = new CustomError("This email is already taken");
  }

  if (err.code == 11000 && err.message.includes("username")) {
    customError = new CustomError("This username is already taken");
  }

  // == == == == == == == == == == == == == == == == == == == ==
  //  ERROR CODES
  // == == == == == == == == == == == == == == == == == == == ==

  // Show error on terminal
  console.log(`Error Name : ${customError.name}
  Error Code : ${customError.statusCode}
  Error Message : ${customError.message}`);

  // send error message at jsonFormat
  res.status(customError.statusCode || 200).json({
    success: false,
    message: customError.message,
  });
};

module.exports = customErrorHandler;
