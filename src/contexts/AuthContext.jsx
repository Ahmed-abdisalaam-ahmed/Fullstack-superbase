import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile, onAuthchange, signOut } from "../lib/Auth.js";

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

    const logOut = async () =>{
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing Out:', error)
        }
    }

    const value = {
        user,
        profile,
        isLoading,
        isLoggedIn : !!user,  // convert user to boolean
        logOut
    }

    // cilmi cusub !! waxa lala jeedatta hadaadd rabto inaad 

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