'use client'
import { useState, useEffect, useRef } from 'react';
import ChatInput from './chat-input';
import ChatHeading from '../custom/chat-heading';
import ReactMarkdownChat from '../custom/react-markdown';
import { useUser } from '@clerk/nextjs';
interface Message {
    sender: string;
    content: {
        message: string;
        is_file: boolean;
    };
}

interface SendMessagePayload {
    message: string;
    is_file: boolean;
    files?: File[];
}

const ChatInterface: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
    const [fileText, setFileText] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {user} = useUser();
    const handleSend = async ({ message, is_file, files }: SendMessagePayload) => {
        const userMessage: Message = { sender: "You", content: { message, is_file } };
        setMessages((prevMessages) => [...prevMessages, ...(currentMessage ? [currentMessage] : []), userMessage]);
        setCurrentMessage(null);

        try {
            let formData = {
                message,
                is_file: false,
                files_text: '',
                user_id: user?.id,
            };
            setIsLoading(true);

            if (is_file && files) {
                try {
                    const fileForm = new FormData();
                    fileForm.append('file', files[0]);
                    const fileToText = await fetch('http://127.0.0.1:8000/upload', {
                        method: 'POST',
                        body: fileForm
                    });
                    const readableText = await fileToText.text();
                    formData = { ...formData, is_file: true, files_text: readableText };
                    setFileText(readableText);
                } catch (error: unknown) {
                    console.error("Error uploading file:", error);
                    setMessages((prevMessages) => [...prevMessages, { sender: "Assistant", content: { message: "File Upload Error", is_file: true } }]);
                    setIsLoading(false);
                    setFileText('');
                }
            }

            // const response = await fetch(`http://127.0.0.1:8787/chat`, {
            //     method: 'POST',
            //     body: JSON.stringify(formData),
            //     headers: {
            //         'Accept': 'text/event-stream'
            //     }
            // });

            // if (!response.body) throw new Error('ReadableStream not supported in this browser.');

            // const reader = response.body.getReader();
            // const decoder = new TextDecoder();
            // let assistantContent = ``;

            // while (true) {
            //     const { value, done } = await reader.read();
            //     if (done) break;

            //     const chunk = decoder.decode(value);
            //     const lines = chunk.split('\n').filter((line) => line.trim() !== '');

            //     for (const line of lines) {
            //         if (line.startsWith("data:")) {
            //             let content = line.replace(/^data:/, '').trim();


            //             if (content === '[DONE]') {
            //                 setMessages((prevMessages) => [...prevMessages, {
            //                     sender: "Assistant",
            //                     content: { message: assistantContent, is_file }
            //                 }]);
            //                 setCurrentMessage(null);
            //                 return;
            //             }
            //             console.log(["content"], content);
            //             assistantContent += content;
            //             // Accumulate and update assistant's message
            //             // Clean up extra spaces within HTML tags and inline styles
            //             assistantContent = assistantContent
            //                 .replace(/\s*-\s*/g, '-')                // Remove spaces around hyphens in CSS properties
            //                 .replace(/\s*=\s*/g, '=')                // Remove spaces around equal signs in attributes
            //                 .replace(/:\s+/g, ':')                   // Remove spaces after colons in styles
            //                 .replace(/;\s+/g, '; ')                  // Ensure a single space after each CSS property
            //                 .replace(/<\s+/g, '<')                   // Remove spaces after opening angle bracket
            //                 .replace(/\s+>/g, '>')                   // Remove spaces before closing angle bracket
            //                 .replace(/<\s+\/\s+/g, '</');            // Correct closing tags like < /p> to </p>
            //             setCurrentMessage({ sender: "Assistant", content: { message: assistantContent, is_file } });
            //         }
            //     }
            // }

            // JSON RESPONSE FROM CHATGPT
            console.log(["FORM DATA"], formData);
            const response = await fetch(`http://127.0.0.1:8787/chat`, {
                method: 'POST',
                body: JSON.stringify({...formData, files_text: formData.files_text || fileText}),
            });

            if (!response.ok) {
                setMessages((prevMessages) => [...prevMessages, { sender: "Assistant", content: { message: "Error receiving messages", is_file: formData.is_file } }]);
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            setIsLoading(false);
            setMessages((prevMessages) => [...prevMessages, { sender: "Assistant", content: { message: data?.data?.answer, is_file: false } }]);

        } catch (error) {
            console.error('Error receiving messages:', error);
            setMessages((prevMessages) => [...prevMessages, { sender: "System", content: { message: "Error receiving messages", is_file: false } }]);
            setCurrentMessage(null);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentMessage]);

    return (
        <div className="flex flex-col min-h-screen max-w-3xl mx-auto">
            <div className="fixed top-0 left-64 right-0 max-w-3xl mx-auto bg-white border-t border-gray-200 rounded-lg">
                <ChatHeading title="Rudo AI" />
            </div>
            <div className="overflow-y-auto p-4 h-screen min-w-full mb-24 mt-44">
                {messages.map((msg, index) => (
                    <div key={index} className="flex flex-col gap-1 my-4">
                        <div className={`rounded max-w-12 flex justify-center items-center p-1 font-semibold ${msg.sender === "You" ? "ml-auto" : "mr-auto"}`}>
                            {msg.sender}
                        </div>
                        {msg.content.is_file && (
                            <div className={`rounded max-w-xl min-w-auto p-1 ml-auto text-right`}>
                                <span className='py-2 px-4 border rounded-lg bg-gray-400'>Uploaded File</span>
                            </div>
                        )}
                        <div className={`rounded max-w-xl min-w-auto p-1 ${msg.sender === "You" ? "ml-auto text-right" : "mr-auto text-left"}`}>
                            <ReactMarkdownChat>{msg.content.message}</ReactMarkdownChat>
                        </div>
                    </div>
                ))}
                {currentMessage && (
                    <div className="flex flex-col gap-1 my-4">
                        <div className="rounded max-w-12 mr-auto flex justify-center items-center p-1 font-semibold">
                            {currentMessage.sender}
                        </div>
                        <div className="rounded max-w-xl mr-auto min-w-auto p-1 text-left">
                            <ReactMarkdownChat>{currentMessage.content.message}</ReactMarkdownChat>
                        </div>
                    </div>
                )}
                {
                    isLoading && (
                        <div className="flex flex-col gap-1 my-4">
                            <h4>Assistant</h4>
                            <div className="rounded max-w-12 mr-auto flex justify-center items-center p-1 font-semibold">
                                Loading...
                            </div>
                        </div>
                    )
                }
                <div ref={messagesEndRef} />
            </div>
            <div className="fixed bottom-0 left-64 right-0 max-w-3xl mx-auto bg-white border-t border-gray-200 rounded-lg">
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
};

export default ChatInterface;
