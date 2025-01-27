import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import backgroundImage from "../assets/images/login-background.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { setAuthInfo } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);
      const token = res.data.token;

      setAuthInfo({ token });
      navigate("/diaries");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <Container
      fluid
      size={1600}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Container>
        <Title
          align="center"
          pb="4rem"
        >
          <Text
            component="span"
            weight={800}
            style={{
              display: "inline-block",
              fontSize: "inherit",
              lineHeight: "inherit",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Welcome back!
          </Text>
        </Title>

        <Paper p="xl" mt="xl" radius="md" style={{ 
          width: "28rem",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
           }}>
          <form onSubmit={onSubmit}>
            <TextInput
              c="white"
              label="Email"
              placeholder="you@example.com"
              required
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              mt="md"
            />
            <PasswordInput
              c="white"
              label="Password"
              placeholder="Your password"
              required
              name="password"
              value={password}
              onChange={onChange}
              mt="md"
            />

            <Button type="submit" fullWidth mt="xl" variant="gradient">
              Sign in
            </Button>
          </form>
          <Text c="white" align="center" mt="lg">
            Do not have an account yet?{" "}
            <Anchor component={Link} to="/signup">
              Create account
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Container>
  );
};

export default Login;
