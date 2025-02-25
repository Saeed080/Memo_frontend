import React from "react";

const Privacy = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/dummy-privacy-policy.pdf"; // Replace with the actual path to your dummy PDF
    link.download = "MemoMate_Privacy_Policy.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col h-screen lg:h-[100%] ">
      {/* Top Bar */}
      <div className="pl-16 w-full lg:w-auto bg-gradient-to-r from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-4 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
        <p className="">Privacy Notice</p>
      </div>
      {/* ------------- */}
      <div className="flex-1 pt-8 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
        <div className="  text-gray-800 mx-auto rounded-lg ">
          <h1 className=" font-semibold mb-6">
            Privacy Notice for MemoCompanion{" "}
          </h1>
          <p className=" mb-4">
            The AI MemoCompanion chatbot is designed as part of a PhD research
            study. Your interactions with MemoCompanion are entirely private and
            secure.
          </p>

          <ul className="list-disc list-outside space-y-2 ml-3">
            <li className=" pl-4">
              No one will access the content of your diary entries,
              conversations, or the photos you upload.
            </li>
            <li className=" pl-4">
              We only record the frequency of your logins to MemoCompanion, the
              duration of each session, the number of diary entries you create,
              how often you revisit these entries, the number of memory
              exercises you complete, and your performance on these exercises.
              This data is used for research purposes to understand general
              usage patterns and assess the effectiveness of the tool.
            </li>
            <li className=" pl-4">
              All personal data related to these interactions will be deleted
              upon the conclusion of the study or upon your request.
            </li>
            <li className=" pl-4">
              Your participation and data contribution are voluntary, based on
              your consent. You have the right to withdraw from the study at any
              time, which includes the right to have your data deleted from our
              records.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
