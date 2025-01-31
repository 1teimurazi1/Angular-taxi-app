export interface User {
    type: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    currOrderID: number;
    status: string;

    id?: string;
    carModel?: string;
    plateNumber?: string;
}