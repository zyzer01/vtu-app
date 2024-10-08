export interface UserData {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user?: {
        id: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
    };
    error?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
    };
    error?: string;
}
