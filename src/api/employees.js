import { backendApi } from "./axios";

const getEmployeesByPages = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/user/employee/getAllEmployeesByPages/${page}`, {
      params: { keyword: keyword },
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const deleteEmployee = async (id) => {
  try {
    const { data } = await backendApi.patch(
      `/user/employee/deactivateEmployee/${id}`
    );
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getAllEmployees = async () => {
  try {
    const { data } = await backendApi.get(`/user/employee/getAll`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};
const getEmployeeById = async (id) => {
  try {
    const { data } = await backendApi.get(`/user/getById/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
}
const editEmployee = async (id, payload) => {
  try {
    const { data } = await backendApi.patch(`/user/employee/editEmployee/${id}`, payload);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
}

const getSalaryByEmployeeId = async (id) => {
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const { data } = await backendApi.get(`/working_day/salary/${id}/${year}/${month}`);

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
}


export { getEmployeesByPages, deleteEmployee, getAllEmployees, getEmployeeById, editEmployee, getSalaryByEmployeeId };
