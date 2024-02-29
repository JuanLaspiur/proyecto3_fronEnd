import { Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccordionMenu from "../../components/common/AccordionMenu";
import UserCard from "../../components/common/UserCard";
import routes from "../../router/routes";
import { ArrowLeft, Close, ForkLeft, List, SwipeLeft, West } from "@mui/icons-material";

const Drawer = ({ responsive, asideActive, setAsideActive }) => {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [nav, setNav] = useState([]);
  const data = localStorage.getItem("QUERCU_USER_INFO");

  useEffect(() => {
    const info = JSON.parse(data);

    if (!info) {
      navigate(routes.login);
    } else {
      setUser(info);
      setId(info._id);
      if (info.role[0] === 0) {
        setNav([
          {
            id: 1,
            name: "Root",
            options: [
              { name: "Nueva empresa", id: 11, link: routes.root },
              {
                name: "Listado de empresas",
                id: 12,
                link: routes.companies_list,
              },
            ],
          },
        ]);
      } else if (info.role[0] === 1) {
        setNav([
          {
            id: 2,
            name: "Módulo Empresa",
            options: [
              { name: "Dashboard", id: 21, link: routes.home },
              {
                name: "Configuración de empresa",
                id: 22,
                link: id ? `/empresa/${id}/configuracion` : null,
              },
              {
                name: "Hoja de vida",
                id: 22.1,
                link: routes.enterpriseLifeSheet
              },
              {
                name: "Enlazar a Discord",
                id: 22.2,
                link: routes.linkDiscord
              }
            ],
          },
          {
            id: 3,
            name: "Módulo Usuarios",
            options: [
              { name: "Usuarios", id: 31, link: routes.employeesList },
              { name: "Hoja de vida", id: 33, link: routes.home },
            ],
          },
          {
            id: 4,
            name: "Módulo Clientes",
            options: [
              { name: "Prospectos", id: 41, link: routes.prospects_list },
              { name: "Clientes", id: 42, link: routes.prospects_list },
            ],
          },
          {
            id: 5,
            name: "Módulo Ventas",
            options: [
              {
                name: "Planificaciones",
                id: 51,
                link: routes.planifications_list,
              },
              { name: "Propuestas de trabajo", id: 52, link: routes.proposals },
              { name: "Contratos", id: 53, link: routes.contracts },
            ],
          },

          {
            id: 6,
            name: "Módulo Contabilidad",
            options: [{ name: "Deudas", id: 62, link: routes.debts }],
          },
          {
            id: 7,
            name: "Módulo de Tareas",
            options: [
              { name: "Tareas", id: 70, link: routes.tasks },
              { name: "Tareas Finalizadas", id: 71, link: routes.tasks_finished }
            ],
          },
          {
            id: 8,
            name: "Módulo de Proyectos",
            options: [
              { name: "Proyectos", id: 80, link: routes.projects },
              // { name: "Crear Proyecto", id: 81, link: routes.newProject },
            ]
          },
        ]);
      } else if (info.role[0] === 2) {
        setNav([
          {
            id: 10,
            name: 'Usuario',
            options: [
              { name: 'Hoja de vida', id: 101, link: routes.lifeSheet },
              {
                name: "Enlazar a Discord",
                id: 100,
                link: routes.linkDiscord
              }
            ],
          },
          {
            id: 7,
            name: "Módulo de Tareas",
            options: [
              { name: "Tareas", id: 70, link: routes.employeeTasks },
              { name: "Tareas Finalizadas", id: 71, link: routes.tasks_finished }
            ],
          },
        ]);
      }
    }
  }, [data, id]);

  return (
    <Grid container className="drawer" sx={{
      position: 'fixed', width: responsive ? '100vw' : '20vw', height: '100vh', zIndex: 1100, opacity: 1, top: 0,
      left: asideActive ? 0 : '-100vw', backgroundColor: 'primary.main',
      transition: 'all 0.5s ease-in-out',
    }}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
        <West onClick={() => setAsideActive(false)} sx={{
          position: 'relative', m: 2, color: 'white', cursor: 'pointer',
          transform: asideActive ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'all 0.5s ease-in-out',
        }} />
      </Grid>

      <Grid item xs={12} sx={{ margin: 1 }}>
        <UserCard profile={user} />
      </Grid>
      <Grid item xs={12}>
        {nav && nav[0] && <AccordionMenu data={nav} setAsideActive={setAsideActive} />}
      </Grid>
    </Grid>
  );
};

export default Drawer;
