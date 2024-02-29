import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import routes from "./routes";

const EmployeeRoute = ({ ...rest }) => {
  const data = localStorage.getItem("QUERCU_USER_INFO");
  const user = JSON.parse(data);
  const location = useLocation();
  if (user.role[0] !== 2)
    return <Navigate replace to={routes.home} state={{ from: location }} />;
  return <Outlet {...rest} />;
};

export default EmployeeRoute;