import { backendApi } from "./axios";

const createDebt = async (payload) => {
  try {
    const { data } = await backendApi.post("/debt/createDebt", {
      data: payload,
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getDebtsByPages = async (page, keyword) => {
  try {
    const { data } = await backendApi.get(`/debt/getAllByPages/${page}`, {
      params: { keyword: keyword },
    });
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const deleteDebt = async (id) => {
  try {
    const { data } = await backendApi.patch(`/debt/deactivateDebt/${id}`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getAllDebts = async () => {
  try {
    const { data } = await backendApi.get(`/debt/getAll`);
    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

const getTotalDebts = async () => {
  try {
    const { data } = await backendApi.get(`/debt/totalDebts`);

    return data;
  } catch (error) {
    const res = error.response.data;
    return res;
  }
};

export { createDebt, getDebtsByPages, deleteDebt, getAllDebts, getTotalDebts };
