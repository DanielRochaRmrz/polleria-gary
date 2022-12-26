export interface AuthResponse {
    status     : boolean
    message    : string,
    id         : number,
    usuario    : string,
	auth_token : string
}

export interface Usuario {
    usuario    : string;
    status     : boolean     
}

export interface AuthUser {
    status:  boolean;
    message: string;
    user:    User;
}

export interface User {
    id:         number;
    nombre:     string;
    usuario:    string;
    created_at: Date;
    updated_at: Date;
}