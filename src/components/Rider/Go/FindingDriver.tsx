"use client";
import { ConfirmRideInfo, DriverInfo, LiveRideMapInfo } from "@/types";
import { HubConnection } from "@microsoft/signalr";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DriverNotFound from "./DriverNotFound";
import DriverFound from "./DriverFound";

const FindingDriver = ({
  connection,
  info,
  setLiveRideInfo
}: {
  connection: HubConnection;
  info: ConfirmRideInfo;
  setLiveRideInfo: Dispatch<SetStateAction<LiveRideMapInfo>>
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState<null | DriverInfo>(null);

  useEffect(() => {
    if (connection) {
      connection.on("AcceptRide", (info) => {
        setIsLoading(false)
        setDriverInfo(info)
        setTimeElapsed(0)
      });
    }
  }, [connection]);

  useEffect(() => {
    let interval: undefined | NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  if (timeElapsed >= 60) {
    setIsLoading(false);
    setTimeElapsed(0);
  }

  useEffect(() => {
    if (!isLoading && driverInfo) {
      setLiveRideInfo({
        riderLocation: {
          lat: info.location[0],
          long: info.location[1]
        },
        driverLocation: {
          lat: driverInfo.location[0],
          long: driverInfo.location[1]
        },
        riderDestination: {
          lat: info.destination[0],
          long: info.destination[1],
        },
        distance: 0,
        geoJSON: null
      })
    }
  }, [isLoading, driverInfo])

  if (!isLoading && !driverInfo) return <DriverNotFound connection={connection} info={info} setIsLoading={setIsLoading}/>

  if (!isLoading && driverInfo) return <DriverFound driverInfo={driverInfo}/>

  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] _animate-up">
      <h2 className="text-4xl">Finding Driver</h2>
      <div className="h-1 w-full rounded-full bg-darkSecondary relative _finding-driver-loading"></div>
    </div>
  );
};

export default FindingDriver;