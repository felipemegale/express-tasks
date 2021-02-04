import { Router } from "express";
import TaskCreateDTO from "../../interfaces/TaskCreateDTO";
import TaskService from "../../services/task";

const wrapper = () => {
    const router = Router();
    const _taskService = new TaskService();

    router.post("/add", async (req, res) => {
        const newTask: TaskCreateDTO = req.body;
        const { jwtPayload } = res.locals;
        const operationResult = await _taskService.addTask(newTask, jwtPayload.id);
        res.status(operationResult.statusCode).send(operationResult);
    });

    router.get("/all", async (req, res) => {
        const { jwtPayload } = res.locals;
        const operationResult = await _taskService.getAll(jwtPayload.id);
        res.status(operationResult.statusCode).send(operationResult);
    });

    return router;
};

export default wrapper;
