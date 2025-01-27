import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);

const theme = createTheme({});

root.render(
  <MantineProvider theme={theme}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </MantineProvider>
);
