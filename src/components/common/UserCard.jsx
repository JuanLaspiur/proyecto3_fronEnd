import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardActionArea, Card, CardContent } from "@mui/material";
import AvatarInitials from "./AvatarInitials";
import routes from "../../router/routes";

const UserCard = ({ profile }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuario");
  const handleUsername = () => {
    let user = "";
    profile && profile.name ? (user = profile.name) : (user = "Usuario");
    setUsername(user);
  };
  const handleCardClick = () => {
    navigate(routes.myCompany);
  };
  useEffect(() => {
    handleUsername();
  }, [profile]);

  return (
    <Card sx={{ backgroundColor: "primary.secondary" }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <AvatarInitials profile={profile} />
          <div>
            <h5
              style={{ marginBottom: "5px", marginTop: "5px", color: "white" }}
            >
              {username}
            </h5>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UserCard;
