import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { disableTask, finishTask } from "../../api/tasks";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const TaskActions = ({open, handleClose, task})=>{
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const handleDelete = async()=>{
    const res = await disableTask(task._id)
    if(res.status){
      enqueueSnackbar(res.message, { variant: "success" });
      navigate(0)
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  }
  const handleFinish = async()=>{
    console.log('paseeeeee finish')
    const res = await finishTask(task._id)
    if(res.status){
      enqueueSnackbar(res.message, { variant: "success" });
      navigate(0)
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  }
  return(
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{task.activity}</DialogTitle>
      <List sx={{ px: 2 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={handleFinish}>
              <ListItemAvatar>
                <Avatar sx={{backgroundColor: 'green'}}>
                  <CheckIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Completar' />
            </ListItemButton>
          </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={handleDelete}
          >
            <ListItemAvatar>
              <Avatar sx={{backgroundColor: 'red'}}>
                <DeleteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Eliminar" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  )
}
export default TaskActions