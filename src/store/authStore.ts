import {create} from 'zustand';
import {persist} from 'zustand/middleware'
import type { AuthState } from './IAuthStore';

export const AuthStore=create<AuthState>()(persist((set)=>({
    token:null,
    user:null,
    role:null,

    login:(token,user)=>set({token,user,role:user.role}),
    logout:()=>set({token:null, user:null, role:null}),

}),
{
    name:'auth-storage',
}
));