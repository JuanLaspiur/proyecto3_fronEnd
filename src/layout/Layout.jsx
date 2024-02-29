import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Drawer from "./components/Drawer";
import NavBar from "./components/NavBar";
import Tasks from "./components/Tasks";
import { TasksProvider } from '../components/tasks/Tasks.provider';

const Layout = () => {
  const [windowsWidth, setWindowsWidth] = useState(window.innerWidth);
  const [responsive, setResponsive] = useState(false);
  const [asideActive, setAsideActive] = useState(localStorage.getItem('QUERCU_ASIDE_ACTIVE') ? true : false);

  useEffect(() => {
    const handleResize = () => {
      setWindowsWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowsWidth < 960) {
      setResponsive(true);
    } else {
      setResponsive(false);
    }
  }, [windowsWidth]);

  useEffect(() => {
    if(asideActive) {
      localStorage.setItem('QUERCU_ASIDE_ACTIVE', true);
    } else {
      localStorage.removeItem('QUERCU_ASIDE_ACTIVE');
    }
  }, [asideActive])

  return (
    <Grid container>
      <Grid item xs={12} sx={{ minHeight: "8vh" }}>
        <NavBar responsive={true} setAsideActive={setAsideActive} />
      </Grid>

      <Grid item xs={12} sx={{ height: 0 }}>
        <Drawer responsive={responsive} asideActive={asideActive} setAsideActive={setAsideActive} />
      </Grid>

      <Grid item xs={11.3} sx={{ mt: 2, px: 2, pl: asideActive ? '21vw' : 2, transition: 'all 0.5s ease-in-out'   }}>
        <Outlet />
      </Grid>

      <Grid item xs={0} sx={{
        minHeight: !responsive ? '92vh' : '0'
      }}>
        <TasksProvider>
          <Tasks />
        </TasksProvider>
      </Grid>
    </Grid>
  );
};

export default Layout;
