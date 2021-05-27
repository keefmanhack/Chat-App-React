import React from 'react'
import { Avatar } from 'rsuite'
import { getNameInitiails } from '../../misc/helpers'

const ProfileAvatar = ({name,  ...avatarProps}) =>
     (
        <Avatar circle  {...avatarProps}>
            {getNameInitiails(name)}
        </Avatar>
    )

export default ProfileAvatar
