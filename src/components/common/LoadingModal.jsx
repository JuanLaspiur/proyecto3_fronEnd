import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import React from "react";


const LoadingModal = ({ msg }) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{width:350, height: 300, display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CardContent sx={{textAlign:"center"}}>
          <Typography variant="h5">{msg ? msg : "Cargando..."}</Typography>
          <CircularProgress color="success" sx={{mt: 3}} size={80}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingModal;