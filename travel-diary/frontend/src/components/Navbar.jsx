import React, { useContext } from "react";
import { Group, Button, Box } from "@mantine/core";
import MantineLogo from "./MantineLogo";
import { Link } from "react-router-dom";
import classes from "../styles/Navbar.module.css";
import { AuthContext } from "../context/AuthContext";

export function Navbar() {
  const { authState, logout } = useContext(AuthContext);

  const handleLogout = (e) => {
    logout();
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to="/" className={classes.link}>
            <MantineLogo size="xl" />
          </Link>

          <Group h="100%">
            {authState.isAuthenticated ? (
              <>
                <Link to="/dashboard" className={classes.link}>
                  Dashboard
                </Link>
                <Link to="/diaries" className={classes.link}>
                  Diaries
                </Link>
                <Link to="/trips" className={classes.link}>
                  Trips
                </Link>
                <Link to="/map" className={classes.link}>
                  Map View
                </Link>
                <Link to="/events" className={classes.link}>
                  Events
                </Link>
                <Link to="/weather" className={classes.link}>
                  Weather
                </Link>
              </>
            ) : null}
          </Group>

          <Group>
            {authState.isAuthenticated ? (
              <Button
                variant="default"
                component={Link}
                to="/"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button variant="default" component={Link} to="/login">
                  Log in
                </Button>
                <Button component={Link} to="/signup">
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </Group>
      </header>
    </Box>
  );
}

export default Navbar;
