import React from 'react'
import { Modal } from 'rsuite';
import { useModalState } from '../../../misc/customHooks'

const ImageBtnModal = ({src, fileName}) => {
    const {open, close, isOpen} = useModalState();
    return (
        <>
            <input 
                type='image' 
                alt='file' 
                src={src} 
                onClick={open}
                className='mw-100 mh-100 w-auto'    
            />
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>{fileName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <img src={src} height='100%' width='100%' alt='File'/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <a href={src} target='_blank' rel='noopener noreferrer'>
                        View original
                    </a>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ImageBtnModal
