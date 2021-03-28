import { getConnection } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import IApiReturn from '../../interfaces/IApiReturn';
import Task from '../../entity/Task';
import User from '../../entity/User';
import TaskCreateDTO from '../../interfaces/TaskCreateDTO';

export default class TaskService {
    async addTask(newTask: TaskCreateDTO, ownerId: number): Promise<IApiReturn<Task, string>> {
        const dbConnection = await getConnection();
        const TaskRepository = dbConnection.getRepository(Task);
        const UserRepository = dbConnection.getRepository(User);

        const task = new Task();

        task.title = newTask.title;
        task.description = newTask.description;
        task.complete = newTask.complete;

        try {
            const user = await UserRepository.findOneOrFail(ownerId);
            delete user.password;

            task.user = user;
            const savedTask = await TaskRepository.save(task);

            return {
                data: savedTask,
                error: undefined,
                statusCode: StatusCodes.CREATED,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    async getAll(ownerId: number): Promise<IApiReturn<Task[], string>> {
        const dbConnection = await getConnection();
        const TaskRepository = dbConnection.getRepository(Task);

        try {
            const tasks = await TaskRepository.createQueryBuilder('task')
                .where('"userId" = :ownerId', { ownerId })
                .getMany();
            return {
                data: tasks,
                error: undefined,
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
