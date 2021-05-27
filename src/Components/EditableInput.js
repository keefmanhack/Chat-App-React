import React, {useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'

const EditableInput = ({
    initialValue, 
    onSave, 
    label=null, 
    placeholder="Write your value", 
    emptyMessage="Input is empty",
    wrapperClassName= '',
    ...inputProps
    }) => {


    const [input, setInput] = useState(initialValue);
    const [isEditable, setIsEditable] = useState(false);

    const onInputChange = (value) => {
        setInput(value);
    }

    const onEditClick = () => {
        setIsEditable(p => !p);
        setInput(initialValue);
    }

    const onSaveClick = async () => {
        const trimmed = input.trim();
        if(trimmed === ''){
            Alert.info(emptyMessage, 4000);
        }

        if(trimmed !== initialValue){
            await onSave(trimmed);
        }

        setIsEditable(false);
    }

    return (
        <div className={wrapperClassName}>
            {label}
            <InputGroup>
                <Input 
                    {...inputProps} 
                    value={input} 
                    placeholder={placeholder} 
                    onChange={onInputChange}
                    disabled={!isEditable}
                />
                <InputGroup.Button onClick={onEditClick}>
                    <Icon icon={isEditable ? 'close' : 'edit2'} />
                </InputGroup.Button>
                {isEditable && (
                    <InputGroup.Button onClick={onSaveClick}>
                        <Icon icon='check'/>
                    </InputGroup.Button>
                )}
            </InputGroup>
        </div>
    )
}

export default EditableInput
