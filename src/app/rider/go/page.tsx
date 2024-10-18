"use client";
import ChooseRide from "@/components/Rider/Go/ChooseRide";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import CryptoJS from "crypto-js";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/Reusable/LoadingScreen";
import ChooseRideMap from "@/components/Reusable/Maps/ChooseRideMap";
import { RideInfo } from "@/types";
import LiveRideMap from "@/components/Reusable/Maps/LiveRideMap";
import { getGeoJson } from "@/helpers";
import { useAppSelector } from "@/redux/store";
import useSignalR from "@/hooks/useSignalR";

const page = () => {
  const connection = useSignalR()
  const searchParams = useSearchParams();
  const encryptedData = searchParams.get("data");
  const decryptedBytes = CryptoJS.AES.decrypt(
    encryptedData as string,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
  );
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const liveRideInfo = useAppSelector(state => state.main.liveRideInfo)

  const [location, destination] = [
    decryptedData.location,
    decryptedData.destination,
  ];

  if (!decryptedData) return notFound();

  const { data, isLoading } = useQuery({
    queryFn: () => getGeoJson(location, destination),
    queryKey: [location, destination],
  });

  if (isLoading) return <LoadingScreen />;

  return connection && (
    <section className="flex-1 flex flex-col _container w-full">
      <div className="pt-20 xl:pt-24 flex flex-col gap-3 flex-1">
        <Link href={"/rider"} className="flex items-center w-fit">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </Link>
        <div className="flex justify-between gap-12 flex-1">
          <ChooseRide
            connection={connection}
            rideInfo={{ ...data, location, destination } as RideInfo}
          />
          <section className="w-full md:w-1/2 xl:w-[70%]">
            {liveRideInfo && connection ? (
              <LiveRideMap connection={connection} />
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
