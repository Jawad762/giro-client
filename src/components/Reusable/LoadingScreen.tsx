import React from "react";
import Spinner from "./Spinner";

const LoadingScreen = ({ semiTransparent = false }: { semiTransparent?: boolean }) => {
  return (
    <section className={`h-screen grid place-items-center z-30 ${semiTransparent ? 'bg-black/50' : 'bg-black'}`}>
      {/* <video width="500" height="500" autoPlay muted playsInline className="">
        <source src="/animated-logo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <Spinner/>
    </section>
  );
};

export default LoadingScreen;
