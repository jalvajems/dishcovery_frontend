export interface User{
    id:string;
    name:string;
    email:string;
    role:'user'| 'chef' | 'admin';
}

export interface AuthState{
    token:string|null;
    user:User|null;
    role:'user' | 'chef' | 'admin' | null;

    login:(token:string,user:User)=>void;
    logout:()=>void;
}