import { getConnection, Repository } from 'typeorm';
import IApiResponse from '../../types/IApiResponse';
import Task from '../../entity/Task';
import User from '../../entity/User';
import TaskCreateDTO from '../../interfaces/TaskCreateDTO';
import InternalServerError from '../../types/errors/InternalServerError';
import CreatedResponse from '../../types/responses/CreatedResponse';
import APIErrorResponse from '../../types/responses/APIErrorResponse';
import OkResponse from '../../types/responses/OkResponse';

export default class TaskService {
    UserRepository: Repository<User>;
    TaskRepository: Repository<Task>;

    constructor() {
        const dbConnection = getConnection();
        this.UserRepository = dbConnection.getRepository(User);
        this.TaskRepository = dbConnection.getRepository(Task);
    }

    async addTask(newTask: TaskCreateDTO, ownerId: number): Promise<IApiResponse> {
        try {
            const task = new Task();

            task.title = newTask.title;
            task.description = newTask.description;
            task.complete = newTask.complete;

            const user = await this.UserRepository.findOne({
                where: [{ id: ownerId }],
            });

            delete user.password;
            delete user.avatar;

            task.user = user;
            const savedTask = await this.TaskRepository.save(task);

            if (!savedTask) {
                throw new InternalServerError();
            }

            return new CreatedResponse(savedTask);
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }

    async getAll(ownerId: number): Promise<IApiResponse> {
        try {
            const tasks = await this.TaskRepository.find({
                where: [{ id: ownerId }],
            });

            if (!tasks) {
                throw new InternalServerError();
            }

            return new OkResponse(tasks);
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }
}
