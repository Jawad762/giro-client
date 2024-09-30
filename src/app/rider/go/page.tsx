'use client'
import ChooseRide from "@/components/Go/ChooseRide";
import MapComponent, { RideInfo } from "@/components/Reusable/Map";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import CryptoJS from 'crypto-js';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/Reusable/LoadingScreen";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const page = () => {

  const searchParams = useSearchParams()
  const encryptedData = searchParams.get('data')
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData as string, process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string)
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const [location, destination] = [decryptedData.location, decryptedData.destination]

  if (!decryptedData) return notFound()

    const getData = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.long},${location.lat};${destination.long},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

        const response = await axios.get(url);
        const data = response.data;

        const routeCoordinates = data.routes[0].geometry.coordinates;

        return {
          geoJSON: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
            }
          },
          distance: data.routes[0].distance,
          duration: data.routes[0].duration
        }
      } catch (error) {
        console.error(error)
      }
    }

    const { data, isLoading } = useQuery({ queryFn: getData, queryKey: [] })

    if (isLoading) return <LoadingScreen/>
    
  return (
    <section className="flex-1 flex flex-col _container w-full">
      <div className="pt-20 xl:pt-24 flex flex-col gap-3 flex-1">
        <Link href={"/rider"} className="flex items-center">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </Link>
        <div className="flex justify-between gap-12 flex-1">
          <ChooseRide rideInfo={data as RideInfo}/>
          <section className="w-full md:w-1/2 xl:w-[70%]">
            <MapComponent location={decryptedData.location} destination={decryptedData.destination} rideInfo={data as RideInfo}/>
          </section>
        </div>
      </div>
    </section>
  );
};

export default page;
