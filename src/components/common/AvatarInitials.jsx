import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";

const AvatarInitials = ({ profile }) => {
  const [usernameInitials, setUsernameInitials] = useState("U");
  const getInitials = (name = "") =>
    name
      .replace(/\s+/, " ")
      .split(" ")
      .slice(0, 2)
      .map((v) => v && v[0].toUpperCase())
      .join("");

  const handleUsernameInitials = () => {
    let user = "";
    profile && profile.name ? (user = profile.name) : (user = "Usuario");
    let initials = getInitials(user);
    setUsernameInitials(initials);
  };

  useEffect(() => {
    handleUsernameInitials();
  }, [profile]);
  return (
    <Avatar
      sx={{
        width: 60,
        height: 60,
        marginRight: 2,
        bgcolor: "#952430",
      }}
    >
      {usernameInitials}
    </Avatar>
  );
};

export default AvatarInitials;
