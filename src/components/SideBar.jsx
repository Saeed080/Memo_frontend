import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { baseURL } from "../utils/base-url/baseURL";

const Sidebar = () => {
  const location = useLocation(); // Hook to get the current location
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const userId = Cookies.get("userId");
  console.log(userId);

  const logoutUser = async () => {
    const url = `${baseURL}/logout?user_id=${userId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      console.log(data);
      return data;
    } catch (error) {
      console.error("Logout failed:", error);
      return null;
    }
  };

  // Update menu items based on the current URL
  useEffect(() => {
    if (
      location.pathname.includes("/info") ||
      location.pathname.includes("/suport")
    ) {
      setMenuItems([
        { label: "Chat", path: "/info", img: "/chatLogo.png" },
        // { label: "Settings", path: "/settings", img: "/setting.svg" },
        { label: "Help and Support", path: "/suport", img: "/ques.png" },
      ]);
    } else {
      setMenuItems([
        { label: "Chat", path: "/chat-bot", img: "/logo.png" },
        { label: "Profile", path: "/profile", img: "/prof.png" },
        // { label: "Settings", path: "/settings", img: "/setting.svg" },
        { label: "Manage Photos", path: "/memory", img: "/manageP.png" },
        { label: "Help and Support", path: "/support", img: "/ques.png" },
      ]);
    }
  }, [location.pathname]); // Re-run whenever the URL changes

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-4 fixed top-1 text-white -left-2 z-50 text-3xl"
      >
        {isOpen ? null : <AiOutlineMenu />}
      </button>
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0  bg-white lg:bg-[#f3f4f6] fixed top-0 left-0 lg:relative lg:p-4 h-full lg:block p-4 transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between  items-center lg:ml-4">
          <div className="">
            <img width={270} src="/logoWithText.svg" alt="Logo" />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-3xl ml-2 text-black lg:hidden"
          >
            <AiOutlineClose />
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] mx-auto bg-[#CBD1D7] w-[100%] mt-2 mb-5"></div>

        {/* Menu Items */}
        <ul>
          {menuItems.map((item, index) => (
            <li
              onClick={() => setIsOpen(false)}
              key={index}
              className={`mb-2 ${
                location.pathname === item.path ? "bg-white rounded-lg" : ""
              }`}
            >
              <Link
                to={item.path}
                className="flex items-center gap-4 py-2 px-5 font-medium"
              >
                <img src={item.img} alt={item.label} className="w-7" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Section */}
        <div className="absolute w-full bottom-4 mb-[5px]">
          <div className="w-[90%] h-[1px] bg-[#CBD1D7] mb-4"></div>
          <div
            onClick={() => {
              logoutUser();
              Cookies.remove("userId");
              Cookies.remove("user");
              Cookies.remove("gender");
              Cookies.remove("infoTaken");
              window.location.href = "/chat-bot";
            }}
            className="flex gap-5 w-[90%] cursor-pointer py-2 px-5 items-center bg-white rounded-full text-[#Cc0202] font-semibold text-[20px]"
          >
            <img src="/logout.svg" alt="Logout" />
            <button>Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
