import { Router } from 'express';
import TaskCreateDTO from '../../interfaces/TaskCreateDTO';
import TaskService from '../../services/task';

const routerWrapper = () => {
    const router = Router();
    const _taskService = new TaskService();

    router.post('/add', async (req, res) => {
        const newTask: TaskCreateDTO = req.body;
        const { jwtPayload } = res.locals;
        const addTaskResult = await _taskService.addTask(newTask, jwtPayload.id);

        res.status(addTaskResult.statusCode).send(addTaskResult);
    });

    router.get('/all', async (req, res) => {
        const { jwtPayload } = res.locals;
        const getAllResult = await _taskService.getAll(jwtPayload.id);

        res.status(getAllResult.statusCode).send(getAllResult);
    });

    return router;
};

export default routerWrapper;
