"use client";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import BaseMap from "@/components/Reusable/Maps/BaseMap";
import RideRequests from "@/components/Driver/Go/RideRequests";
import useSignalR from "@/hooks/useSignalR";
import {  useState } from "react";
import LiveRideMap from "@/components/Reusable/Maps/LiveRideMap";
import { useAppSelector } from "@/redux/store";
import { LatLong, LiveRideMapInfo } from "@/types";

const page = () => {
  const liveRideInfo = useAppSelector(state => state.main.liveRideInfo) as LiveRideMapInfo
  const connection = useSignalR()
  const [location, setLocation] = useState<LatLong | null>(null);

  return connection && (
    <section className="flex-1 flex flex-col _container w-full">
      <div className="pt-20 xl:pt-24 flex flex-col gap-3 flex-1">
        <Link href={"/driver"} className="flex items-center w-fit">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </Link>
        <div className="flex justify-between gap-12 flex-1">
          <RideRequests connection={connection} location={location as LatLong}/>
          <section className="w-full md:w-1/2 xl:w-[70%] max-h-screen">
          {liveRideInfo ? (
            <LiveRideMap connection={connection} />
          ) : (
            <BaseMap connection={connection} location={location} setLocation={setLocation}/>
          )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default page;
