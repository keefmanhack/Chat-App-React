import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
    const [messages, setMessages] = useState(null);
    const {chatId} = useParams();

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length>0;

    const handleAdmin = async uid => {
        const adminsRef = database.ref(`/rooms/${chatId}/admins`);
        let alertMessage;
        await adminsRef.transaction(admins => {
            if(admins){
                if(admins[uid]){
                    admins[uid] = null; // deletes
                    alertMessage='Admin permission removed';
                }else{
                    admins[uid] = true;
                    alertMessage='Admin permission granted';
                }
            }
            return admins;
        });

        Alert.info(alertMessage, 4000);
    }

    useEffect(() => {
        const messagesRef = database.ref('/messages');
        messagesRef.orderByChild('roomId').equalTo(chatId).on('value', snap => {
            const data = transformToArrWithId(snap.val());
            setMessages(data);
        })

        return () => {
            messagesRef.off('value');
        }
    }, [chatId]);

    const handleLike = async msgId => {
        const {uid} = auth.currentUser;
        const messageRef = database.ref(`/messages/${msgId}`);
        let alertMessage;
        await messageRef.transaction(msg => {
            if(msg){
                if(msg.likes && msg.likes[uid]){
                    msg.likeCount-=1;
                    msg.likes[uid] = null; // deletes
                    alertMessage='Like Removed';
                }else{
                    msg.likeCount +=1;
                    if(!msg.likes){
                        msg.likes = {};
                    }
                    msg.likes[uid] = true;
                    alertMessage='Like Added';
                }
            }
            return msg;
        });

        Alert.info(alertMessage, 4000);
    }

    return (
        <ul className='msg-list custom-scroll'>
            {isChatEmpty && <li>No messages yet</li>}
            {canShowMessages && messages.map(msg => 
                <MessageItem handleLike={handleLike} key={msg.id} message={msg} handleAdmin={handleAdmin}/>
            )}
        </ul>
    )
}

export default Messages
