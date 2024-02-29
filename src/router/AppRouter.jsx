import React from "react";
import { Routes, Route } from "react-router";
import routes from "./routes";
import Login from "../pages/Login";
import Layout from "../layout/Layout";
import RootRoute from "./RootRoute";
/* ------ Root ------ */
import Root from "../pages/root/Root";
import CompaniesList from "../pages/root/CompaniesList";
/* ------ Compañia ------ */
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanyConfiguration from "../pages/company/CompanyConfiguration";
/* ------ Prospectos ------ */
import NewProspect from "../pages/prospects/NewProspect";
import ProspectsList from "../pages/prospects/ProspectsList";
/* ------ Planificaciones ------ */
import NewPlanification from "../pages/planifications/NewPlanification";
import PlanificationsList from "../pages/planifications/PlanificationsList";
/* ------ Propuestas ------ */
import ProposalsList from "../pages/proposals/ProposalsList";
import NewProposal from "../pages/proposals/NewProposal";
import Proposal from "../pages/proposals/Proposal";
/* ------ Contratos ------ */
import Contracts from "../pages/contracts/Contracts";
/* ------ RRHH ------ */
import EmployeesList from "../pages/rrhh/EmployeesList";
import NewEmployee from "../pages/rrhh/NewEmployee";
import Debts from "../pages/debts/Debts";
import TasksFinished from './../pages/tasks/TasksFinished';
import UserRegister from "../pages/UserRegister";
import LifeSheet from "../pages/employee/LifeSheet";
import CompanyRoute from "./CompanyRoute";
import EmployeeRoute from "./EmployeeRoute";
import EmployeeEdit from "../pages/rrhh/EmployeeEdit";
import TasksInProcess from "../pages/tasks/TasksInProcess";
import Contract from "../pages/contracts/Contract";
import Dashboard from "../pages/company/Dashboard";
import Projects from "../pages/projects/Projects";
import NewProject from "../pages/projects/NewProject";
import EditProject from "../pages/projects/EditProject";
import Project from "../pages/projects/Project";
import Planification from "../pages/planifications/Planification";
import Prospect from "../pages/prospects/Prospect";
import DiscordLink from "../pages/DiscordLink";

const AppRouter = () => {
  return (
    <Routes>
      {/*---------- Rutas sin logueo ----------*/}
      <Route exact path={routes.login} element={<Login />} />
      <Route exact path={routes.userRegister} element={<UserRegister />} />
      {/* ---------------------------------------- */}
      {/*---------- Rutas con logueo ----------*/}
      <Route element={<Layout />}>
        {/*---------- Rutas Root ----------*/}
        <Route element={<RootRoute />}>
          <Route exact path={routes.root} element={<Root />} />
          <Route
            exact
            path={routes.companies_list}
            element={<CompaniesList />}
          />
        </Route>
        {/* ---------------------------------------- */}
        {/*---------- Rutas Empresas ----------*/}
        <Route element={<CompanyRoute />}>
          {/*---------- Módulo Empresas ----------*/}
          <Route exact path={routes.home} element={<Dashboard />} />
          <Route exact path={routes.myCompany} element={<CompanyProfile />} />
          <Route exact path={routes.company_configuration} element={<CompanyConfiguration />}/>
          {/*---------- Módulo Usuarios ----------*/}
          <Route exact path={routes.employee} element={<EmployeeEdit />} />
          <Route exact path={routes.employeeLifeSheet} element={<LifeSheet adminView />} />
          <Route exact path={routes.employeesList} element={<EmployeesList />} />
          <Route exact path={routes.newEmployee} element={<NewEmployee />} />
          {/*---------- Módulo Clientes ----------*/}
          <Route exact path={routes.new_prospect} element={<NewProspect />} />
          <Route exact path={routes.prospects_list} element={<ProspectsList />} />
          <Route exact path={routes.prospect} element={<Prospect />} />
          {/*---------- Módulo Ventas ----------*/}
          <Route exact path={routes.planifications_list} element={<PlanificationsList />} />
          <Route exact path={routes.new_planification} element={<NewPlanification />} />
          <Route exact path={routes.planification} element={<Planification />} />
          <Route exact path={routes.proposals} element={<ProposalsList />} />
          <Route exact path={routes.new_proposal} element={<NewProposal />} />
          <Route exact path={routes.proposal} element={<Proposal />} />
          <Route exact path={routes.contracts} element={<Contracts />} />
          <Route exact path={routes.contract} element={<Contract />} />

          {/*---------- Módulo Contabilidad ----------*/}
          <Route exact path={routes.employeesList} element={<EmployeesList />} />
          <Route exact path={routes.newEmployee} element={<NewEmployee />} />
          <Route exact path={routes.employee} element={<EmployeeEdit />} />
          <Route exact path={routes.enterpriseLifeSheet} element={<LifeSheet />} />
          <Route exact path={routes.employeeLifeSheet} element={<LifeSheet adminView />} />
          <Route exact path={routes.tasks} element={<TasksInProcess />} />
          <Route exact path={routes.debts} element={<Debts />} />

          {/*---------- Módulo Tareas ----------*/}
          <Route exact path={routes.tasks} element={<TasksInProcess />} />

          {/*---------- Módulo Proyectos ----------*/}
          <Route exact path={routes.projects} element={<Projects />} />
          <Route exact path={routes.newProject} element={<NewProject />} />
          <Route exact path={routes.project} element={<Project />} />
          <Route exact path={routes.editProject} element={<EditProject />} />
        </Route>
        {/* ---------------------------------------- */}

        {/*---------- Rutas usuario empleado ----------*/}
        <Route element={<EmployeeRoute />}>
          <Route exact path={routes.lifeSheet} element={<LifeSheet />} />
          <Route exact path={routes.employeeTasks} element={<TasksInProcess employee />} />
        </Route>
        {/* ---------------------------------------- */}

        {/* ---------------Modulo de Tareas------------------ */}
        <Route exact path={routes.tasks_finished} element={<TasksFinished />} />
          <Route exact path={routes.linkDiscord} element={<DiscordLink />} />
      </Route>
      {/* ---------------------------------------- */}
    </Routes>
  );
};

export default AppRouter;
