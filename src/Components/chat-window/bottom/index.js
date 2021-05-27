import React, { useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import { useParams } from 'react-router';
import firebase from 'firebase/app';
import { useProfile } from '../../../Context/profile.context';
import { database } from '../../../misc/firebase';

function assembleMessage(profile, chatId){
    return {
        roomId: chatId,
        author: {
            name: profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? {avatar: profile.avatar} : {})
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        likeCount: 0,
    }
}



const ChatBottom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const {profile} = useProfile();
    const {chatId} = useParams();

    const onInputChange = value => {
        setInput(value);
    }

    const onSendClick = async () => {
        if(input.trim() === ''){
            return;
        }

        const msgData = assembleMessage(profile, chatId);
        msgData.text=input;

        const updates = {};

        const messageId = database.ref('messages').push().key;
        updates[`/messages/${messageId}`] = msgData;
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            msgId: messageId,
        };

        setIsLoading(true);
        try{
            await database.ref().update(updates);
            setInput('');
            setIsLoading(false);
        }catch(err){
            Alert.error(err.message, 4000);
            setIsLoading(false);
        }

    }

    const onKeyDown = ev => {
        if(ev.keyCode===13){
            ev.preventDefault();
            onSendClick();
        }
    }

    return (
        <div>
            <InputGroup>
                <Input placeholder="Write message here..." value={input} onChange={onInputChange} onKeyDown={onKeyDown}/>
                <InputGroup.Button color='blue' appearance='primary' disabled={isLoading} onClick={onSendClick}>
                    <Icon icon='send'/>
                </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default ChatBottom
