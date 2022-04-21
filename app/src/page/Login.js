import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import styled from "styled-components";
import Cookies from "universal-cookie";

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


export const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = cookies.get("access_token");

      if (token) {
        // go to new route
      }
    } catch (error) {
      console.log(error);
    }

    return () => {};
  }, [0]);

  const onSubmit = (e) => {
    const emailData = emailRef.current.value;
    const password = passwordRef.current.value;

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailData, password: password }),
    };

    fetch(`http://localhost:${PORT}/signin`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          cookies.set("access_token", data.access_token, { path: "/" });
          navigate("./dashboard", { replace: true });
        }
      })
      .catch((error) => console.log(error));

    e.preventDefault();
  };

  return (
    <Screen>
      <Container>
        <Card>
          <Card.Header>Calendar App</Card.Header>
          <Card.Body>
            <Form onSubmit={onSubmit}>
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
                <Link to="/signup">I dont have any account. Register</Link>
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
