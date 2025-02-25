import "regenerator-runtime/runtime";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { baseURL, baseURLAI } from "../utils/base-url/baseURL";

const ChatBot = () => {
  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userHasSentMessage, setUserHasSentMessage] = useState(false);
  const [gender, setGender] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [flow, setFLow] = useState("chat_flow");
  const [chat, setChat] = useState("chat_flow");
  const [flag, setFlag] = useState(false);
  const [chatboxDisable, setChatboxDisable] = useState(false);

  const [error, setError] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isRecording, setIsRecording] = useState(false);

  const userId = Cookies.get("userId");
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  const currentDate = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Format the date
  const localeDate = currentDate.toLocaleString("en-US", options);

  // Adjust formatting for the desired output
  const formattedDate = localeDate
    .replace(/, (\d)/, ", $1") // Ensure proper spacing after the day
    .replace(", ", ", ") // Maintain consistent commas
    .replace(/, ([0-9]+:[0-9]{2} [AP]M)$/, " at $1") // Add "at" before the time
    .replace(/(\d{4})/, "$1,"); // Add a comma after the year

  console.log("ass", formattedDate);

  const handleStartListening = () => {
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleCancelListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
    setInputValue("");
    resetTranscript();
  };

  useEffect(() => {
    setInputValue(transcript);
  }, [transcript]);
  useEffect(() => {
    setChatboxDisable(false);
  }, []);

  useEffect(() => {
    if (!listening && isRecording) {
      setIsRecording(false);
      if (inputValue.trim()) {
        setUserHasSentMessage(true);
        sendMessage(inputValue);
        setInputValue("");
        resetTranscript();
      }
    }
  }, [listening, isRecording]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, diaryEntries]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await fetch(`${baseURL}/users?user_id=${userId}`);
        const data = await userResponse.json();
        console.log(data);
        if (data && data) {
          setGender(data?.body?.ai_gender.toLowerCase());
        } else {
          setGender("");
        }
        setUserInfo(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setError("User ID not found.");
      setLoading(false);
    }
  }, [userId]);

  function timeForGreeting() {
    const date = new Date();

    // Define arrays for formatting
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const suffixes = ["th", "st", "nd", "rd"];

    // Get date parts
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Determine the correct suffix
    const suffix =
      day % 10 === 1 && day !== 11
        ? suffixes[1]
        : day % 10 === 2 && day !== 12
        ? suffixes[2]
        : day % 10 === 3 && day !== 13
        ? suffixes[3]
        : suffixes[0];

    // Format time
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Combine into the desired format
    return `${day}${suffix} ${month} ${year} ${hours}:${minutes} ${period}`;
  }

  useEffect(() => {
    const fetchGreeting = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURLAI}/greet?user_id=${userId}&date_time=${timeForGreeting()}`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
        console.log(data);
        setMessages([
          {
            sender: "bot",
            content: data.response || "Hello! How may I assist you today?",
            time: getCurrentTime(),
          },
        ]);
        setShowButtons(true);
      } catch (error) {
        setMessages([
          {
            sender: "bot",
            content: "There was an error connecting to the server.",
            time: getCurrentTime(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("en-GB", options);
  };

  // const sendMessage = async (messageContent) => {
  //   setFLow("chat_flow");
  //   let innerFlow = "chat_flow";

  //   if (!messageContent.trim()) return;

  //   setDiaryEntries([]);
  //   setUserHasSentMessage(true);

  //   const userMessage = {
  //     sender: "user",
  //     content: messageContent,
  //     time: getCurrentTime(),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, userMessage]);
  //   setInputValue("");
  //   setLoading(true);
  //   const loadingMessage = {
  //     sender: "bot",
  //     content:
  //       '<span class="loading-dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>',
  //     time: getCurrentTime(),
  //   };
  //   const loadingMsgIndex = messages.length + 1;
  //   setMessages((prevMessages) => [...prevMessages, loadingMessage]);

  //   try {
  //     const query = encodeURIComponent(messageContent);
  //     const response = await fetch(
  //       `${baseURLAI}/${chat}?user_id=${userId}&query=${query}&time=${formattedDate}`,
  //       {
  //         method: "POST",
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data);

  //     setMessages((prevMessages) => {
  //       const newMessages = [...prevMessages];
  //       newMessages.splice(loadingMsgIndex, 1);
  //       return newMessages;
  //     });

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         sender: "bot",
  //         content: data.response,
  //         time: getCurrentTime(),
  //       },
  //     ]);

  //     if (data.event === "end") {
  //       setChat("chat_flow");
  //     }
  //     if (
  //       data.event === "end" ||
  //       (active === "🧠 Memory Exercise" && data.event === "N/A")
  //     ) {
  //       setShowButtons(true);
  //       setFlag(true);
  //     } else {
  //       setShowButtons(false);
  //       setFlag(false);
  //     }
  //   } catch (error) {
  //     setMessages((prevMessages) => {
  //       const newMessages = [...prevMessages];
  //       return newMessages.filter((msg, i) => i !== loadingMsgIndex);
  //     });

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         sender: "bot",
  //         content: "There was an error processing your request.",
  //         time: getCurrentTime(),
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const sendImage = async (file) => {
    setUserHasSentMessage(true);

    const fileUrl = URL.createObjectURL(file);
    const userImageMessage = {
      sender: "user",
      content: `<img src="${fileUrl}" alt="User Image" style="max-width: 200px; border-radius: 10px;" />`,
      time: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, userImageMessage]);
    setLoading(true);
    const loadingMessage = {
      sender: "bot",
      content:
        '<span class="loading-dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>',
      time: getCurrentTime(),
    };
    const loadingMsgIndex = messages.length + 1;
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

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
      console.log(data);

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.splice(loadingMsgIndex, 1);
        return newMessages;
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          content: data.response,
          time: getCurrentTime(),
        },
      ]);

      if (
        data.event === "end" ||
        (active === "🧠 Memory Exercise" && data.event === "N/A")
      ) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    } catch (error) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        return newMessages;
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          content: "Error sending the image.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageContent) => {
    setFLow("chat_flow");
    let innerFlow = "chat_flow";

    if (!messageContent.trim()) return;

    setDiaryEntries([]);
    setUserHasSentMessage(true);

    const userMessage = {
      sender: "user",
      content: messageContent,
      time: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setLoading(true);

    const loadingMessage = {
      sender: "bot",
      content:
        '<span class="loading-dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>',
      time: getCurrentTime(),
    };
    const loadingMsgIndex = messages.length + 1;
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

    try {
      const query = encodeURIComponent(messageContent);
      const response = await fetch(
        `${baseURLAI}/${chat}?user_id=${userId}&query=${query}&time=${formattedDate}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log(data);

      // Remove the loading message entirely
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.splice(loadingMsgIndex, 1);
        return newMessages;
      });

      // Split the response messages and process them
      const responseMessages = data.response
        ?.split(/(?:\*{3}###\*{3}|###)/) // Split by `***###***` or `###`
        .map((msg) => msg.replace(/[*#]+/g, "").trim()) // Remove all occurrences of * and #
        .filter((msg) => msg); // Remove empty or whitespace-only strings

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

      if (data.event === "end") {
        setChat("chat_flow");
      }
      if (
        data.event === "end" ||
        (active === "🧠 Memory Exercise" && data.event === "N/A")
      ) {
        setShowButtons(true);
        setFlag(true);
      } else {
        setShowButtons(false);
        setFlag(false);
      }
    } catch (error) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        return newMessages.filter((msg, i) => i !== loadingMsgIndex);
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          content: "There was an error processing your request.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const endChat = async (text) => {
    setChatboxDisable(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        content: "❌ End Chat",
        time: getCurrentTime(),
      },
    ]);
    setLoading(true);

    setActive(text);
    const loadingMessage = {
      sender: "bot",
      content:
        '<span class="loading-dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>',
      time: getCurrentTime(),
    };

    // Remove any existing loading messages
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.content !== loadingMessage.content)
    );

    const loadingMsgIndex = messages.length;
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

    const query = "end chat";
    const response = await fetch(
      `${baseURLAI}/${chat}?user_id=${userId}&query=${query}&time=${formattedDate}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    setLoading(false);
    console.log(data);

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      return newMessages;
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        content: data.response,
        time: getCurrentTime(),
      },
    ]);
    setMessages((prevMessages) => [
      ...prevMessages.filter((msg) => msg.content !== loadingMessage.content),
    ]);
    setLoading(false);
    setShowButtons(false);
  };

  // const handleEntryClick = async (entry) => {
  //   setShowButtons(false);
  //   setUserHasSentMessage(true);
  //   console.log({ entry });

  //   const userMessageText = `Read the entry from ${
  //     entry.datetime ? entry.datetime : entry.created_at
  //   }`;
  //   const userMessage = {
  //     sender: "user",
  //     content: userMessageText,
  //     time: getCurrentTime(),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, userMessage]);
  //   setLoading(true);

  //   try {
  //     setMessages((prevMessages) => [...prevMessages]);

  //     setMessages((prevMessages) => {
  //       const newMessages = [...prevMessages];
  //       // newMessages.splice(loadingMsgIndex, 1);
  //       return newMessages;
  //     });

  //     // Remove HTML tags from entry.entry
  //     const sanitizeHTML = (html) => {
  //       const doc = new DOMParser().parseFromString(html, "text/html");
  //       return doc.body.textContent || "";
  //     };

  //     const sanitizedEntry = sanitizeHTML(entry.entry);

  //     setDiaryEntries([]);
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         sender: "bot",
  //         content: sanitizedEntry,
  //         time: getCurrentTime(),
  //       },
  //     ]);
  //     setTimeout(() => {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           sender: "bot",
  //           content: `${
  //             userInfo?.body?.name
  //           } you have just revisited your diary entry from ${
  //             entry.datetime ? entry.datetime : entry.created_at
  //           }📖. `,
  //           time: getCurrentTime(),
  //         },
  //       ]);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           sender: "bot",
  //           content: `What would you like to do next? You can write in your diary, read another entry, try a memory exercise, or end our chat.  `,
  //           time: getCurrentTime(),
  //         },
  //       ]);

  //       setFlag(true);
  //       setShowButtons(true);
  //     }, 3000);

  //     // setShowButtons(true);
  //   } catch (error) {
  //     setMessages((prevMessages) => {
  //       const newMessages = [...prevMessages];
  //       newMessages.pop();
  //       return newMessages;
  //     });

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         sender: "bot",
  //         content: "Error retrieving the diary entry.",
  //         time: getCurrentTime(),
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleEntryClick = async (entry) => {
    console.log("data:", entry);
    fetch(`${baseURL}/metrics_log_diary?diary_id=${entry?.entry_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error("Failed to fetch diary metrics:", error));

    setShowButtons(false);
    setUserHasSentMessage(true);

    const userMessageText = `Read the entry from ${
      entry.datetime ? entry.datetime : entry.created_at
    }`;
    const userMessage = {
      sender: "user",
      content: userMessageText,
      time: getCurrentTime(),
    };

    try {
      const sanitizeHTML = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
      };

      const sanitizedEntry = sanitizeHTML(entry.entry);
      setDiaryEntries([]);

      // First add the user message and diary entry
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        {
          sender: "bot",
          content: sanitizedEntry,
          time: getCurrentTime(),
        },
      ]);

      // Clear any existing timeouts
      if (window.entryMessageTimeout) {
        clearTimeout(window.entryMessageTimeout);
      }

      // Create a flag to track if we've added follow-up messages
      let hasAddedFollowUp = false;

      // Add follow-up messages after delay
      window.entryMessageTimeout = setTimeout(() => {
        if (!hasAddedFollowUp) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "bot",
              content: `${
                userInfo?.body?.name
              } you have just revisited your diary entry from ${
                entry.datetime ? entry.datetime : entry.created_at
              }📖. `,
              time: getCurrentTime(),
            },
            {
              sender: "bot",
              content: `What would you like to do next? You can write in your diary, read another entry, try a memory exercise, or end our chat.  `,
              time: getCurrentTime(),
            },
          ]);
          hasAddedFollowUp = true;
        }

        setFlag(true);
        setShowButtons(true);
      }, 3000);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          content: "Error retrieving the diary entry.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = async (text) => {
    setUserHasSentMessage(true);
    setActive(text);
    setShowButtons(false);

    setDiaryEntries([]);
    if (text === "✏️ Write Diary") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          content: "✏️ Write Diary",
          time: getCurrentTime(),
        },
      ]);
    }
    if (text === "📖 Read Diary Entries") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          content: "📖 Read Diary Entries",
          time: getCurrentTime(),
        },
      ]);
    }
    if (text === "🧠 Memory Exercise") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          content: "🧠 Memory Exercise",
          time: getCurrentTime(),
        },
      ]);
    }

    setLoading(true);
    const loadingMessage = {
      sender: "bot",
      content:
        '<span class="loading-dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>',
      time: getCurrentTime(),
    };

    // Remove any existing loading messages
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.content !== loadingMessage.content)
    );

    const loadingMsgIndex = messages.length;
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

    try {
      // ============

      if (text === "📖 Read Diary Entries") {
        const response = await fetch(
          `${baseURL}/fetch/entry?user_id=${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("data:", data);

        if (data.data.length === 0) {
          setFlag(true);
        }

        if (
          data.status === 200 &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setDiaryEntries(data.data);

          const entriesList = data.data
            .map(
              (entry, index) =>
                `<button 
                  id="entry-btn-${index}" 
                  class="diary-entry-btn" 
                  data-index="${index}"
                >
                      📅 ${
                        entry?.datetime
                          ? entry?.datetime
                          : formatDate(entry.created_at)
                      }
                </button>`
            )
            .join("<br>");

          const botReply = {
            sender: "bot",
            content: `
              <div>
                Here are your diary entries. Click on any entry to read it:
                <div class="diary-entries-list">${entriesList}</div>
              </div>
            `,
            time: getCurrentTime(),
          };

          setMessages((prevMessages) => [
            ...prevMessages.filter(
              (msg) => msg.content !== loadingMessage.content
            ),
            botReply,
          ]);

          document.addEventListener("click", (event) => {
            const button = event.target.closest(".diary-entry-btn");
            if (button) {
              const index = button.getAttribute("data-index");
              handleEntryClick(data.data[index]);
            }
          });

          setShowButtons(false);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages.filter(
              (msg) => msg.content !== loadingMessage.content
            ),
            {
              sender: "bot",
              content: "No diary entries found.",
              time: getCurrentTime(),
            },
          ]);
          setShowButtons(true);
        }
      } else {
        let innerFlow;
        if (text === "✏️ Write Diary") {
          setFLow("write_diary");
          innerFlow = "write_diary";
        }
        if (text === "🧠 Memory Exercise") {
          setFLow("chat_flow");
          innerFlow = "chat_flow";
        }

        const query = encodeURIComponent(
          `Start The Flow ${text.replace(/✏️ |📖 |🧠 /, "")}`
        );

        console.log(innerFlow);
        const dateNew = encodeURIComponent(formattedDate);

        const response = await fetch(
          `${baseURLAI}/${innerFlow}?user_id=${userId}&time=${formattedDate}&query=${query}`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
        console.log(data);

        // Remove loading message from messages
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg !== loadingMessage)
        );

        // Split messages and remove unwanted symbols
        const responseMessages = data.response
          .split(/(?:\*{3}###\*{3}|###)/) // Split by `***###***` or `###`
          .map((msg) => msg.replace(/[*#]+/g, "").trim()) // Remove all occurrences of * and #
          .filter((msg) => msg); // Remove empty or whitespace-only strings

        // Add split messages as separate entries
        if (responseMessages.length > 0) {
          setMessages((prevMessages) => [
            ...prevMessages.filter(
              (msg) => msg.content !== loadingMessage.content
            ),
            ...responseMessages.map((msg) => ({
              sender: "bot",
              content: msg,
              time: getCurrentTime(),
            })),
          ]);
        }

        if (data.event === "write diary") {
          setChat("write_diary");
        }

        if (
          data.event === "end" ||
          (text === "🧠 Memory Exercise" && data.event === "N/A") ||
          data.event === "n/a"
        ) {
          setShowButtons(true);
          setFlag(true);
        } else {
          setShowButtons(false);
          setFlag(false);
        }
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.content !== loadingMessage.content),
        {
          sender: "bot",
          content: "There was an error processing your request.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex  flex-col  h-screen lg:h-[100%]">
      {/* Top Bar */}
      <div className="fixed z-10 top-0 md:relative  pl-16 bg-gradient-to-r  lg:w-auto w-full from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-4 lg:py-2 mx-auto text-white font-medium flex justify-center items-center">
        <p>
          Just a reminder: I'm an AI companion chatbot here to support you, not
          a real person!
        </p>
      </div>

      <div className="flex-1 mt-20 md:mt-0 pt-8 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
        {/* Chat Messages */}
        <div className="flex-1 mx-4 pr-4 flex flex-col overflow-y-auto">
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
                <div className="flex flex-col">
                  <div
                    className="bg-[#FFF8F8] py-2 px-5 rounded-xl relative"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  ></div>
                  <p className="text-right font-medium text-sm mt-2 text-[#858585] ">
                    {msg.time}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center space-x-5">
                    <img
                      width={40}
                      // className="self-end mb-7"
                      className="self-end mb-7"
                      src={
                        userInfo?.body?.ai_gender === "male"
                          ? "male.svg"
                          : "female.svg"
                      }
                      alt="bot icon"
                    />
                    <div className="flex flex-col">
                      <div
                        className="bg-[#FBFCEC] py-2 px-5 rounded-xl relative font-medium"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      ></div>
                      <p className="text-left text-sm font-medium text-[#858585] mt-2 ">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {showButtons && (
            <div className="flex flex-wrap gap-2 -mt-2 ml-16">
              <button
                className={`border-[1px] border-[#C9C9C9] font-medium py-2 px-5 rounded-xl transition disabled:opacity-50 `}
                onClick={() => handleButtonClick("✏️ Write Diary")}
                disabled={loading}
              >
                {loading && active === "✏️ Write Diary"
                  ? "Loading..."
                  : "✏️ Write Diary"}
              </button>

              <button
                className={`border-[1px] border-[#C9C9C9] font-medium py-2 px-5 rounded-xl transition disabled:opacity-50 `}
                onClick={() => handleButtonClick("📖 Read Diary Entries")}
                disabled={loading}
              >
                {loading && active === "📖 Read Diary Entries"
                  ? "Loading..."
                  : "📖 Read Diary Entries"}
              </button>

              <button
                className={`border-[1px] border-[#C9C9C9] font-medium py-2 px-5 rounded-xl transition disabled:opacity-50 `}
                onClick={() => handleButtonClick("🧠 Memory Exercise")}
                disabled={loading}
              >
                {loading && active === "🧠 Memory Exercise"
                  ? "Loading..."
                  : "🧠 Memory Exercise"}
              </button>
              {flag && (
                <button
                  className={`border-[1px] border-[#C9C9C9] font-medium py-2 px-5 rounded-xl transition disabled:opacity-50 `}
                  onClick={() => endChat("❌ End Chat")}
                  disabled={loading}
                >
                  {loading && active === "❌ End Chat"
                    ? "Loading..."
                    : "❌ End Chat"}
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="py-3 lg:mx-4 flex flex-col gap-2">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2 lg:gap-4 w-full">
              <div className="flex-1 flex items-center bg-[#F7F7F7] px-4 lg:px-10 py-3 rounded-2xl relative">
                <input
                  type="text"
                  ref={inputRef}
                  className="flex-1 py-1 outline-none text-black font-medium bg-[#F7F7F7]"
                  placeholder="Type here...."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading && inputValue.trim()) {
                      setUserHasSentMessage(true);
                      sendMessage(inputValue);
                    }
                  }}
                  disabled={loading || chatboxDisable}
                />

                {isRecording && (
                  <div className="flex items-center gap-3 mr-2">
                    <div className="audio-wave flex items-end gap-[2px] h-5">
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                    </div>
                    <button
                      onClick={handleCancelListening}
                      className="text-[#8D8D8D] font-bold text-xl"
                    >
                      ✖
                    </button>
                  </div>
                )}

                <div className="flex gap-8 items-center">
                  {!chatboxDisable && !isRecording && (
                    <div className="mike-container relative">
                      <img
                        onClick={handleStartListening}
                        width={20}
                        src="/mike.svg"
                        alt="Microphone Icon"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (inputValue.trim()) {
                        setUserHasSentMessage(true);
                        sendMessage(inputValue);
                      }
                    }}
                    disabled={loading || chatboxDisable}
                  >
                    <img width={20} src="/sent.svg" alt="send icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <a href="/privacy-policy" className="text-sm text-blue-500 underline">
          Privacy Notice
        </a>
      </div>

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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wave-bar {
          display: inline-block;
          width: 2px;
          background: #8d8d8d;
          animation: waveAnim 1.2s infinite ease-in-out;
        }

        .wave-bar:nth-child(1) {
          height: 3px;
          animation-delay: -1.1s;
        }
        .wave-bar:nth-child(2) {
          height: 8px;
          animation-delay: -1s;
        }
        .wave-bar:nth-child(3) {
          height: 12px;
          animation-delay: -0.9s;
        }
        .wave-bar:nth-child(4) {
          height: 8px;
          animation-delay: -0.8s;
        }
        .wave-bar:nth-child(5) {
          height: 3px;
          animation-delay: -0.7s;
        }

        @keyframes waveAnim {
          0%,
          40%,
          100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
