"use client";
import ChooseRide from "@/components/Rider/Go/ChooseRide";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/Reusable/LoadingScreen";
import ChooseRideMap from "@/components/Reusable/Maps/ChooseRideMap";
import { LatLong, LiveRideMapInfo, RideInfo } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LiveRideMap from "@/components/Reusable/Maps/LiveRideMap";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const page = () => {
  const searchParams = useSearchParams();
  const encryptedData = searchParams.get("data");
  const decryptedBytes = CryptoJS.AES.decrypt(
    encryptedData as string,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
  );
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [liveRideInfo, setLiveRideInfo] = useState<null | LiveRideMapInfo>(null);

  const [location, destination] = [
    decryptedData.location,
    decryptedData.destination,
  ];

  if (!decryptedData) return notFound();

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
        riderDestination: destination,
        geoJSON: data?.geoJSON,
        distance: data?.distance
      });
      setShowLiveMap(true);
    };

    updateMapInfo();
  }, [liveRideInfo]);

  const { data, isLoading } = useQuery({
    queryFn: () => getData(location, destination),
    queryKey: [],
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <section className="flex-1 flex flex-col _container w-full">
      <div className="pt-20 xl:pt-24 flex flex-col gap-3 flex-1">
        <Link href={"/rider"} className="flex items-center">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </Link>
        <div className="flex justify-between gap-12 flex-1">
          <ChooseRide
            rideInfo={{ ...data, location, destination } as RideInfo}
            setLiveRideInfo={setLiveRideInfo as Dispatch<SetStateAction<LiveRideMapInfo>>}
          />
          <section className="w-full md:w-1/2 xl:w-[70%]">
            {showLiveMap ? (
              <LiveRideMap liveRideInfo={liveRideInfo as LiveRideMapInfo} />
            ) : (
              <ChooseRideMap
                rideInfo={{ ...data, location, destination } as RideInfo}
              />
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default page;
