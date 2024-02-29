import { Close, Delete, Label, Send } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  getMilestonesOfTask,
  createMilestone,
  deleteMilestone,
} from "../../api/tasks";
import AvatarInitials from "../common/AvatarInitials";

const MilestonesModal = ({ handleClose, task }) => {
  const [milestones, setMilestones] = useState([]);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState(""); // * Estado para el mensaje del hito, a la hora de crear o editar.
  const user = JSON.parse(localStorage.getItem("QUERCU_USER_INFO"));

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getMilestonesOfTask(task._id)
      .then((res) => {
        setMilestones(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Error al obtener los hitos", { variant: "error" });
      });
  }, []);

  const formatDate = (toConvert) => {
    // * Get DD/MM/YYYY and HOUR from mongodb's register

    const date = new Date(toConvert);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    let minutes = date.getMinutes();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (minutes < 10) minutes = `0${minutes}`;

    return `${day}/${month}/${year} ${hour}:${minutes}`;
  };

  const handleCreateMilestone = () => {
    createMilestone({
      task: task._id,
      userId: user._id,
      message,
    })
      .then((res) => {
        setCreating(false);
        setMilestones([...milestones, res.data]);
        enqueueSnackbar("Hito creado!", { variant: "success" });
        setMessage("");
      })
      .catch((err) => {
        enqueueSnackbar("Error al crear el hito", { variant: "error" });
      });
  };

  const handleDeleteMilestone = (id) => {
    deleteMilestone(id, user._id)
      .then((res) => {
        setMilestones(milestones.filter((milestone) => milestone._id !== id));
        enqueueSnackbar("Hito eliminado!", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Error al eliminar el hito", { variant: "error" });
      });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Close
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 70,
          right: 40,
          cursor: "pointer",
          fontSize: 40,
          color: "white",
        }}
      />

      <Card sx={{ width: "50%", overflowY: "auto", maxHeight: "80%" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h5"
                component="h5"
                sx={{ textAlign: "left", mb: 1 }}
              >
                {task.activity}
              </Typography>

              <Typography
                variant="p"
                component={"p"}
                sx={{ textAlign: "left", mb: 2 }}
              >
                <b style={{ fontWeight: "bold" }}>Fecha de entrega: </b>{" "}
                {formatDate(task.date)}
              </Typography>

              <Typography
                variant="p"
                component={"p"}
                sx={{ textAlign: "left" }}
              >
                {task.description}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {task.finished ? null : (
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    multiline
                    rows={4}
                    label={"Escribe un nuevo hito"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Send
                    sx={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => handleCreateMilestone()}
                  />
                </FormControl>
              )}
            </Grid>

            {milestones.map((milestone) => (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  position: "relative",
                }}
                mt={2}
              >
                <AvatarInitials profile={milestone.user} />

                {milestone.user._id === user._id && (
                  <Delete
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: 40,
                      cursor: "pointer",
                    }}
                    color="error"
                    onClick={() => handleDeleteMilestone(milestone._id)}
                  />
                )}

                <Typography
                  sx={{ position: "absolute", right: 10, top: 10 }}
                  variant="body1"
                  component="div"
                >
                  {formatDate(milestone.createdAt)}
                </Typography>

                <Typography
                  sx={{ mt: 2, ml: 5 }}
                  variant="body1"
                  component="div"
                >
                  {milestone.message}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilestonesModal;
