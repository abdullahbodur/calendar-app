import React, { useEffect, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Card, Form } from "react-bootstrap";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [];

const Screen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Container = styled.div`
  width: 600px;
  max-width: 600px;
  margin: 0 auto;
`;

const PORT = process.env.NODE_DOCKER_PORT;
const cookies = new Cookies();

export const CalendarDashboard = () => {
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [allEvents, setAllEvents] = useState(events);
  const titleRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get("access_token");

    if (token) {
      const options = {
        method: "GET",
        headers: {
          Authorization: "Bearer: " + token,
        },
      };

      fetch(`http://localhost:${PORT}/event`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 200) {
            const newEvent = data.body.map((event) => {
              return {
                title: event.title,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
              };
            });

            setAllEvents([...allEvents, ...newEvent]);
          } else {
            toast("Something Wrong");
            // something wrong!
          }
        })
        .catch((error) => console.log(error));
    } else {
      navigate("../", { replace: true });
      // go to login page
    }
    return () => {};
  }, []);

  function handleAddEvent(e) {
    const token = cookies.get("access_token");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + token,
      },
      body: JSON.stringify({
        title: newEvent.title,
        startDate: newEvent.start,
        endDate: newEvent.end,
      }),
    };

    console.log(options, newEvent);

    fetch(`http://localhost:${PORT}/event`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          // toast
          toast("Event Created");
          setAllEvents([...allEvents, newEvent]);
        } else {
          toast("Something Wrong!");
          // error
        }
      })
      .catch((error) => console.log(error));

    e.preventDefault();
  }

  return (
    <Screen>
      <ToastContainer />
      <Container className="d-grid gap-2">
        <Card>
          <Card.Header>Calendar App</Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddEvent}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(text) => {
                    setNewEvent({
                      ...newEvent,
                      title: text.target.value,
                    });
                  }}
                  ref={titleRef}
                  placeholder="Enter a title"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  placeholderText="Start Date"
                  style={{ marginRight: "10px" }}
                  selected={newEvent.start}
                  onChange={(start) => setNewEvent({ ...newEvent, start })}
                  ref={startDateRef}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  placeholderText="End Date"
                  selected={newEvent.end}
                  ref={endDateRef}
                  onChange={(end) => setNewEvent({ ...newEvent, end })}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Button
          variant="primary"
          size="lg"
          onClick={(e) => {
            cookies.remove("access_token");
            navigate("../", { replace: true });
          }}
        >
          Logout
        </Button>
      </Container>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
      />
    </Screen>
  );
};
