'use client'
import { useState, useEffect, useRef } from 'react';
import ChatInput from './chat-input';

interface Message {
    sender: string;
    content: string;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async (newMessage: string) => {
        const userMessage = { sender: "You", content: newMessage };
        setMessages((prevMessages) => [...prevMessages, ...(currentMessage ? [currentMessage] : []), userMessage]);
        setCurrentMessage(null);
        try {
            const response = await fetch(`http://127.0.0.1:8787/chat?message=${newMessage}`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream'
                }
            },);

            if (!response.body) throw new Error('ReadableStream not supported in this browser.');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";

            // Read and process chunks
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                console.log('Chunk received:', chunk);
                const lines = chunk.split('\n').filter((line) => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        console.log(["LINE -> "], line);
                        const content = line.replace(/^data: /, '').trim();

                        if (content === '[DONE]') {
                            // Finalize the assistant message in messages state and reset currentMessage
                            setMessages((prevMessages) => [...prevMessages, { sender: "Assistant", content: assistantContent }]);
                            setCurrentMessage(null);
                            return;
                        }

                        // Update the assistant's message progressively
                        assistantContent += " " + content;
                        setCurrentMessage({ sender: "Assistant", content: assistantContent });
                    }
                }
            }
        } catch (error) {
            console.error('Error receiving messages:', error);
            setMessages((prevMessages) => [...prevMessages, { sender: "System", content: "Error: Unable to process your request." }]);
            setCurrentMessage(null);
        }
    };

    // Scroll to the bottom of the messages when a new message is added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentMessage]);

    return (
        <div className="flex flex-col min-h-screen max-w-3xl mx-auto">
            <div className="overflow-y-auto p-4 h-full min-w-3xl mb-24">
                {messages.map((msg, index) => (
                    <div key={index + ""} className="flex flex-col gap-1 my-4">
                        <div className={`rounded max-w-12 flex justify-center items-center p-1 font-semibold  ${msg.sender === "You" ? "ml-auto" : "mr-auto"}`}>{msg.sender}</div>
                        <div className={`rounded max-w-xl min-w-auto p-1 ${msg.sender === "You" ? "ml-auto text-right" : "mr-auto text-left"}`}>{msg.content}</div>
                    </div>
                ))}
                {currentMessage && (
                    <div className="flex flex-col gap-1 my-4">
                        <div className="rounded max-w-12 mr-auto flex justify-center items-center p-1 font-semibold">{currentMessage.sender}</div>
                        <div className="rounded max-w-xl mr-auto min-w-auto p-1 text-left">{currentMessage.content}</div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto bg-white border-t border-gray-200 rounded-lg">
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
};

export default ChatInterface;
