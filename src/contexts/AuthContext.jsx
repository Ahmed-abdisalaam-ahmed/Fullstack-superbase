import { createContext, useEffect, useState } from "react";
import { getUserProfile, onAuthchange } from "../lib/Auth";

const AuthContext = createContext(null);

export function AuthcontextProvider({children}){

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {

     const cleanup = onAuthchange(async (user) => {
            setUser(user);

        if(user){

            try {
                const userProfile = await getUserProfile(user.id);
                setProfile(userProfile)
            } catch (error) {
                    console.error("Error faetching user profile: ", error);
            }
        }else{
            setProfile(null)
        }
        setLoading(false)
    })

    return cleanup;

    },[])
}