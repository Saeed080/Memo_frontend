import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { baseURL } from "../utils/base-url/baseURL";
import { FaRegCalendarCheck } from "react-icons/fa";
import Cookies from "js-cookie";
const ChatBot = () => {
    const getCurrentTime = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedButton, setSelectedButton] = useState("");
    const [globalAction, setGlobalAction] = useState("");
    const [showButtons, setShowButtons] = useState(false);
    const [showEndOptioons, setShowEndOptions] = useState(false);
    const [disabledInput, setDisableInput] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [read_entry, setRead_entry] = useState([]);
    const [active, setActive] = useState("");

    // const { user } = useUser();
    const userId = Cookies.get("userId");
    const gender = Cookies.get("gender");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const formatDate = () => {
        const dateString = new Date();
        const date = new Date(dateString);

        // Get individual parts
        const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
        const day = date.toLocaleDateString("en-GB", { day: "numeric" });
        const month = date.toLocaleDateString("en-GB", { month: "long" });

        // Add the comma after the day
        return `${weekday}, ${day} ${month}`;
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const sendMessage = async (messageContent, action) => {

        console.log("Selected btn text", messageContent); // This will now have the correct value
        if (messageContent) {
            const newMessage = {
                sender: "user",
                content: messageContent,
                entry: null,
                end: undefined,
                encourage: undefined,
                entries: null,
                time: getCurrentTime(),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            setLoading(true);
            try {
                let response;
                const date = messageContent.trim();

                if (action === "read_entry") {
                    response = await fetch(
                        `${baseURL}/chat/${userId}?action=read_entry&&selected_entry_date=${encodeURIComponent(
                            messageContent
                        )}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                // action: "read_entry",
                            }),
                        }
                    );
                } else if (messageContent === "✏️ Write Diary") {
                    response = await fetch(
                        `${baseURL}/chat/${userId}?action=write_entry`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                action: "write_diary",
                                // selected_entry_date: formatDate()
                            }),
                        }
                    );
                } else if (messageContent === "📖 Read Diary Entries") {
                    response = await fetch(
                        `${baseURL}/chat/${userId}?action=read_entry`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                action: "read_entry",
                                // user_input: messageContent,
                                // selected_entry_date: formatDate()
                            }),
                        }
                    );
                } else if (messageContent === "🧠 Memory Exercise") {
                    response = await fetch(
                        `${baseURL}/chat/${userId}?action=memory_exercise`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                action: "memory_exercise",
                            }),
                        }
                    );
                } else if (messageContent === "❌ End Chat") {
                    response = await fetch(
                        `${baseURL}/chat/${userId}?action=end_conversation`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                action: "end_conversation",
                            }),
                        }
                    );
                } else {
                    response = await fetch(
                        `${baseURL}/chat/${userId}?action=${globalAction}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                user_input: messageContent,
                                action: globalAction
                            }),
                        }
                    );
                }

                const data = await response.json();
                setRead_entry(data?.entries);
                setDisableInput(data.input)

                if (data.conversation_history.length > 2) {
                    setMessages(data.conversation_history)
                } else {
                    // Handle bot's response
                    const botReply = {
                        sender: "bot",
                        content: ((data.response === "success") ? `What would you like to do next? You can look at other diary entries, write today’s diary, try a memory exercise, or if you're finished, end our chat. 😊` : data.response) || "Sorry, I couldn't process your request.",
                        entry: data.entry || undefined,
                        end: data.end || undefined,
                        entries: data.entries || undefined,
                        encourage: data.encourage || undefined,
                        picture: data.picture || undefined,
                        question: data.question || undefined,
                        input: data.input || undefined,
                        time: getCurrentTime(),
                    };
                    const botReplyForOptions = {
                        sender: "bot",
                        content: ((data?.end === "success" && !data.reminder && !data.picture) ? `What would you like to do next? You can look at other diary entries, write today’s diary, try a memory exercise, or if you're finished, end our chat. 😊` : data.response) || "Sorry, I couldn't process your request.",
                        entry: undefined,
                        end: data.end || undefined,
                        entries: undefined,
                        encourage: data.encourage || undefined,
                        picture: data.picture || undefined,
                        question: data.question || undefined,
                        input: data.input || undefined,
                        time: getCurrentTime(),
                    };
                    const botReplyForOptionsME = {
                        sender: "bot",
                        content: ((data?.end === "success" && !data.reminder && data.picture) ? `What would you like to do next? You can look at other diary entries, write today’s diary, try a memory exercise, or if you're finished, end our chat. 😊` : data.response) || "Sorry, I couldn't process your request.",
                        entry: undefined,
                        end: data.end || undefined,
                        entries: undefined,
                        encourage: undefined,
                        picture: undefined,
                        question: data.question || undefined,
                        input: data.input || undefined,
                        time: getCurrentTime(),
                    };
                    const botReplyForOptionsRead = {
                        sender: "bot",
                        content: ((data?.end === "success" && data.reminder) ? data.reminder : data.response) || "Sorry, I couldn't process your request.",
                        entry: undefined,
                        end: data.end || undefined,
                        entries: undefined,
                        encourage: data.encourage || undefined,
                        picture: data.picture || undefined,
                        question: data.question || undefined,
                        input: data.input || undefined,
                        time: getCurrentTime(),
                    };
                    if (data?.response !== "success") {
                        setMessages((prevMessages) => [...prevMessages, botReply]);
                    }

                    if (data?.end === "success" && !data.reminder && data.picture) {
                        setTimeout(() => {
                            setMessages((prevMessages) => [...prevMessages, (data?.end === "success" && botReplyForOptionsME)]);
                            setShowEndOptions(true)
                            setGlobalAction("")
                        }, 2000); // 2000 ms = 2 seconds
                    }
                    if (data?.end === "success" && !data.reminder && !data.picture) {
                        setTimeout(() => {
                            setMessages((prevMessages) => [...prevMessages, (data?.end === "success" && botReplyForOptions)]);
                            setShowEndOptions(true)
                            setGlobalAction("")
                        }, 2000); // 2000 ms = 2 seconds
                    }
                    if (data?.end === "success" && data.reminder) {
                        setTimeout(() => {
                            setMessages((prevMessages) => [...prevMessages, (data?.end === "success" && botReplyForOptionsRead)]);
                            setShowEndOptions(true)
                            setGlobalAction("")
                        }, 2000); // 2000 ms = 2 seconds
                    }
                    if (data.response === "success") {
                        setShowEndOptions(true)
                        setGlobalAction("")
                    } else if (data.reminder) {
                        setTimeout(() => {
                            setShowEndOptions(true)
                            setGlobalAction("")
                        }, 2500)
                    } else {
                        setShowEndOptions(false)
                    }

                }

            } catch (error) {
                const errorMessage = {
                    sender: "bot",
                    content: "There was an error connecting to the server.",
                    entry: data.entry || undefined,
                    entries: data.entries || undefined,
                    input: data.input || undefined,
                    time: getCurrentTime(),
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);

            } finally {
                setLoading(false); // Reset loading state
            }

            setInputValue("");
        }
    };

    const handleButtonClick = (text) => {
        setSelectedButton(text);
        setActive(text);

        // Trigger API request based on the selected button
        if (text === "✏️ Write Diary" || text === "📖 Read Diary Entries" || text === "🧠 Memory Exercise") {
            sendMessage(text); // Pass the selected button as an argument
        } else {
            sendMessage(text); // Pass both message content and selected button as arguments
        }

        if (text === "✏️ Write Diary") {
            setGlobalAction('write_entry')
        } else if (text === "📖 Read Diary Entries") {
            setGlobalAction('read_entry')
        } else if (text === "🧠 Memory Exercise") {
            setGlobalAction('memory_exercise')
        }
        setShowButtons(false); // Hide buttons after clicking one
    };

    const loadInitialMessage = async () => {
        try {
            let response;

            response = await fetch(
                `${baseURL}/greet/${userId}`,
                {
                    method: "GEt",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const data = await response.json();
            setMessages((prevMessages) => [...prevMessages, {
                sender: "bot",
                entry: null,
                end: undefined,
                entries: null,
                content: data.body,
                input: data.input || undefined,
                time: getCurrentTime(),
            }]);

            if (data.conversation_history.length > 1) {
                setMessages(data.conversation_history)
            } else {
                setTimeout(() => {
                    setMessages((prevMessages) => [...prevMessages, {
                        sender: "bot",
                        entry: null,
                        entries: null,
                        content: `Tell me, what would you like to do today? You can write in
      your diary, read your previous diary entries or do a memory
       exercise.`,
                        input: data.input || undefined,
                        time: getCurrentTime(),
                    }]);

                }, 1000)
            }
            setTimeout(() => {
                setShowButtons(true)
            }, 2000)
            setDisableInput(data.input)

        } catch (error) {
            const errorMessage = {
                sender: "bot",
                content: "There was an error connecting to the server.",
                entry: undefined,
                entries: undefined,
                input: undefined,
                time: getCurrentTime(),
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false); // Reset loading state
        }
    }
    useEffect(() => {

        loadInitialMessage()
    }, [])
    return (
        <div className="flex flex-col h-screen lg:h-[100%]">
            {/* Top Bar */}
            <div className=" pl-16 bg-gradient-to-r w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-2 mx-auto text-white font-medium flex justify-center items-center">
                <p className="">
                    Just a reminder: I'm an AI companion chatbot here to support you, not
                    a real person!
                </p>
            </div>

            <div className="flex-1 pt-8 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
                {/* Chat Messages */}
                <div className="flex-1 mx-4 pr-4 flex flex-col overflow-y-auto">
                    {messages.length === 0 && <h2 className="text-center text-[#003366]">Loading ...</h2>}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"
                                } mb-4`}
                        >
                            {console.log("asas", msg, "idx", index)}

                            {msg.sender === "user" ? (
                                <div className="flex flex-col">
                                    <div className="bg-[#FFF8F8] py-2 px-5 rounded-lg relative">
                                        <p className="font-medium ">{(msg.content === "read_entry" ? "📖 Read Diary Entries" : (msg.content === "write_entry" ? "✏️ Write Diary" : (msg.content === "memory_exercise" ? "🧠 Memory Exercise" : msg.content)))}</p>
                                    </div>
                                    <p className="text-right font-medium text-sm mt-2 text-[#858585] ">
                                        {msg.time}
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="flex items-center space-x-5">
                                        <img
                                            width={40}
                                            src={gender === "male" ? "/male.svg" : "/female.svg"}
                                            alt="bot icon"
                                        />
                                        <div className="flex flex-col">
                                            <div className="bg-[#FBFCEC] py-2 px-5 rounded-lg relative">
                                                <p className="font-medium  ">
                                                    {/* {msg.content} */}
                                                    <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                                                    {msg.entry && (
                                                        <>
                                                            <div dangerouslySetInnerHTML={{ __html: msg.entry }}></div>
                                                        </>
                                                    )}
                                                    {msg.picture && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={msg.picture}
                                                                alt="Preview"
                                                                className="h-auto max-w-60 object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    {msg.question && (
                                                        <>
                                                            <br /> {msg.question}
                                                        </>
                                                    )}
                                                    {msg.encourage && (
                                                        <>
                                                            <br /> {msg.encourage}
                                                        </>
                                                    )}
                                                </p>
                                                <ul className="mt-2">
                                                    {msg.entries &&
                                                        active === "📖 Read Diary Entries" &&
                                                        msg.entries?.map((item, index) => {
                                                            return (
                                                                <li
                                                                    onClick={() =>
                                                                        sendMessage(item, "read_entry")
                                                                    }
                                                                    key={index}
                                                                    className="flex gap-4   cursor-pointer"
                                                                >
                                                                    📅 {item}
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            </div>

                                            {(index > 0) || msg.sender === "user" ? (
                                                <p className="text-left text-sm font-medium  text-[#858585] mt-2 ">
                                                    {msg.time}
                                                </p>
                                            ) : null}
                                        </div>
                                        {/* display message for option if end = sucess */}
                                        {/* {
                      msg.end && (
                        <div className="flex flex-col">
                          <div className="bg-[#FBFCEC] py-2 px-5 rounded-lg relative">
                            <p className="font-medium  ">
                              Thank you for sharing you info and using this chat bot..
                              What would you like to do next?
                            </p>
                          </div>
                        </div>
                      )
                    } */}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />

                    {/* Display Buttons */}
                    {showButtons && (
                        <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 mb-4 items-start lg:mt-1 ml-16 lg:space-x-3">
                            {["✏️ Write Diary", "📖 Read Diary Entries", "🧠 Memory Exercise"].map(
                                (buttonText) => (
                                    <button
                                        key={buttonText}
                                        //    ? "bg-blue-500 text-white"
                                        //    : "bg-white"
                                        className={`border-[1px] border-[#C9C9C9] font-medium py-2 px-5 rounded-full ${selectedButton === buttonText
                                            ? "bg-blue-500 text-white"
                                            : "bg-white"
                                            }`}
                                        onClick={() => handleButtonClick(buttonText)}
                                        disabled={loading} // Disable buttons when loading
                                    >
                                        {buttonText}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                    {/* Display End Options */}
                    {showEndOptioons && (
                        <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 mb-4  items-start lg:mt-1 ml-16 lg:space-x-3">
                            {["✏️ Write Diary", "📖 Read Diary Entries", "🧠 Memory Exercise", "❌ End Chat"].map(
                                (buttonText) => (
                                    <button
                                        key={buttonText}
                                        className={`border-[1px] border-[#C9C9C9] font-medium py-2 px-5 rounded-full ${selectedButton === buttonText
                                            ? "bg-white"
                                            : "bg-white"
                                            }`}
                                        onClick={() => handleButtonClick(buttonText)}
                                        disabled={loading} // Disable buttons when loading
                                    >
                                        {buttonText}
                                    </button>
                                )
                            )}
                        </div>
                    )}

                    {/* Display Latest Message's Time */}
                    {showButtons && messages.length > 0 && (
                        <p className="text-left text-sm ml-14 font-medium  text-[#858585] mt-3">
                            {messages[messages.length - 1].time}
                        </p>
                    )}
                </div>

                {/* Message Input */}
                {(showEndOptioons === false && showButtons === false && disabledInput !== "False") && (
                    <div className="py-3 flex items-center gap-2 lg:gap-4 lg:mx-4 ">
                        <img width={50} src="/cam.svg" />
                        <div className="flex-1 flex items-center bg-[#F7F7F7]  lg:px-10 py-3 rounded-2xl ">
                            <input
                                type="text"
                                ref={inputRef}
                                className="flex-1 outline-none  text-[#8D8D8D] font-medium bg-[#F7F7F7] "
                                placeholder="Type your message here..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && !loading && sendMessage(inputValue)
                                } // Check if not loading
                                disabled={loading} // Disable input when loading
                            />
                            <div className="flex gap-8">
                                <img width={20} src="/mike.svg" />
                                <button
                                    onClick={() => !loading && sendMessage(inputValue)}
                                    disabled={loading}
                                >
                                    {" "}
                                    {/* Check if not loading */}
                                    <img width={20} src="/sent.svg" alt="send icon" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ChatBot;
