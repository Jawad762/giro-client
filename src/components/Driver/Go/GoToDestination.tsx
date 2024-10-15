import React from "react";

const GoToDestination = ({ handleCancelRide }: { handleCancelRide: any }) => {
  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] _animate-up">
      <h2 className="text-4xl">Once the rider is ready, please head to the destination.</h2>
      <button onClick={handleCancelRide} className="bg-darkSecondary text-white rounded-lg w-full py-3">Cancel Ride</button>
    </div>
  );
};

export default GoToDestination;
