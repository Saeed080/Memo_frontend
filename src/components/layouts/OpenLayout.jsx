import React from "react";

const OpenLayout = ({ children }) => {
  return (
    <section className="bg-grey h-full text-white">
      <nav className="flex h-[25dvh] py-10 gap-2 items-center text-3xl pl-20">
        <img src="/logo.svg" alt="logo" />
        <h1 className="font-semibold">Memo Mate</h1>
      </nav>
      <main className="py-4 w-[55%] mx-auto ">{children}</main>
    </section>
  );
};

export default OpenLayout;
