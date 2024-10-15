import { ConfirmRideInfo } from "@/types";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import React, { Dispatch, SetStateAction, useEffect } from "react";

const DriverNotFound = ({
  connection,
  info,
  setIsLoading,
  handleCancelRide
}: {
  connection: HubConnection;
  info: ConfirmRideInfo;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleCancelRide: any
}) => {
  
  const handleTryAgain = () => {
    if (connection?.state === HubConnectionState.Connected) {
      connection.send("RequestRide", info);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    handleCancelRide()
  }, [])

  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] _animate-up">
      <h2 className="text-4xl">Sorry!</h2>
      <p className="text-sm opacity-50">
        There are no available drivers currently in your area.
      </p>
      <button
        onClick={handleTryAgain}
        className="bg-white hover:bg-slate-200 text-black rounded-lg py-3 px-6 w-full"
      >
        Try again
      </button>
    </div>
  );
};

export default DriverNotFound;