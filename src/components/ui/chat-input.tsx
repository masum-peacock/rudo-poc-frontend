'use client'
import { useRef, useState } from 'react';
import { Textarea } from './textarea';
import { Button } from './button';
import { Plus } from 'lucide-react';

interface ChatInputProps {
    onSend: ({ message, is_file, files }: { message: string, is_file: boolean, files: File[] }) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    console.log(["FILES"], files);
    const handleSend = () => {
        if (!message && !files.length) {
            return alert("Please put a valid text, or upload a file");
        }
        const data = { message, is_file: files.length > 0, files };
        console.log(data);
        onSend(data);
        setMessage("");
        setFiles([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("change", file);
        if (!file) return;

        // Check file type
        if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
            console.log("not valid file type");
            return alert("Please upload a .doc, .docx or .pdf file");
        }

        // Update files state with the new file
        setFiles((prevFiles) => [...prevFiles, file]);
        event.target.value = "";  // Reset the file input value to allow re-uploading of the same file if needed
    };

    const handleButtonClick = () => {
        console.log("clicked");
        fileInputRef.current?.click();
    };

    return (
        <div className="flex items-center gap-2 p-2 border-t border-gray-200 w-full rounded-lg">
            <div className="flex items-center w-full gap-x-4">
                <div className='h-full w-24 p-1 cursor-pointer'>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".doc,.pdf,.docx"
                        className="hidden"
                        aria-label="Upload .doc or .pdf file"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleButtonClick}
                        className="rounded w-20 h-20"
                    >
                        <Plus className="h-6 w-6" />
                        <span className="sr-only">Upload file</span>
                    </Button>
                </div>
                <Textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="resize-none w-full text-lg"
                    rows={2}
                />
            </div>
            <Button onClick={handleSend} className='h-20 w-32 font-bold text-lg'>Send</Button>
        </div>
    );
};

export default ChatInput;
