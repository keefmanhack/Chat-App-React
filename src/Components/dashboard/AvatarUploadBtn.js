import React, { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Alert, Button, Modal } from 'rsuite'
import { useProfile } from '../../Context/profile.context'
import { useModalState } from '../../misc/customHooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from './ProfileAvatar';

const fileInputTypes = ".png, .jpeg, .jpg";

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

const getBlob = (canvas) => 
     new Promise( (resolve, reject) => {
        canvas.toBlob((blob) => {
            if(blob){
                resolve(blob);
            }else{
                reject(new Error('File process error'));
            }
        })
    })


const AvatarUploadBtn = () => {
    const {profile} = useProfile();
    const {isOpen, open, close} = useModalState();
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const avatarEditorRef = useRef();

    const onFileInputChange = env => {
        const currentFiles = env.target.files;
        if(currentFiles.length===1){
            const file = currentFiles[0];
            if(isValidFile(file)){
                setImage(file);
                
                open();
            }else{
                Alert.warning(`Wrong file type ${file.type}`, 4000);
            }
        }
    }

    const onUploadClick = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas();
        try{
            setIsLoading(true);
           const blob =  await getBlob(canvas);

           const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');

           const uploadAvatarResult = await avatarFileRef.put(blob, {
               cacheControl: `public, max-age-${3600 * 24 * 3}`
           });

           const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

           const userAvatarRef = database.ref(`/profiles/${profile.uid}`).child('avatar');

           userAvatarRef.set(downloadUrl);

           Alert.success("Uploaded new avatar", 4000);
           setIsLoading(false);

        }catch(err){
            Alert.warning(err.message, 4000);
            setIsLoading(false);
        }
    }

    return (
        <div className='mt-3 text-center'>
            <div>
                <ProfileAvatar src={profile.avatar} name={profile.name} className='width-200 height-200 img-fullsize font-huge'/>
                <label htmlFor='avatar-upload' className='d-block cursor-pointer padded'>
                    Select new avatar
                    <input 
                        id='avatar-upload' 
                        type='file' 
                        className='d-none' 
                        accept={fileInputTypes}
                        onChange={onFileInputChange}
                    />
                </label>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>
                            Adjust and upload new avatar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center align-items-center h-100'>
                            {image && (
                                <AvatarEditor
                                    ref={avatarEditorRef}
                                    image={image}
                                    width={200}
                                    height={200}
                                    border={10}
                                    borderRadius={100}
                                />
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance='ghost' onClick={onUploadClick} disabled={isLoading}>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn
