import React from "react";
import { HashRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./styles/main.scss";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <SnackbarProvider
          maxSnack={1}
          autoHideDuration={2000}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <AppRouter />
        </SnackbarProvider>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
