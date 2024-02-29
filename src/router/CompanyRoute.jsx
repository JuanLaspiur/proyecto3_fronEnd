import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import routes from "./routes";

const CompanyRoute = ({ ...rest }) => {
  const data = localStorage.getItem("QUERCU_USER_INFO");
  const user = JSON.parse(data);
  
  if(!user) return <Outlet {...rest} />;

  const location = useLocation();
  if (user.role[0] !== 1 && user.role[0] !== 0)
    return <Navigate replace to={routes.lifeSheet} state={{ from: location }} />;
  return <Outlet {...rest} />;
};

export default CompanyRoute;
