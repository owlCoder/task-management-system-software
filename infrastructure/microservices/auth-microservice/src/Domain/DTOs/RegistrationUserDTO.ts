export interface RegistrationUserDTO {
    username: string;
    role: string; // full role name like in db
    password: string;
    email: string;
}