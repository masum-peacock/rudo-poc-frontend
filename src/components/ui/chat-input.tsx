'use client'
import { useState } from 'react';
import { Textarea } from './textarea';
import { Button } from './button';

interface ChatInputProps {
    onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState<string>("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent newline on Enter
            handleSend();
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 border-t border-gray-200 w-full rounded-lg">
            <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none w-full text-lg"
                rows={2}
            />
            <Button onClick={handleSend} className='h-20 w-32 font-bold text-lg'>Send</Button>
        </div>
    );
};

export default ChatInput;
