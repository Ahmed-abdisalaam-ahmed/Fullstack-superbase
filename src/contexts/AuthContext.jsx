import { createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthcontextProvider({children}){

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading,setLoading] = useState(true)
}