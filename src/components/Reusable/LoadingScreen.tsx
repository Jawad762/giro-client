import React from "react";

const LoadingScreen = () => {
  return (
    <section className="h-full grid place-items-center bg-black">
      <video width="500" height="500" autoPlay muted playsInline className="">
        <source src="/animated-logo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default LoadingScreen;
