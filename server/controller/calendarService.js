const { generateJson, dateValidation } = require("../helpers/input/inputH");
const Event = require("../model/Event");

const service = {
  createEvent: async (user, title, startDate, endDate) => {
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    const event = await Event.create({
      title,
      startDate: startDateObject,
      endDate: endDateObject,
      owner: user._id,
    });

    if (!event)
      return {
        status: 400,
        message: "Event has not created!",
        data: event,
      };

    return {
      status: 200,
      message: "OK",
      data: event,
    };
  },

  deleteEvent: async (_id, owner) => {
    const calendar = await Event.findOneAndDelete({
      _id,
      owner,
    });

    if (!calendar)
      return {
        status: 400,
        message: "Event has not found!",
        data: calendar,
      };

    return {
      status: 200,
      message: "OK",
      data: calendar,
    };
  },

  updateEvent: async (
    user,
    eventId,
    title,
    description,
    startDate,
    endDate
  ) => {
    const data = generateJson({ title, description, startDate, endDate });

    if (data.hasOwnProperty("startDate")) {
      if (!dateValidation(data["startDate"]))
        return {
          status: 400,
          message: "Invalid input!",
          data: null,
        };

      data["startDate"] = new Date(data["startDate"]);
    }

    if (data.hasOwnProperty("endDate")) {
      if (!dateValidation(data["endDate"]))
        return {
          status: 400,
          message: "Invalid input!",
          data: null,
        };
      data["endDate"] = new Date(data["endDate"]);
    }

    if (_.isEmpty(data))
      return {
        status: 400,
        message: "Invalid input!",
        data: null,
      };

    const event = await Event.findOneAndUpdate(
      { _id: eventId, owner: user._id },
      data,
      {
        new: true,
      }
    );

    if (!event)
      return {
        status: 400,
        message: "Event has not found!",
        data: event,
      };

    return {
      status: 200,
      message: "OK",
      data: event,
    };
  },

  getEvent: async (user, title, description, startDate, endDate) => {
    const data = generateJson({ title, description, startDate, endDate });

    if (data.hasOwnProperty("startDate")) {
      if (!dateValidation(data["startDate"]))
        return {
          status: 400,
          data: null,
          message: "Invalid Inputs",
        };

      data["startDate"] = { $gte: new Date(data["startDate"]) };
    }

    if (data.hasOwnProperty("endDate")) {
      if (!dateValidation(data["endDate"]))
        return {
          status: 400,
          data: null,
          message: "Invalid Inputs",
        };

      data["endDate"] = { $lte: new Date(data["endDate"]) };
    }

    data["owner"] = user._id;

    const calendars = await Event.find(data);

    return {
      status: 200,
      data: calendars,
      message: "OK",
    };
  },
};

module.exports = service;
