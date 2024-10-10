"use client";
import { useAppSelector } from "@/redux/store";
import { ExtendedRideInfo, LiveRideMapInfo } from "@/types";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import AcceptedRide from "./AcceptedRide";

const RideRequests = ({ connection, viewport, setLiveRideInfo }: { connection: HubConnection, viewport: { latitude: number, longitude: number }, setLiveRideInfo: Dispatch<SetStateAction<LiveRideMapInfo>> }) => {
  const user = useAppSelector(state => state.main.user)
  const [showOptions, setShowOptions] = useState(true);
  const [rideRequests, setRideRequests] = useState<ExtendedRideInfo[]>([]);
  const [isRideAccepted, setIsRideAccepted] = useState(false)

  useEffect(() => {
    if (connection) {
      connection.on("RideRequest", (request) => {
        setRideRequests((prev) => [...prev, request]);
      });
    }

    return () => {
      if (connection) {
        connection.off("RideRequest");
      }
    };
  }, [connection]);

  const acceptRide = (ride: ExtendedRideInfo) => {
    if (connection?.state === HubConnectionState.Connected) {
      const info = {
        driverName: `${user.firstName} ${user.lastName}`,
        car: "Honda Civic, Black, 892AB6",
        profilePicture: "abc",
        location: [viewport.latitude, viewport.longitude],
        riderConnection: ride.riderConnection
      }

      connection.send('ConfirmRide', info)
      setIsRideAccepted(true)
      setRideRequests([])
      setLiveRideInfo({
        driverLocation: {
          lat: viewport.latitude,
          long: viewport.longitude
        },
        riderLocation: {
          lat: ride.location[0],
          long: ride.location[1]
        },
        riderDestination: {
          lat: ride.destination[0],
          long: ride.destination[1],
        },
        geoJSON: null,
        distance: ride.distance
      })
    }
  }

  if (isRideAccepted) return <AcceptedRide/>

  return (
    <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 max-h-[70dvh] md:max-h-full overflow-y-auto inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%] flex-grow-0">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">Ride Requests</h2>
        <button
          className="md:hidden"
          onClick={() => setShowOptions(!showOptions)}
        >
          <MdKeyboardArrowDown className="h-8 w-8" />
        </button>
      </div>
      <div
        className={`space-y-5 pb-2 transition-[max-height] ${
          showOptions
            ? "max-md:max-h-screen"
            : "max-md:max-h-0 max-md:overflow-hidden min-h-auto"
        }`}
      >
        {rideRequests.length === 0 ? (
          <p className="py-3 text-center opacity-50 font-thin">New Requests will be shown here, stay on the lookout!</p>
        ) : (
          rideRequests.map((e, i) => (
            <div
              key={i}
              className="space-y-3 border-2 border-darkSecondary rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/pfp-placeholder.png"
                  height={50}
                  width={50}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-lg">{e.riderName}</p>
                  <p className="opacity-75">USD {e.price}</p>
                </div>
              </div>

              <p>• {!e.distance ? 'Less than 1' : e.distance}km away</p>
              <p>• to {e.destinationAddress}</p>

              <div className="flex gap-2 text-sm">
                <button onClick={() => acceptRide(e)} className="bg-bluePrimary py-2 w-1/2 rounded-lg">
                  Accept
                </button>
                <button onClick={() => setRideRequests(prev => prev.filter((_r, v) => v !== i))} className="bg-darkSecondary py-2 w-1/2 rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideRequests;
