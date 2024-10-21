import React from "react";
import Check from "./Icons/Check";
import Error from "./Icons/Error";

const Toast = ({ showToast, status, text }: { showToast: boolean, status: string, text: string }) => {
  return (
    <div
      className={`flex items-center fixed top-24 p-6 rounded-lg bg-darkSecondary transition-transform ease-in-out duration-300 ${
        showToast ? "right-6" : "right-0 translate-x-full"
      }`}
    >
      {status === 'success' ? <Check/> : <Error/>}
      <p className="ms-3 text-sm font-normal">{text}</p>
    </div>
  );
};

export default Toast;
