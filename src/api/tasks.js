import { backendApi } from "./axios";

export const createTask = async(data) => {
  try {
      const { data: res } = await backendApi.post("/task/create", data);
      return res;
  } catch (err) {
      return err.response.data;
  }
}
export const getAllTasks = async() => {
  try {
      const { data: res } = await backendApi.get("/task/");
      return res;
  } catch (err) {
      return err.response.data;
  }
}
export const getAllTasksfinished = async() => {
  try {
      const { data: res } = await backendApi.get("/task/finished");
      return res;
  } catch (err) {
      return err.response.data;
  }
}
export const getTask = async(id) => {
  try {
      const { data: res } = await backendApi.get(`/task/${id}`);
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const getByEmployee = async(user) => {
  try {
      const { data: res } = await backendApi.get(`/task/getByEmployee/${user}`);
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const getAllWithoutEmployee = async() => {
  try {
      const { data: res } = await backendApi.get("/task/getAllWithoutEmployee");
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const updateTask = async(id, form) => {
  try {
      const { data: res } = await backendApi.patch(`/task/update/${id}`, form);
      return res;
  } catch (err) {
      return err.response.data;
  }
}
export const disableTask = async(id) => {
  try {
      const { data: res } = await backendApi.patch(`/task/disable/${id}`);
      return res;
  } catch (err) {
      return err.response.data;
  }
}
export const finishTask = async(id) => {
  try {
      const { data: res } = await backendApi.patch(`/task/finish/${id}`);
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const reviewTask = async(id) => {
    try {
        const { data: res } = await backendApi.patch(`/task/review/${id}`);
        return res;
    } catch (err) {
        return err.response.data;
    }
  }

export const addEmployeeAndContract = async(id, employee, contract) => {
  try {
      const { data: res } = await backendApi.patch(`/task/update/${id}`, { employee, contract });
      return res;
  } catch (err) {
      return err.response.data;
  }
}

// * HITOS

export const getMilestonesOfTask = async(id) => {
  try {
      const { data: res } = await backendApi.get(`/task/milestones/${id}`);
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const createMilestone = async(data) => {
  try {
      const { data: res } = await backendApi.post("/task/milestones/create", data);
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const updateMilestone = async(id, data) => {
  try {
      const { data: res } = await backendApi.patch(`/task/milestones/update/${id}`, data);
      return res;
  } catch (err) {
      return err.response.data;
  }
}

export const deleteMilestone = async(id, userId) => {
  try {
      const { data: res } = await backendApi.delete(`/task/milestones/delete/${id}`, {
          data: { userId },
      });
      return res;
  } catch (err) {
      return err.response.data;
  }
}