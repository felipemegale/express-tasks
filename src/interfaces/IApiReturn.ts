export default interface IApiReturn<T1, T2> {
    data?: T1;
    error?: T2;
    statusCode: number;
}
