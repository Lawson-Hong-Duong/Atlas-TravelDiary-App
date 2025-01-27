import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import {
  TextInput,
  FileInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import backgroundImage from "../assets/images/signup-background.jpg";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const navigate = useNavigate();

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onAvatarChange = (e) => {
    setFormData({ ...formData, avatar: e });
  };

  const { setAuthInfo } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (formData.avatar) {
      form.append("avatar", formData.avatar);
    }

    try {
      const res = await api.post("/auth/register", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const token = res.data.token;
      setAuthInfo({ token });
      navigate("/dashboard");
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
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      }}
    >
      <Container>
        <Title
          align="center"
          style={{ color: "white", textShadow: "2px 2px 4px black" }}
        >
          Welcome to Atlas Journeys!
        </Title>
        <Paper p="xl" mt="xl" radius="md" style={{ 
          width: "28rem",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
           }}>
          <form onSubmit={onSubmit}>
            <FileInput
              label="Profile Picture (Optional)"
              name="avatar"
              placeholder="Upload a profile picture"
              onChange={onAvatarChange}
              accept="image/*"
            />
            <TextInput
              label="Username"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={onChange}
              required
              mt="md"
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              required
              mt="md"
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="Your password"
              value={formData.password}
              onChange={onChange}
              required
              mt="md"
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={onChange}
              required
              mt="md"
            />

            <Button type="submit" fullWidth mt="xl" variant="gradient">
              Create Account
            </Button>
          </form>
          <Text c="white" align="center" mt="lg">
            Already a member?{" "}
            <Anchor component={Link} to="/login">
              Log in
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Container>
  );
};

export default Signup;
