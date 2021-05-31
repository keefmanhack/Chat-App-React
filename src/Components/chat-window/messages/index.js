import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
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

    const handleDelete = async (msgId, file) => {
        if(!window.confirm("Delete this message?")){
            return;
        }

        const isLast = messages[messages.length-1].id === msgId;

        const updates = {};

        updates[`/messages/${msgId}`] = null;
        if(isLast && messages.length>1){
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length-2],
                msgId: messages[messages.length-2].id
            }
        }else if(isLast && messages.length ===1){
            updates[`/rooms/${chatId}/lastMessage`] = null;
        }

        try{
            await database.ref().update(updates);
            Alert.info('Message has been deleted', 4000);
        }catch(err){
            Alert.error(err.message, 4000);
            return;
        }

        if(file){
            try {
                const fileRef = storage.refFromURL(file.url);
                await fileRef.delete();
            } catch (err) {
                Alert.error(err.message, 4000);
            }
        }

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

    const renderMessages = () => {
        const groups = groupBy(messages, (item) => 
            new Date(item.createdAt).toDateString()
        );

        const items=[];

        console.log(Object.keys(groups));
        Object.keys(groups).forEach((date) => {
            items.push(<li key={date} className='text-center mb-1 padded'>{date}</li>)
            const msgs = groups[date].map(msg => (
                <MessageItem 
                    handleLike={handleLike} 
                    key={msg.id} 
                    message={msg} 
                    handleAdmin={handleAdmin}
                    handleDelete={handleDelete}    
                />
            ));
            items.push(...msgs);
        });
        return items;
    }

    return (
        <ul className='msg-list custom-scroll'>
            {isChatEmpty && <li>No messages yet</li>}
            {canShowMessages && renderMessages()}
        </ul>
    )
}

export default Messages
