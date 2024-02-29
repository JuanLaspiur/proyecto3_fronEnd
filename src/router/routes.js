const routes = {
  login: "",
  register: "/register",
  recovery: "/password_recovery",
  linkDiscord: "/enlazar_discord",

  //Módulo Root
  root: "/root",
  companies_list: "/companies_list",

  //Módulo Empresa
  home: "/",
  myCompany: "/empresa/perfil",
  company_configuration: "/empresa/:id/configuracion",
  enterpriseLifeSheet: "/empresa/hoja_de_vida",
  newDashboard: "/empresa/nuevo_dashboard",

  //Módulo Clientes
  new_prospect: "/clientes/nuevo_prospecto",
  prospects_list: "/clientes/prospectos",
  prospect: "/clientes/prospectos/:id",

  //Módulo Ventas
  planifications_list: "/ventas/planifications",
  new_planification: "/ventas/new_planification",
  planification: "/ventas/planifications/:id",
  proposals: "/ventas/propuestas",
  new_proposal: "/ventas/nueva_propuesta",
  proposal: "/ventas/propuesta/:id",
  contracts: "/ventas/contratos",
  contract: "/ventas/contratos/:id",

  //Módulo Contabilidad
  debts: "/contabilidad/deudas",

  //Modulo de Tareas
  tasks: "/tareas",
  tasks_finished: "/tareas/finalizadas",

  //Módulo Usuarios
  employeesList: "/empleado",
  employee: "/empleado/:id",
  newEmployee: "/empleado/invitar",
  userRegister: "/empleado/registrar",
  employeeLifeSheet: "/empleado/:id/hoja_de_vida",
  employeeTasks: "/empleado/tareas",

  //Módulo de Proyectos
  projects: "/proyectos",
  project: "/proyectos/:id",
  newProject: "/proyectos/nuevo_proyecto",
  editProject: "/proyectos/editar_proyecto/:id",

  // Rutas empleados
  lifeSheet: "/employee/hoja_de_vida",
};

export default routes;
