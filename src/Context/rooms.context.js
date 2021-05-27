import React, {createContext, useState, useContext, useEffect} from 'react';
import { database } from '../misc/firebase';
import { transformToArrWithId } from '../misc/helpers';

const RoomsContext = createContext();

export const RoomsProivder = ({children}) => {
    const [rooms, setRooms] = useState(null);

    useEffect(() => {
        const roomListRef = database.ref('rooms');

        roomListRef.on('value', snap => {
            const data = transformToArrWithId(snap.val());
            setRooms(data);
        })

        return () => {
            roomListRef.off();
        }

    }, []);

    return <RoomsContext.Provider value={rooms}>
        {children}
    </RoomsContext.Provider>
}

export const useRooms = () => useContext(RoomsContext);