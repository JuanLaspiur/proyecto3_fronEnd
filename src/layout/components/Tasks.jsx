import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useState, useEffect, useContext } from "react";
import TasksContext from "../../components/tasks/Tasks.provider";
import TasksContainer from './../../components/tasks/TasksContainer';
import { useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MilestonesModal from "../../components/tasks/MilestonesModal";
import { Add, Close, Task } from "@mui/icons-material";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";

const Tasks = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('QUERCU_USER_INFO')));
  const [activeInResponsive, setActiveInResponsive] = useState(false);
  const [creating, setCreating] = useState(false);
  const [asideActiveInPC, setAsideActiveInPC] = useState(false) // * Para mostrar el aside completo en PC
  const location = useLocation();
  let { getTasks, isCompany, milestonesModal, setMilestonesModal, responsive } = useContext(TasksContext)

  if (user) isCompany = user.role.includes(1)

  useEffect(() => {
    getTasks();
  }, [location])

  if (!responsive) return (
    <>
      {creating && <CreateTaskModal handleClose={() => setCreating(false)} />}
      {/* // ! el modal se pone afuera del aside porque el position fixed no funciona bien con el position absolute */}

      <Grid container className="drawer" sx={{
        color: "white",
        position: 'fixed',
        p: 2,
        width: asideActiveInPC ? '20vw' : '4vw',
        right: 0,
        transition: 'all 0.5s ease-in-out',
      }} 
      onMouseEnter={() => setAsideActiveInPC(true)}
      onMouseLeave={() => setAsideActiveInPC(false)}
      >
        {asideActiveInPC && <>
          {milestonesModal && <MilestonesModal task={milestonesModal} handleClose={() => setMilestonesModal(false)} />}

          <Grid item xs={12}>
            <Button onClick={() => setCreating(!creating)} fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
              Crear tarea
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TasksContainer />
          </Grid>
        </>}

        {!asideActiveInPC && <>
          {creating && <CreateTaskModal handleClose={() => setCreating(false)} />}

          <Grid item xs={12} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '5%',
          }}>
            <Add sx={{ cursor: 'pointer' }} onClick={() => setCreating(!creating)} />
          </Grid>

          <Grid item xs={12} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80%',
            flexDirection: 'column',
          }}>
            <Typography sx={{ cursor: 'pointer', transform: 'rotate(-90deg)' }} onClick={() => setAsideActiveInPC(!asideActiveInPC)}>
              Tareas
            </Typography>
            <ExpandMoreIcon sx={{ cursor: 'pointer', transform: 'rotate(90deg)', mt: 3 }} onClick={() => setAsideActiveInPC(!asideActiveInPC)} />
          </Grid>
        </>}
      </Grid>
    </>
  );

  return (
    <>
      {!activeInResponsive && <Button onClick={() => setActiveInResponsive(true)} variant="contained" color="primary" sx={{
        position: 'fixed', top: 80, right: 10, zIndex: 99, animation: 'all 1s ease-in', borderRadius: '50%',
        width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 3
      }}>
        <Task />
      </Button>}

      {activeInResponsive && <Grid container className="drawer" sx={{
        color: "white", p: 2, position: 'fixed', top: 0, left: activeInResponsive ? 0 : '-100vw',
        width: '100vw', height: '100vh', zIndex: 99999999999999999999, animation: 'all 1s ease-in'
      }}>

        {creating && <CreateTaskModal handleClose={() => setCreating(false)} />}

        {milestonesModal && <MilestonesModal task={milestonesModal} handleClose={() => setMilestonesModal(false)} />}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
          <Close onClick={() => setActiveInResponsive(false)} sx={{ position: 'relative', mb: 2, color: 'white', cursor: 'pointer' }} />
        </Grid>

        <Grid item xs={12}>
          <Button onClick={() => setCreating(!creating)} fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
            Crear tarea
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TasksContainer />
        </Grid>
      </Grid>}
    </>
  );

};

export default Tasks;
