import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";

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

const cookies = new Cookies();
const PORT = process.env.NODE_DOCKER_PORT;

export const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    const emailData = emailRef.current.value;
    const passwordData = passwordRef.current.value;
    const nameData = nameRef.current.value;

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailData,
        password: passwordData,
        name: nameData,
      }),
    };

    fetch(`http://localhost:${PORT}/event`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          cookies.set("access_token", data.access_token, { path: "/" });
          navigate("../dashboard", { replace: true });
          // setSigned(true);
        } else {
          toast("Something Wrong!");
          // give error
        }
      })
      .catch((error) => console.log(error));

    e.preventDefault();
  };

  return (
    <Screen>
      <Container>
        <Card>
          <Card.Header>Calendar App - SIGNUP</Card.Header>
          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name Surname</Form.Label>
                <Form.Control
                  type="text"
                  ref={nameRef}
                  placeholder="Name Surname"
                />
                <Form.Text className="text-muted">
                  How can we call you?
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Password"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Link to="/">I have an account. Sign In</Link>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Screen>
  );
};
