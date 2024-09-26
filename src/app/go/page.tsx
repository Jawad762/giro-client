'use client'
import RideDetails from "@/components/Go/RideDetails";
import MapComponent from "@/components/Reusable/Map";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import CryptoJS from 'crypto-js';

const page = () => {
  const searchParams = useSearchParams()
  const encryptedData = searchParams.get('data')
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData as string, process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string)
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  if (!decryptedData) return notFound()

  return (
    <section className="flex-1 _container w-full">
      <div className="pt-20 xl:pt-24 space-y-3">
        <Link href={"/"} className="flex items-center">
          <MdKeyboardArrowLeft className="h-6 w-6" />
          Back
        </Link>
        <div className="flex justify-between gap-12">
          <RideDetails />
          <section className="h-[400px] w-full md:w-1/2 xl:w-[70%]">
            <MapComponent location={decryptedData.location} destination={decryptedData.destination}/>
          </section>
        </div>
      </div>
    </section>
  );
};

export default page;
