import { Router } from "express";
import TaskCreateDTO from "../../interfaces/TaskCreateDTO";
import TaskService from "../../services/task";

const wrapper = () => {
    const router = Router();
    const _taskService = new TaskService();

    router.post("/add", async (req, res) => {
        const newTask: TaskCreateDTO = req.body;
        const { jwtPayload } = res.locals;
        const idk = await _taskService.addTask(newTask, jwtPayload.id);
        res.send(idk);
    });

    return router;
};

export default wrapper;
