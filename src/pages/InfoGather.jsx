import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseURL, baseURLAI } from "../utils/base-url/baseURL";

const ChatBot = () => {
  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userHasSentMessage, setUserHasSentMessage] = useState(false);
  const [shows, setShows] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const userId = Cookies.get("userId");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [flow, setFlow] = useState("chat_flow");
  const [gender, setGender] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const userResponse = await fetch(`${baseURL}/users?user_id=${userId}`);
      const data = await userResponse.json();
      console.log("Fetched data:", data);

      setUserInfo(data); // Update state
      setLoading(false); // Loading complete
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data.");
      setLoading(false); // Ensure loading stops on error
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setError("User ID not found.");
      setLoading(false);
    }
  }, [userId]);

  // Log updated userInfo
  useEffect(() => {
    if (userInfo) {
      console.log("Updated userInfo:", userInfo);
    }
  }, [userInfo]);

  // ===========
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    Cookies.set("flow", "chat_flow");
  }, []);

  const showLoadingDots = () => {
    const loadingMessage = {
      sender: "bot",
      content:
        '<span class="loading-dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>',
      time: getCurrentTime(),
      isLoading: true,
    };
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);
  };

  const replaceLoadingMessage = (botContent) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.isLoading ? { ...msg, content: botContent, isLoading: false } : msg
      )
    );
  };

  const sendImage = async (file) => {
    setUserHasSentMessage(true);
    const fileUrl = URL.createObjectURL(file);
    const userImageMessage = {
      sender: "user",
      content: (
        <img src={fileUrl} alt="User Image" className="max-w-xs rounded-lg" />
      ),
      time: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, userImageMessage]);
    setLoading(true);

    showLoadingDots();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${baseURLAI}/upload_image?user_id=${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      replaceLoadingMessage(data.response);
    } catch (error) {
      replaceLoadingMessage("Error sending the image.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    messageContent,
    file,
    previewImage,
    displayMessage = true
  ) => {
    setLoading(true);

    if (displayMessage && messageContent && !file) {
      const userMessage = {
        sender: "user",
        img: previewImage,
        content: messageContent,
        time: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }

    showLoadingDots();

    try {
      const formData = new FormData();
      let query = "";

      if (file) {
        formData.append("file", file);
        query = "";
      } else {
        query = messageContent;
      }

      const response = await fetch(
        `${baseURLAI}/${flow}?user_id=${userId}&query=${query}&flow=true`,
        {
          method: "POST",
          body: file ? formData : null,
          headers: file ? {} : { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      setLoading(false);
      console.log(data);

      if (data?.event === "done") {
        setTimeout(() => {
          Cookies.set("onboarded", true);
          navigate("/chat-bot");
        }, 6000);
      }

      if (data?.event === "end") {
        Cookies.set("flow", "create_memory");
        setFlow("create_memory");
        Cookies.set("onboarded", true);
        Cookies.set("end", true);
        setShows(true);
      }

      // Process and clean response messages
      const responseMessages = data.response
        ?.split(/(?:\*{3}###\*{3}|###)/) // Split by `***###***` or `###`
        .map((msg) => msg.replace(/[*#]+/g, "").trim()) // Remove all occurrences of * and #
        .filter((msg) => msg); // Remove empty or whitespace-only strings

      // Remove the loading message entirely
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => !msg.isLoading)
      );

      // Add split messages as separate entries
      if (responseMessages.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...responseMessages.map((msg) => ({
            sender: "bot",
            content: msg,
            time: getCurrentTime(),
          })),
        ]);
      }
    } catch (error) {
      // Replace the loading message with an error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.isLoading
            ? {
                ...msg,
                content: "There was an error connecting to the server.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }

    setInputValue("");
    setSelectedImage(null);
  };

  const handleSend = () => {
    if (inputValue.trim() !== "" && !loading) {
      sendMessage(inputValue, null, null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !loading) {
      sendImage(file);
    }
  };

  useEffect(() => {
    sendMessage("START ONBOARDING", null, null, false);
  }, []);

  return (
    <div className="flex flex-col h-screen lg:h-[100%]  ">
      <div className=" fixed z-10 top-0 md:relative  pl-16 lg:hidden  bg-gradient-to-r  from-[#1FD899] to-[#0F6447] w-full   py-5  text-white font-medium flex justify-center items-center">
        <p>
          Just a reminder: I'm an AI companion chatbot here to support you, not
          a real person!
          {/* Chatbot */}
        </p>
      </div>
      <div className="flex-1  mt-20 md:mt-0 pt-8 lg:pt-0 flex flex-col overflow-hidden bg-white rounded-xl  ">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <h2 className="text-center text-[#003366]">Loading ...</h2>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {msg.sender === "user" ? (
                <div className="max-w-xs md:max-w-md">
                  <div className="bg-[#FFF8F8] py-2 px-4 rounded-lg break-words">
                    {typeof msg.content === "string" ? (
                      <p className="font-medium">{msg.content}</p>
                    ) : (
                      msg.content
                    )}
                    {msg.img && msg.img !== "undefined" && (
                      <div className="mt-2">
                        <img
                          src={msg.img}
                          alt="Preview"
                          className="h-40 w-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-right font-medium text-sm mt-1 text-[#858585]">
                    {msg.time}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-3 w-full">
                  <img
                    width={40}
                    src={
                      userInfo?.body?.ai_gender === "male"
                        ? "/male.svg"
                        : "/female.svg"
                    }
                    alt="bot icon"
                    className="self-end mb-5"
                  />
                  <div>
                    <div className="bg-[#FBFCEC] py-2 px-4 rounded-lg break-words">
                      <p
                        className="font-medium"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      ></p>
                    </div>
                    <p className="text-left text-sm font-medium text-[#858585] mt-1">
                      {msg.time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white px-12 py-4  lg:p-4 flex items-center gap-3 ">
          {shows && (
            <img
              className="w-[45px] lg:w-12 cursor-pointer"
              src="/cam.svg"
              alt="Upload Image"
              onClick={handleImageClick}
            />
          )}

          <input
            type="file"
            // accept="image/*"
            accept=".png, .jpg, .jpeg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />

          <div className=" w-full  flex items-center bg-[#F7F7F7]  px-4 py-3 rounded-2xl">
            <input
              type="text"
              ref={inputRef}
              className="w-full py-1 outline-none text-sm sm:text-base text-black font-medium bg-[#F7F7F7]"
              placeholder="Type here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading} className="ml-2">
              <img className="w-5 sm:w-6" src="/sent.svg" alt="send icon" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <a href="/privacy-policy" className="text-sm text-blue-500 underline">
          Privacy Notice
        </a>
      </div>

      {/* Animated Dots Styling */}
      <style jsx>{`
        .loading-dots {
          display: inline-block;
        }
        .dot {
          display: inline-block;
          font-size: 24px;
          line-height: 0;
          animation: bounce 0.6s infinite alternate;
          margin: 0 2px;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
