import React from "react";

const Help = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/dummy.pdf"; // Replace with the actual path to your dummy PDF
    link.download = "MemoCompanion_Guide.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col h-screen lg:h-[100%] ">
      {/* Top Bar */}
      <div className=" w-full  pl-16 bg-gradient-to-r lg:w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
        <p className="">Help and Support</p>
      </div>

      {/* ------------- */}
      <div className="flex-1 py-4 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
        <div className="    mx-auto ">
          <h1 className="font-semibold    ">
            Welcome to MemoCompanion's Help & Support.
          </h1>
          <h1 className="font-semibold  mt-2   mb-4">
            <span className="font-normal">
              MemoCompanion is an AI-powered chatbot designed specifically for
              individuals living with mild dementia. Here’s what the
              MemoCompanion chatbot can do for you:
            </span>
          </h1>

          <ul className="space-y-4">
            <li className="">
              <p className=" ">
                <img
                  src="/day.png"
                  className="h-[22px] inline-block  mb-1 mr-2  "
                />
                <span className="font-semibold  mr-1">Daily Diary:</span>
                MemoCompanion supports you in maintaining daily diary entries,
                allowing you to write about and keep a regular record of your
                day-to-day activities and important memories. You can also read
                your previous diary entries anytime.
              </p>
            </li>

            <li>
              <p className="">
                <img
                  src="/maa.png"
                  className=" h-[22px] inline-block  mb-1 mr-2 "
                />
                <span className="font-semibold  mr-1">Morning Messages:</span>
                Each morning, you'll receive an email with your diary entry from
                the previous day, helping you start your day connected to your
                memories.
              </p>
            </li>

            <li>
              <div className="flex items-center space-x-2 mb-3"></div>
              <p className="">
                <img
                  src="/mem.png"
                  className=" h-[22px] inline-block  mb-1 mr-2"
                />
                <span className="font-semibold  mr-1">Memory Exercises:</span>
                MemoCompanion provides memory exercises focused on recalling
                names using photos of family members or friends that you upload.
                Additionally, it helps reinforce details and shared experiences
                associated with these individuals.
              </p>
            </li>
          </ul>

          <div className="my-6">
            <div className="flex items-center space-x-2 mb-3">
              {/* <img src="/rec.png" className="h-7" /> */}
              <span className="font-semibold">
                Watch this short video to learn how to get started with
                MemoCompanion and use its features:
              </span>
            </div>
            <iframe
              className="w-[80%] mx-auto mt-4"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/u31qwQUeGuM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            {/* <img src="/pdf.png" className="h-7" /> */}
            <span className="font-semibold ">
              Alternatively, download this PDF guide for step-by-step
              instructions on how to get started with MemoCompanion and use its
              features:
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="px-6 py-3  bg-[#003366] flex items-center justify-center w-max mx-auto text-white mt-3 font-bold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download PDF
          </button>

          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-3">
              {/* <img src="/perosn.png" className="h-7" /> */}
              <span className="font-semibold ">
                For additional and direct support, please feel free to reach out
                to the primary researcher anytime at:
              </span>
            </div>

            <p className="mb-2 text-sm flex items-center gap-2">
              <img className="h-3" src="mai.png" />
              Email:{" "}
              <a
                href="mailto:n.s.a.altwala2@newcastle.ac.uk"
                className="  text-[#37A8FF] underline"
              >
                n.s.a.altwala2@newcastle.ac.uk
              </a>
            </p>
            <p className="flex items-center gap-2 text-sm">
              <img className="h-4" src="/wtp.png" />
              WhatsApp:{""}
              <a href="tel:+447888669033" className=" ">
                +447888669033
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
