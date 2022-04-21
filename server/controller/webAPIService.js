const errorHandlerWrapper = require("express-async-handler");
const { sendJwtToUser } = require("../helpers/auth/tokenH");
const CustomError = require("../helpers/error/CustomError");
const { inputControl, dateValidation } = require("../helpers/input/inputH");
const accountService = require("./accountService");
const calendarService = require("./calendarService");
const _ = require("underscore");

const controllers = {
  signUp: errorHandlerWrapper(async (req, res, next) => {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new CustomError("Some values are missing. Please check your values"),
        400
      );
    }

    try {
      const { status, data, message } = await accountService.signUp(
        name,
        email,
        password
      );

      if (status != 200) return next(new CustomError(message, status));

      sendJwtToUser(data, res);
    } catch (error) {
      console.log(error);

      if (error.message.includes("email_1 dup key"))
        return next(new CustomError("This email has been already in use"));

      return next(new CustomError("Something wrong!"));
    }
  }),
  signIn: errorHandlerWrapper(async (req, res, next) => {
    let { email, password } = req.body;

    if (!inputControl(email, password))
      return next(new CustomError("Please, provide email and password"));

    try {
      const { status, data, message } = await accountService.signIn(
        email,
        password
      );

      if (status != 200) return next(new CustomError(message, status));

      sendJwtToUser(data, res);
    } catch (error) {
      console.log(error);
      return next(new CustomError("Something wrong!"));
    }
  }),
  addEvent: errorHandlerWrapper(async (req, res, next) => {
    const { title, startDate, endDate } = req.body;

    if (
      !_.isString(title) ||
      !dateValidation(startDate) ||
      !dateValidation(endDate)
    )
      return next(new CustomError("Invalid Inputs!!"));

    const calendar = await calendarService.createEvent(
      req.user.userObject,
      title,
      startDate,
      endDate
    );

    if (!calendar) return next(new CustomError("Event couldn't created"));

    return res.status(200).json({
      status: 200,
      body: calendar,
      message: "Event created successfuly",
    });
  }),
  deleteEvent: errorHandlerWrapper(async (req, res, next) => {
    const { eventId } = req.body;

    const user = req.user.userObject;

    if (!eventId) return next(new CustomError("Invalid Inputs!!"));

    const calendar = await Event.findOneAndDelete({
      _id: eventId,
      owner: user._id,
    });

    if (!calendar) return next(new CustomError("Event has been not found"));

    return res.status(200).json({
      status: 200,
      body: calendar,
      message: "Event deleted successfuly",
    });
  }),
  updateEvent: errorHandlerWrapper(async (req, res, next) => {
    const { eventId, title, description, startDate, endDate } = req.body;

    if (!eventId) return next(new CustomError("Invalid Inputs!!"));

    const { status, data, message } = calendarService.updateEvent(
      req.user.userObject,
      eventId,
      title,
      description,
      startDate,
      endDate
    );

    if (status != 200) return next(new CustomError(message, status));

    return res.status(200).json({
      status: 200,
      body: data,
      message: "Event updated successfuly",
    });
  }),
  getEvent: errorHandlerWrapper(async (req, res, next) => {
    const { title, description, startDate, endDate } = req.query;
    const { status, data, message } = await calendarService.getEvent(
      req.user.userObject,
      title,
      description,
      startDate,
      endDate
    );

    if (status != 200) return next(new CustomError(message, status));

    return res.status(200).json({
      status,
      body: data,
      message,
    });
  }),
};

module.exports = controllers;
