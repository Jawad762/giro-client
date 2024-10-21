"use client";
import { ConfirmRideInfo, DriverInfo, LiveRideMapInfo, RideStatus } from "@/types";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DriverNotFound from "./DriverNotFound";
import DriverOnTheWay from "./DriverOnTheWay";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateLiveRideInfo } from "@/redux/mainSlice";
import { getGeoJson } from "@/helpers";
import DriverIsHere from "./DriverIsHere";
import RideComplete from "@/components/Driver/Go/RideComplete";
import { useRouter, useSearchParams } from "next/navigation";

const FindingDriver = ({
  connection,
  info,
  setIsSubmitted,
}: {
  connection: HubConnection;
  info: ConfirmRideInfo;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const liveRideInfo = useAppSelector((state) => state.main.liveRideInfo) as LiveRideMapInfo
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleCancelRide = (destroySession: boolean) => {
    if (connection?.state === HubConnectionState.Connected) {
      if (destroySession && searchParams.get('session_id')) {
        const params = new URLSearchParams(searchParams); 
        params.delete('session_id'); 
        router.push(`${window.location.pathname}?${params.toString()}`);
      }
      connection.send("CancelRide", info.riderId);
    }
  };

  useEffect(() => {
    if (connection) {
      const handleAcceptRide = async (driverInfo: DriverInfo) => {
        const data = await getGeoJson(
          { lat: info.location[0], long: info.location[1] },
          { lat: driverInfo.location[0], long: driverInfo.location[1] }
        );

        dispatch(
          updateLiveRideInfo({
            driverLocation: {
              lat: driverInfo.location[0],
              long: driverInfo.location[1],
            },
            riderLocation: {
              lat: info.location[0],
              long: info.location[1],
            },
            riderDestination: {
              lat: info.destination[0],
              long: info.destination[1],
            },
            riderId: info.riderId,
            geoJSON: data?.geoJSON,
            distance: data?.distance,
            status: RideStatus.DRIVER_ON_THE_WAY,
            ...driverInfo,
          })
        );
        setIsLoading(false);
      };

      connection.on("AcceptRide", handleAcceptRide);

      connection.on("CancelRide", (id) => {
        if (id === info.riderId) {
          setIsSubmitted(false);
          dispatch(updateLiveRideInfo(null));
        }
      });

      return () => {
        connection.off("AcceptRide");
        connection.off("CancelRide");
      };
    }
  }, [connection]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (isLoading && !liveRideInfo) {
      timeout = setTimeout(() => setIsLoading(false), 60000)
    } else {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, liveRideInfo]);

  if (liveRideInfo?.status === RideStatus.DRIVER_ON_THE_WAY) return <DriverOnTheWay handleCancelRide={handleCancelRide} />
  else if (liveRideInfo?.status === RideStatus.HEADING_TO_DESTINATION) return <DriverIsHere handleCancelRide={handleCancelRide} />
  else if (liveRideInfo?.status === RideStatus.ARRIVED_TO_DESTINATION) return <RideComplete />
  else if (!isLoading && !liveRideInfo)
    return (
      <DriverNotFound
        connection={connection}
        info={info}
        setIsLoading={setIsLoading}
        handleCancelRide={handleCancelRide}
      />
    );

  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] _animate-up">
      <h2 className="text-4xl">Finding Driver</h2>
      <div className="h-1 w-full rounded-full bg-darkSecondary relative _finding-driver-loading"></div>
      <button
        onClick={() => handleCancelRide(false)}
        className="bg-darkSecondary text-white rounded-lg w-full py-3"
      >
        Cancel Ride
      </button>
    </div>
  );
};

export default FindingDriver;
