import Task from '../entity/Task';

export type SignInDataResponse = {
    username: string;
    email: string;
    name: string;
    tasks: Task[];
    token: string;
};
