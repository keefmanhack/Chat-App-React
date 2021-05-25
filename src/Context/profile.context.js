import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, database } from "../misc/firebase";

const ProfileContext = createContext();

export const ProfileProvider = ({children}) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let userRef;
        const authUnSub = auth.onAuthStateChanged(authObj => {
            if(authObj){
                userRef= database.ref(`/profiles/${authObj.uid}`);
                userRef.on('value', (snap) => {
                    const {name, createdAt} = snap.val();
                    const data = {
                        uid: authObj.uid,
                        email: authObj.email,
                        name,
                        createdAt,
    
                    }
                    setProfile(data);
                    setIsLoading(false);
                }) 
            }else{
                if(userRef){
                    userRef.off();
                }

                setProfile(null);
                setIsLoading(false);
            }
        })

        return () => {
            authUnSub();
            if(userRef){
                userRef.off();
            }
        }
    }, [])
    
    return (<ProfileContext.Provider value={{profile, isLoading}}>
        {children}
    </ProfileContext.Provider>);
}

export const useProfile = () => useContext(ProfileContext);