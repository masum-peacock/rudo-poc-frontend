import React from 'react'

const ChatHeading = ({ title }: { title: string }) => {
    return (
        <div className='border p-4 rounded-lg'>
            <h3>{title}</h3>
        </div>
    )
}

export default ChatHeading