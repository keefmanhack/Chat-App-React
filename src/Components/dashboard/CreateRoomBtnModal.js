import React, {useState, useRef} from 'react'
import { Button, FormControl, Form, ControlLabel, FormGroup, Icon, Modal, Schema, Alert } from 'rsuite'
import firebase from 'firebase/app';
import { useModalState } from '../../misc/customHooks'
import { database } from '../../misc/firebase';


const {StringType} = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired('Chat name is required'),
    description: StringType().isRequired('Description is required'),
})


const INITIALFORM = {
    name: '',
    description: '',
}

const CreateRoomBtnModal = () => {
    const {isOpen, open, close} = useModalState();
    const [formValue, setFormValue] = useState(INITIALFORM);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();

    const onFormChange = value => {
        setFormValue(value);
    }

    const onSubmit = async () => {
        if (!formRef.current.check()){
            return;
        }
        setIsLoading(true);
        const newRoomData = {
            ...formValue,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        }

        try{
            await database.ref(`rooms`).push(newRoomData);
            setIsLoading(false);
            Alert.info(`${formValue.name} has been created`, 4000);
            setFormValue(INITIALFORM);
            close();
        }catch(err){
            setIsLoading(false);
            Alert.error(err.message, 4000);
        }

    }


    return (
        <div className='mt-2'>
            <Button block color='green' onClick={open}>
                <Icon icon='creative'/> Create new chat room
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>New chat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid 
                        onChange={onFormChange} 
                        formValue={formValue} 
                        model={model}
                        ref={formRef}    
                    >
                        <FormGroup>
                            <ControlLabel>Room name</ControlLabel>
                            <FormControl name='name' placeholder="Enter chat room name..."/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl component='textarea' rows={5} name='description' placeholder="Enter room description..."/>
                        </FormGroup>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance='primary' onClick={onSubmit} disabled={isLoading}>
                        Create new chat room
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomBtnModal
