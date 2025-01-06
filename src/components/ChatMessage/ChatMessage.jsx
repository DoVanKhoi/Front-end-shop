import React from "react";
import { TbMessageChatbot } from "react-icons/tb";

const ChatMessage = (props) => {
    const { chat } = props;
    return (
        !chat.hideInChat && <>
            {chat.role === "model" ? (
                <div className="message bot-message flex gap-3">
                    <TbMessageChatbot className="size-9 p-1 mb-1 bg-violet-400 rounded-full fill-white flex-shrink-0 self-end" />
                    <p className={`message-text py-3 px-4 max-w-[75%] whitespace-pre-line text-base bg-white rounded-t-xl rounded-br-xl rounded-bl-sm ${chat.isError ? "text-red-600" : ""}`}>
                        {chat.text}
                    </p>
                </div>
            ) : (
                <div className="message user-message flex flex-col items-end">
                    <p className="message-text py-3 px-4 max-w-[75%] whitespace-pre-line text-base bg-violet-600 rounded-t-xl rounded-bl-xl rounded-br-sm text-white">
                        {chat.text}
                    </p>
                </div>
            )}
        </>
    )
};

export default ChatMessage;