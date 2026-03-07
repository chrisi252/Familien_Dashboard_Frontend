export interface User {
    id: number;
    username: string;
    role?: 'Admin' | 'Nutzer' | 'Au-Pair';
    email: string;
    createdAt?: Date;
}
