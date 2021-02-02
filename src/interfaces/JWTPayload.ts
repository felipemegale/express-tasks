export default interface JWTPayload {
    id: number;
    createdAt: string;
    updatedAt?: string;
    username: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
}
