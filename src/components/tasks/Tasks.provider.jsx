import { createContext, useState } from "react";
import { getAllWithoutEmployee, getByEmployee, createTask } from "../../api/tasks.js";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

export const TasksContext = createContext();

const initialState = [];

const TasksProvider = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [tasks, setTasks] = useState(initialState);
    const [milestonesModal, setMilestonesModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('QUERCU_USER_INFO'));
    let isCompany = false;
    // Get widows width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [responsive, setResponsive] = useState(false);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (windowWidth < 768) {
            setResponsive(true);
        } else {
            setResponsive(false);
        }
    }, [windowWidth]);

    if (user) isCompany = user.role.includes(1)

    const checkErrors = (object) => {
        for (let key in object) {
            if (key !== 'description') {
                if (object[key] === '') {
                    return true
                }
            }
        }
        return false
    }

    const handleCreate = async (form) => {
        const res = await createTask(form)

        if (res.status) {
            enqueueSnackbar(res.message, { variant: "success" });
        } else {
            enqueueSnackbar(res.message, { variant: "error" });
        }
    }

    const getTasks = async () => {
        if (isCompany) getAllWithoutEmployee().then(res => {
            if (res.status) {
                setTasks(res.data)
            }
        })

        if (!isCompany) getByEmployee(user._id).then(res => {
            if (res.status) {
                setTasks(res.data)
            }
        })
    }

    const filterTasksWithEmployeeAsigned = (tasks) => {
        let tasksWithoutEmployeeAsigned = []

        tasks.forEach(item => {
            tasksWithoutEmployeeAsigned.push({
                date: item.date,
                tasks: item.tasks.filter(task => task.employee === null || task.employee === undefined || task.employee === '' || task.employee === 'undefined')
            })
        })

        return tasksWithoutEmployeeAsigned
    }

    const data = {
        tasks,
        setTasks,
        milestonesModal,
        setMilestonesModal,
        user,
        isCompany,
        handleCreate,
        getTasks,
        filterTasksWithEmployeeAsigned,
        windowWidth,
        responsive
    }

    return (
        <TasksContext.Provider value={data}>
            {children}
        </TasksContext.Provider>
    );
}

export { TasksProvider }

export default TasksContext;