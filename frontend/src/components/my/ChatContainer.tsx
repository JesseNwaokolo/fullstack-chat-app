import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      (messageEndRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-black">
        {messages.map((message) => (
          <div
            key={message._id}
            className={` ${
              message.senderId === selectedUser?._id ? "mr-auto" : "ml-auto"
            }`}
            ref={messageEndRef}
          >
            <div
              className={`flex items-center gap-2  ${
                message.senderId === authUser?._id ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={
                  message.senderId === selectedUser?._id
                    ? selectedUser?.profilePic || "/avatar.png"
                    : authUser?.profilePic || "/avatar.png"
                }
                alt="profile pic"
                className="size-6 rounded-full"
              />

              <div
                className={` flex flex-col gap-1  p-1 rounded-md max-w-md  ${
                  message.senderId == authUser?._id
                    ? "bg-gray-300"
                    : "bg-gray-400"
                } `}
              >
                <span className="text-xs opacity-50 self-end">
                  {formatMessageTime(message.createdAt)}
                </span>

                <div className="flex flex-col ">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="attachment"
                      className="sm:max-w-[200px] rounded-md my-2 size-20"
                    />
                  )}

                  {message.text && <p className="break-words">{message.text}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
