import { useRef } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

const ChatForm = (props) => {
    const { chatHistory, setChatHistory, generateBotResponse } = props;
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        setTimeout(() => {

            setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

            generateBotResponse([...chatHistory, { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` }]);
        }, 600);

    }

    return (
        <form action="#" className="chat-form flex items-center bg-white outline outline-1 rounded-3xl focus-within:outline-violet-600 shadow-sm" onSubmit={(e) => handleFormSubmit(e)}>
            <input ref={inputRef} type="text" placeholder="Message..." className="message-input border-none outline-none w-full bg-none h-12 px-4 text-base" required />
            <button className="size-9 mr-2 border-none outline-none text-lg bg-violet-600 hover:bg-violet-700 rounded-full flex-shrink-0 flex items-center justify-center"><MdKeyboardArrowUp className="text-white" /></button>
        </form>
    );
};

export default ChatForm;