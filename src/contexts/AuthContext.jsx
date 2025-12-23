import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile, onAuthchange } from "../lib/Auth.js";

const AuthContext = createContext(null);

export function AuthProvider({children}){

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [isLoading,setIsLoading] = useState(true)

    useEffect(() => {

     const cleanUp = onAuthchange(async (user) => {
        setUser(user);

        if(user){

            try {
                const userProfile = await getUserProfile(user.id);
                setProfile(userProfile);

            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        } else {
            setProfile(null)
        }
        setIsLoading(false);
    })

    return cleanUp;

    },[])

    const value = {
        user,
        profile,
        setIsLoading
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if(context === null){
        throw new Error("useAuth must be used within and AuthProvider")
    }

    return context;
}