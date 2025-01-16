"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Send, Plus } from "lucide-react"
import { useAtom } from "jotai"
import { userAtom } from "@/state/auth"
import { chatsAtom, messagesAtom, currentChatAtom, Message } from "@/state/chat"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function ChatPage() {
  const [user] = useAtom(userAtom);
  const [chats, setChats] = useAtom(chatsAtom);
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  if(!user){
    alert("you must be logged in to chat")
    router.push('/')
  }

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Fetch initial chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/v1/chats", {
          headers: {
            "user-id": user?.user_id.toString() || "",
          },
        });
        const data = await response.json();
        setChats(data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, setChats]);

  // Handle current chat changes
  useEffect(() => {
    if (!currentChat) return;

    const fetchMessages = async () => {
      try {
        const response = await axios(`http://localhost:3000/api/v1/chats/${currentChat.id}`);
        const data = response.data
        setMessages(data.messages);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Join chat room and fetch messages
    socketRef.current?.emit("joinChat", currentChat.id);
    fetchMessages();

    // Listen for new messages
    socketRef.current?.on("getMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.emit("leaveChat", currentChat.id);
    };
  }, [currentChat, setMessages]);

  // Handle sending messages
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/chats/${currentChat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage,
          userId: user?.user_id,
        }),
      });

      if (response.ok) {
        setNewMessage(""); // Clear input
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Chats Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chats</h2>
              <Button size="icon" variant="ghost">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentChat?.id === chat.id ? "bg-gray-50" : ""
                }`}
                onClick={() => setCurrentChat(chat)}
              >
                <div className="flex items-center space-x-3">
                  <UserAvatar
                    user={chat.users.find((u) => u.user.user_id !== user?.user_id)?.user}
                  />
                  <div>
                    <p className="font-medium">
                      {chat.users.find((u) => u.user.user_id !== user?.user_id)?.user
                        .first_name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1]?.text ||
                        "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <UserAvatar
                    user={
                      currentChat.users.find((u) => u.user.user_id !== user?.user_id)
                        ?.user
                    }
                  />
                  <div>
                    <p className="font-medium">
                      {
                        currentChat.users.find(
                          (u) => u.user.user_id !== user?.user_id
                        )?.user.first_name
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-16rem)] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.userId === user?.user_id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.userId === user?.user_id
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.userId === user?.user_id
                              ? "text-emerald-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form
                onSubmit={sendMessage}
                className="p-4 border-t flex items-center space-x-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
