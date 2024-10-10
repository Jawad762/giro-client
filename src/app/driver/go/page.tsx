"use client";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import BaseMap from "@/components/Reusable/Maps/BaseMap";
import RideRequests from "@/components/Driver/Go/RideRequests";
import useSignalR from "@/hooks/useSignalR";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LatLong, LiveRideMapInfo } from "@/types";
import LiveRideMap from "@/components/Reusable/Maps/LiveRideMap";
import axios from "axios";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const page = () => {
  const connection = useSignalR()
  const [viewport, setViewport] = useState<any>(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [liveRideInfo, setLiveRideInfo] = useState<null | LiveRideMapInfo>(null);

  const getData = async (loc1: LatLong, loc2: LatLong) => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${loc1.long},${loc1.lat};${loc2.long},${loc2.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

      const response = await axios.get(url);
      const data = response.data;
      const routeCoordinates = data.routes[0].geometry.coordinates;

      return {
        geoJSON: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeCoordinates,
          },
        },
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const updateMapInfo = async () => {
      if (!liveRideInfo) return;

      const data = await getData(
        liveRideInfo.riderLocation,
        liveRideInfo.driverLocation
      );
      setLiveRideInfo({
        driverLocation: liveRideInfo.driverLocation,
        riderLocation: liveRideInfo.riderLocation,
        riderDestination: liveRideInfo.riderDestination,
        geoJSON: data?.geoJSON,
        distance: data?.distance
      });
      setShowLiveMap(true);
    };

    updateMapInfo();
  }, [liveRideInfo]);

  return connection && (
    <section className="flex-1 flex flex-col _container w-full">
      <div className="pt-20 xl:pt-24 flex flex-col gap-3 flex-1">
        <Link href={"/driver"} className="flex items-center">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </Link>
        <div className="flex justify-between gap-12 flex-1">
          <RideRequests connection={connection} viewport={viewport} setLiveRideInfo={setLiveRideInfo as Dispatch<SetStateAction<LiveRideMapInfo>>}/>
          <section className="w-full md:w-1/2 xl:w-[70%] max-h-screen">
          {showLiveMap ? (
            <LiveRideMap liveRideInfo={liveRideInfo as LiveRideMapInfo}/>
          ) : (
            <BaseMap connection={connection} viewport={viewport} setViewport={setViewport}/>
          )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default page;
