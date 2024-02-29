import axios from "axios";
const API_URL= "https://proyecto3-back.onrender.com/api"; //mal importada

const backendApi = axios.create({
  baseURL: API_URL,
});

backendApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  return config;
});

// ---------- EMPLOYEES ----------

const inviteNewEmployee = async (payload) => {
  try {
    console.log(payload);
    const { data } = await backendApi.post("user/employee/invite", {
      form: payload,
    });

    console.log(payload);
    console.log(data);

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getWorkingsDays = async (form) => {
  try {
    const { data } = await backendApi.get(
      `/working_day/?month=${form.month}&year=${form.year}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const createWorkingDayMark = async (payload) => {
  try {
    const { data } = await backendApi.post("/working_day/mark", {
      mark: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
}; // * Mark = Marcar un inicio o final de jornada.

const getEmployeeIdWorkingsDays = async (id, form) => {
  try {
    const { data } = await backendApi.get(
      `/working_day/by-employee/${id}?month=${form.month}&year=${form.year}`
    );

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getADayOfEmployee = async (idUser, form) => {
  try {
    const { data } = await backendApi.get(
      `/working_day/getADayOfEmployee/${idUser}/${form.day}/${form.month}/${form.year}`
    );

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- USERS ----------
const startLogin = async ({ email, password }) => {
  try {
    const { data } = await backendApi.post("/user/login", { email, password });
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    const res = err.response.data;
    return res;
  }
};
const createNewUser = async (payload) => {
  try {
    const { data } = await backendApi.post("/user/register", { data: payload });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getUserInfo = async () => {
  try {
    const { data } = await backendApi.get("/user/info");
    localStorage.setItem("QUERCU_USER_INFO", JSON.stringify(data.user));
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const setNewPassword = async (email, password) => {
  try {
    const { data } = await backendApi.put(`/user/password_recovery/${email}`, {
      newPassword: password,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const linkDiscordAccount = async (discordId) => {
  try {
    const user = JSON.parse(localStorage.getItem("QUERCU_USER_INFO"));
    const id = user._id;

    const { data } = await backendApi.post(`/user/${id}/linkDiscordAccount`, {
      discordId,
    });

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- COMPANIES ----------
const getAllCompanies = async () => {
  try {
    const { data } = await backendApi.get("/root/getAllCompanies");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- AREAS ----------
const createNewArea = async (payload) => {
  try {
    const { data } = await backendApi.post("/companyConfig/createArea", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getAllAreas = async () => {
  try {
    const { data } = await backendApi.get("/companyConfig/getAllAreas");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const deleteArea = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/companyConfig/deactivateArea/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- DEPARTAMENTS ----------
const createNewDepartment = async (payload) => {
  try {
    const { data } = await backendApi.post("/companyConfig/createDepartament", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error;
    return res;
  }
};
const getAllDepartaments = async () => {
  try {
    const { data } = await backendApi.get("/companyConfig/getAllDepartaments");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getDepartamentbyAreaId = async (payload) => {
  try {
    const { data } = await backendApi.post(
      "/companyConfig/getDepartamentsFilter",
      payload
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const findDepartamentsByArea = async (id) => {
  try {
    const { data } = await backendApi.get(
      `/companyConfig/findDepartamentsByArea/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const deleteDepartament = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/companyConfig/deactivateDepartament/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- POSITIONS ----------
const createNewPosition = async (payload) => {
  try {
    const { data } = await backendApi.post("/companyConfig/createPosition", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getAllPositions = async () => {
  try {
    const { data } = await backendApi.get("/companyConfig/getAllPositions");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const deletePosition = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/companyConfig/deactivatePosition/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getPositionsByDepartamentId = async (payload) => {
  try {
    const { data } = await backendApi.get(
      `/companyConfig/findPositionByDepartament/${payload}`
    );

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- PROSPECTS ----------
const createNewProspect = async (payload) => {
  try {
    const { data } = await backendApi.post("/prospect/createProspect", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getAllProspects = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/prospect/getAll`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getProspect = async (id) => {
  try {
    const { data } = await backendApi.get(`/prospect/findById/${id}`);

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getAllClients = async () => {
  try {
    const { data } = await backendApi.get(`/prospect/clients`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getProspectsByPages = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/prospect/getAllByPages/${page}`, {
      params: { keyword: keyword },
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const editProspect = async (id, payload) => {
  try {
    const { data } = await backendApi.patch(
      `/prospect/editProspect/${id}`,
      payload
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const deleteProspect = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/prospect/deactivateProspect/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getProspectsById = async (id) => {
  try {
    const { data } = await backendApi.get(`/prospect/findById/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
// ---------- PLANIFICATIONS ----------
const getAllPlanifications = async () => {
  try {
    const { data } = await backendApi.get("/planning/getAll");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getPlanification = async (id) => {
  try {
    const { data } = await backendApi.get(`/planning/findById/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getPlanificationsByPages = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/planning/getAllByPages/${page}`, {
      params: { keyword: keyword },
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const createNewPlanning = async (payload) => {
  try {
    const { data } = await backendApi.post("/planning/createPlanning", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const updatePlanification = async (id, payload) => {
  try {
    const { data } = await backendApi.patch(
      `/planning/editPlanning/${id}`,
      payload
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const deletePlanification = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/planning/deactivatePlanning/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- PROPOSALS ----------
const createNewProposal = async (payload) => {
  try {
    const { data } = await backendApi.post("/proposal/createProposal", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getAllProposals = async () => {
  try {
    const { data } = await backendApi.get("/proposal/getAll");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getProposalsByPages = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/proposal/getAllByPages/${page}`, {
      params: { keyword: keyword },
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const deleteProposal = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/proposal/deactivateProposal/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getProposalById = async (id) => {
  try {
    const { data } = await backendApi.get(`/proposal/findById/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- CONTRACTS ----------
const createContract = async (payload) => {
  try {
    const { data } = await backendApi.post("/contract/createContract", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getContractsByPages = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/contract/getAllByPages/${page}`, {
      params: { keyword: keyword },
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const deleteContract = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/contract/deactivateContract/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getAllContracts = async () => {
  try {
    const { data } = await backendApi.get(`/contract/getAll`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getContract = async (id) => {
  try {
    const { data } = await backendApi.get(`/contract/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const editContract = async (id, payload) => {
  try {
    const { data } = await backendApi.put(`/contract/${id}`, payload);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ---------- MOVEMENTS ----------
const createMovement = async (payload) => {
  try {
    const { data } = await backendApi.post("/movement/createMovement", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getMovements = async () => {
  try {
    const { data } = await backendApi.get("/movement/getAll");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getMovementsByMonth = async (month, year) => {

  try {
    const { data } = await backendApi.get(
      `/movement/getByMonths/${month}/${year}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getBalanceByYear = async (year) => {
  try {
    const { data } = await backendApi.get(`/movement/getBalanceByYear/${year}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const deleteMovement = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/movement/deactivateMovement/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
// ---------- CHARGES ----------
const createCharge = async (payload) => {
  try {
    const { data } = await backendApi.post("/charge/createCharge", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getCharges = async () => {
  try {
    const { data } = await backendApi.get("/charge/getAll");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const editCharge = async (id, payload) => {
  try {
    const { data } = await backendApi.put(`/charge/${id}`, payload);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const deleteCharge = async (id) => {
  try {
    const { data } = await backendApi.patch(`/charge/deactivateCharge/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const notifyClient = async (id) => {
  try {
    const { data } = await backendApi.patch(`/charge/notify/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getChargesByMonth = async (month, year) => {
  try {
    const { data } = await backendApi.get(
      `/charge/getByMonths/${month}/${year}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

// ------------ PROJECTS ----------------

const getProjects = async () => {
  try {
    const { data } = await backendApi.get("/project");
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getProject = async (id) => {
  try {
    const { data } = await backendApi.get(`/project/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const createProject = async (payload) => {
  try {
    const { data } = await backendApi.post("/project", payload);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const updateProject = async (id, payload) => {
  try {
    const { data } = await backendApi.put(`/project/${id}`, payload);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getSalaries = async (id) => {
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const { data } = await backendApi.get(
      `/working_day/salary/all/${id}/${year}/${month}`
    );

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getComments =  async(id) => {
  try {
    const { data } = await backendApi.get(
      `/project/${id}/comments`
    );

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
}

export {
  backendApi,
  // ---------- USERS ----------
  startLogin,
  createNewUser,
  getUserInfo,
  setNewPassword,
  linkDiscordAccount,

  // ---------- COMPANIES ----------
  getAllCompanies,
  // ---------- AREAS ----------
  createNewArea,
  getAllAreas,
  deleteArea,
  // ---------- DEPARTAMENTS ----------
  createNewDepartment,
  getAllDepartaments,
  getDepartamentbyAreaId,
  deleteDepartament,
  findDepartamentsByArea,
  // ---------- POSITIONS ----------
  createNewPosition,
  getAllPositions,
  deletePosition,
  getPositionsByDepartamentId,
  // ---------- PROSPECTS ----------
  createNewProspect,
  getAllProspects,
  getProspect,
  getAllClients,
  getProspectsByPages,
  editProspect,
  deleteProspect,
  getProspectsById,

  // ---------- PLANIFICATIONS ----------
  createNewPlanning,
  getPlanificationsByPages,
  getAllPlanifications,
  getPlanification,
  updatePlanification,
  deletePlanification,

  // ---------- PROPOSALS ----------
  createNewProposal,
  getAllProposals,
  getProposalsByPages,
  deleteProposal,
  getProposalById,

  // ---------- CONTRACTS ----------
  createContract,
  getContractsByPages,
  deleteContract,
  getAllContracts,
  getContract,
  editContract,

  // ---------- MOVEMENTS ----------
  createMovement,
  getMovements,
  getMovementsByMonth,
  getBalanceByYear,
  deleteMovement,

  // ---------- CHARGES ----------
  createCharge,
  getCharges,
  editCharge,
  deleteCharge,
  getChargesByMonth,
  notifyClient,
  // ---------- EMPLOYEES ----------
  inviteNewEmployee,
  getWorkingsDays,
  createWorkingDayMark,
  getEmployeeIdWorkingsDays,
  getADayOfEmployee,

  // ---------- PROJECTS ----------
  getProjects,
  getProject,
  createProject,
  updateProject,
  getSalaries,
  getComments,
};
