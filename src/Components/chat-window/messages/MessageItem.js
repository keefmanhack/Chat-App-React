import React, { memo } from 'react'
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../Context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/customHooks';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ImageBtnModal from './ImageBtnModal';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const renderFileMessage = file => {
    if(file.contentType.includes('image')){
        return <div className='h-220'>
            <ImageBtnModal src={file.url} fileName={file.name}/>
        </div>
        
    }

    if(file.contentType.includes('audio')){
        // eslint-disable-next-line 
        return <audio controls>
            <source src={file.url} type='audio/mp3'/>
            Your browser does not support the audio element
        </audio>
        
    }

    return <a href={file.url}>Download {file.name}</a>
}

const MessageItem = ({message, handleAdmin, handleLike, handleDelete}) => {
    const {author, createdAt, text, file, likes, likeCount} = message;
    const [selfRef, isHover] = useHover();
    
    const isAdmin = useCurrentRoom(v=>v.isAdmin);
    const admins = useCurrentRoom(v=>v.admins);

    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmin = isAdmin && !isAuthor;

    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
    const isMobile = useMediaQuery('(max-width: 992px)');
    const canShowIcons = isMobile || isHover;



    return (
        <li 
            className={
                `padded 
                mb-1 
                cursor-pointer
                ${isHover ? 'bg-black-02' : ''}
            `} 
            ref={selfRef}>
            <div className='d-flex align-items-center font-bolder mb-1'>
                <PresenceDot uid={author.uid}/>
                <ProfileAvatar 
                    src={author.avatar} 
                    name={author.name} 
                    className='ml-1' 
                    size='xs'
                />
                <ProfileInfoBtnModal 
                    profile={author} 
                    appearence='link' 
                    className='p-0 ml-1 text-black'
                >
                    {canGrantAdmin && (
                        <Button block onClick={()=>handleAdmin(author.uid)} color="blue">
                            {isMsgAuthorAdmin
                            ? 'Remove admin permission'
                            : 'Give admin in this room'
                            }
                        </Button>
                    )}
                </ProfileInfoBtnModal>
                <TimeAgo datetime={createdAt} className='font-normal text-black-45 ml-2'/>
                <IconBtnControl
                    {...(isLiked ? {color: 'red'} : {})}
                    isVisible={canShowIcons}
                    iconName='heart'
                    tooptip='Like this messsage'
                    onClick={()=>handleLike(message.id, file)}
                    badgeContent={likeCount}
                />
                {isAuthor && (
                    <IconBtnControl
                        isVisible={canShowIcons}
                        iconName='close'
                        tooptip='Delete this message'
                        onClick={()=>handleDelete(message.id)}
                    />
                )}
               
            </div>
            <div>
                {text && <span className='word-break-all'>{text}</span>}
                {file && renderFileMessage(file)}
                
            </div>
        </li>
    )
}

export default memo(MessageItem);
