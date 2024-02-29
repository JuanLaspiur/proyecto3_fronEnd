import { Avatar, Button, Card, CardActionArea, CardContent, Grid, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from 'react';
import { disableTask, finishTask, getAllTasks, reviewTask, updateTask } from "../../api/tasks";
import { useContext } from 'react';
import TaskActions from './TaskActions';
import CheckIcon from '@mui/icons-material/Check';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import { East, Edit, FindInPage, GroupAdd, QuestionAnswer, West } from "@mui/icons-material";
import EditTaskModal from "./EditTaskModal";
import TasksContext from "./Tasks.provider";
import EditInfoTaskModal from "./EditInfoTaskModal";

const TasksContainer = () => {
  const [open, setOpen] = useState(false)
  const [selectTask, setSelectTask] = useState({})
  const [taskToEdit, setTaskToEdit] = useState(false) // * Tarea seleccionada para editar participantes
  const [editInfoTask, setEditInfoTask] = useState(false) // * Tarea seleccionada para editar información de la misma
  let { tasks, setTasks, filterTasksWithEmployeeAsigned, getTasks, isCompany, setMilestonesModal } = useContext(TasksContext);

  const handleClose = () => {
    setOpen(false)
    setSelectTask({})
  }

  const { enqueueSnackbar } = useSnackbar();

  const handleFinish = async (task) => {
    const res = await finishTask(task._id)
    if (res.status) {
      enqueueSnackbar(res.message, { variant: "success" });
      getTasks();
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  }

  const handleReview = async (task) => {
    const res = await reviewTask(task._id)
    if (res.status) {
      enqueueSnackbar(res.message, { variant: "success" });
      getTasks();
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  }

  const handleDelete = async (task) => {
    const res = await disableTask(task._id)
    if (res.status) {
      enqueueSnackbar(res.message, { variant: "success" });
      getTasks()
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  }

  const handleStopper = (task) => {

    updateTask(task._id, { stopper: false, employee: null  })
      .then((res) => {
        if (res.status) {
          enqueueSnackbar(res.message, { variant: "success" });
          getTasks()
        } else {
          enqueueSnackbar(res.message, { variant: "error" });
        }
      })
  }

  return (
    <>
      <TaskActions open={open} handleClose={handleClose} task={selectTask} />

      {taskToEdit && <EditTaskModal handleClose={() => setTaskToEdit(false)} task={taskToEdit} />}
      {editInfoTask && <EditInfoTaskModal handleClose={() => setEditInfoTask(false)} task={editInfoTask} />}

      {tasks.map((item) => (
        <div key={item.date}>
          {item.tasks.length > 0 && (
            <Typography sx={{ mt: 2 }}>
              {item.date}
            </Typography>
          )}

          {item.tasks.map((task, index) => {
            return (
              <Card sx={{ my: 1, background: task.review ? 'yellow' : 'white' }} key={index}>
                <CardContent>
                  <Typography gutterBottom variant="body2" component="div">
                    {task.activity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Grid container columnSpacing={4}>
                    <Grid item xs={4} md={2} mt={2}>
                      <Tooltip placement="top" title="Completar">
                        <Button onClick={() => handleFinish(task)} variant="contained" color="success" sx={{ px: 1, minWidth: 0 }}>
                          <CheckIcon />
                        </Button>
                      </Tooltip>
                    </Grid>

                    <Grid item xs={4} md={2} mt={2}>
                      <Tooltip placement="top" title={task.review ? "Volver a tarea en proceso" : "Mandar a revisión"}>
                        <Button onClick={() => handleReview(task)} variant="contained" color="info" sx={{ px: 1, minWidth: 0 }}>
                          <FindInPage />
                        </Button>
                      </Tooltip>
                    </Grid>

                    {isCompany && (
                      <Grid item xs={4} md={2} mt={2}>
                        <Tooltip placement="top" title="Agregar integrante">
                          <Button onClick={() => setTaskToEdit(task)} variant="contained" sx={{ px: 1, minWidth: 0 }}>
                            <GroupAdd />
                          </Button>
                        </Tooltip>
                      </Grid>
                    )}

                    <Grid item xs={4} md={2} mt={2}>
                      <Tooltip placement="top" title="Ver hitos">
                        <Button onClick={() => setMilestonesModal(task)} variant="contained" sx={{ px: 1, minWidth: 0, bgcolor: "black" }}>
                          <QuestionAnswer />
                        </Button>
                      </Tooltip>
                    </Grid>


                    <Grid item xs={4} md={2} mt={2}>
                      <Tooltip placement="top" title="Editar">
                        <Button onClick={() => setEditInfoTask(task)} variant="contained" color="success" sx={{ px: 1, minWidth: 0 }}>
                          <Edit />
                        </Button>
                      </Tooltip>
                    </Grid>

                    <Grid item xs={4} md={4} mt={2}>
                      <Tooltip placement="top" title="Eliminar">
                        <Button onClick={() => handleDelete(task)} variant="contained" color="error" sx={{ px: 1, minWidth: 0 }}>
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </Grid>

                    {!isCompany && (
                      <Grid item xs={4} md={2} mt={2}>
                        <Tooltip placement="top" title="Devolver a empresa">
                          <Button onClick={() => handleStopper(task)} variant="contained" color="info" sx={{ px: 1, minWidth: 0 }}>
                            <West />
                          </Button>
                        </Tooltip>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>)
          })}
        </div>
      ))}
    </>
  );
};
export default TasksContainer;
