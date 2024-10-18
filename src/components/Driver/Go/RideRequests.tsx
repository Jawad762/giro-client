"use client";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ExtendedRideInfo, LatLong, LiveRideMapInfo, RideStatus } from "@/types";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { updateLiveRideInfo } from "@/redux/mainSlice";
import { getGeoJson } from "@/helpers";
import GoToRider from "./GoToRider";
import GoToDestination from "./GoToDestination";
import RideComplete from "./RideComplete";

const RideRequests = ({ connection, location }: { connection: HubConnection, location: LatLong }) => {
  const user = useAppSelector(state => state.main.user)
  const [showOptions, setShowOptions] = useState(true);
  const [rideRequests, setRideRequests] = useState<ExtendedRideInfo[]>([]);
  const liveRideInfo = useAppSelector(state => state.main.liveRideInfo) as LiveRideMapInfo
  const dispatch = useAppDispatch()

  const handleCancelRide = () => {
    if (connection?.state === HubConnectionState.Connected) {
      connection.send('CancelRide', liveRideInfo.riderId)
    }
  }

  useEffect(() => {
    if (connection) {
      connection.on("RideRequest", (request) => {
        setRideRequests((prev) => [...prev, request]);
      });

      connection.on("CancelRide", (id) => {
        if (liveRideInfo && liveRideInfo.riderId === id) {
          dispatch(updateLiveRideInfo(null))
        }

        setRideRequests((prev) => prev.filter(e => e.riderId !== id));
      });
    }

    return () => {
      if (connection) {
        connection.off("RideRequest");
        connection.off("CancelRide");
      }
    };
  }, [connection, liveRideInfo]);

  const acceptRide = async (ride: ExtendedRideInfo) => {
    if (connection?.state === HubConnectionState.Connected) {
      const info = {
        driverName: `${user.firstName} ${user.lastName}`,
        car: "Honda Civic, Black, 892AB6",
        profilePicture: "abc",
        location: [location.lat, location.long],
        riderId: ride.riderId,
        driverId: user.id
      }

      connection.send('ConfirmRide', info)
      setRideRequests(prev => prev.filter(e => e.riderId !== ride.riderId))
      const data = await getGeoJson(
        { lat: location.lat, long: location.long },
        { lat: ride.location[0], long: ride.location[1] }
      )

      dispatch(updateLiveRideInfo({
        driverLocation: {
          lat: location.lat,
          long: location.long
        },
        riderLocation: {
          lat: ride.location[0],
          long: ride.location[1]
        },
        riderDestination: {
          lat: ride.destination[0],
          long: ride.destination[1],
        },
        geoJSON: data?.geoJSON,
        distance: ride.distanceInKilometers,
        ...info,
        status: RideStatus.DRIVER_ON_THE_WAY
      }))
    }
  }

  if (liveRideInfo?.status === RideStatus.DRIVER_ON_THE_WAY) return <GoToRider handleCancelRide={handleCancelRide} />
  else if (liveRideInfo?.status === RideStatus.HEADING_TO_DESTINATION) return <GoToDestination handleCancelRide={handleCancelRide} />
  else if (liveRideInfo?.status === RideStatus.ARRIVED_TO_DESTINATION) return <RideComplete />

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

              <p>• {e.distanceInKilometers < 1 ? 'Less than 1' : e.distanceInKilometers.toFixed(1)}km away</p>
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
