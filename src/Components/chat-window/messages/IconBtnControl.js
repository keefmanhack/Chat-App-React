import React from 'react'
import { Badge, IconButton, Tooltip, Whisper, Icon } from 'rsuite'

const ConditionalBadge = ({condition, children}) => (
    condition ? <Badge content={condition}>{children}</Badge> : children
)

const IconBtnControl = ({
    isVisible,
    iconName,
    tooptip,
    onClick,
    badgeContent,
    ...props
}) => {
    console.log();
    return (
        <div className='ml-2' style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            <ConditionalBadge condition={badgeContent}>
                <Whisper
                    placement='top'
                    delay={0}
                    delayHide={0}
                    delayShow={0}
                    trigger='hover'
                    speaker={<Tooltip>{tooptip}</Tooltip>}
                >
                    <IconButton
                        {...props}
                        onClick={onClick}
                        circle
                        size='xs'
                        icon={<Icon icon={iconName}/>}
                    />
                </Whisper>
            </ConditionalBadge>
        </div>
    )
}

export default IconBtnControl
