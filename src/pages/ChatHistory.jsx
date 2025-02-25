import React from "react";

const ChatHistory = () => {
  return (
    <div className="flex flex-col h-screen lg:h-[100%] ">
      {/* Top Bar */}
      <div className=" pl-16 bg-gradient-to-r w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-2 mx-auto text-white font-medium flex justify-center items-center">
        <p className="">
          Just a reminder: I'm an AI companion chatbot here to support you, not
          a real person!
        </p>
      </div>
      {/* ------------- */}
      <div className="flex-1 pt-8 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl"></div>
    </div>
  );
};

export default ChatHistory;
