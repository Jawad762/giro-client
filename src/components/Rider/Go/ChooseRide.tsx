"use client";
import { useAppSelector } from "@/redux/store";
import { RideInfo, UserType } from "@/types";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import FindingDriver from "./FindingDriver";
import { IoMdCash } from "react-icons/io";
import { IoCardSharp } from "react-icons/io5";
import { api } from "@/axios";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/Reusable/LoadingScreen";
import Check from "@/components/Reusable/Icons/Check";
import Toast from "@/components/Reusable/Toast";

const ChooseRide = ({
  rideInfo,
  connection,
}: {
  rideInfo: RideInfo;
  connection: HubConnection;
}) => {
  const user = useAppSelector((state) => state.main.user) as UserType;
  const liveRideInfo = useAppSelector((state) => state.main.liveRideInfo);
  const [chosenRide, setChosenRide] = useState("solo");
  const [showOptions, setShowOptions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const cost = Number(
    (2 + rideInfo.distance / 2000 + (rideInfo.duration / 60) * 0.1).toFixed(0)
  );

  const info = {
    riderName: user.firstName,
    riderId: user.id,
    location: [rideInfo.location.lat, rideInfo.location.long],
    destination: [rideInfo.destination.lat, rideInfo.destination.long],
    price: chosenRide === "solo" ? cost : cost * 1.5,
    riderProfilePicture: user.profilePicture,
  };

  const now = new Date();
  let currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  const isPM = currentHours >= 12;
  currentHours = currentHours % 12 || 12;

  const rideTimeInMinutes = Math.floor(rideInfo.duration / 60);

  let finalMinutes = currentMinutes + rideTimeInMinutes;
  let finalHours = currentHours;

  if (finalMinutes >= 60) {
    finalHours += Math.floor(finalMinutes / 60);
    finalMinutes = finalMinutes % 60;
  }

  finalHours = finalHours % 12 || 12;

  const finalPeriod = isPM && finalHours >= currentHours ? "PM" : "AM";

  const confirmPayment = async () => {
    try {
      const data = await api.post("/checkout/create-session", {
        // * 100 because stripe requires that
        price: chosenRide === "solo" ? cost * 100 : cost * 1.5 * 100,
        returnUrl: window.location.href,
        rideType: chosenRide.toUpperCase(),
      });

      if (data.data.data.url) {
        router.push(data.data.data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestRide = async () => {
    if (paymentMethod === "card" && !isPaid) {
      setIsLoading(true);
      await confirmPayment();
      setIsLoading(false);
    } else if (connection?.state === HubConnectionState.Connected) {
      connection.send("RequestRide", info);
      setIsSubmitted(true);
    }
  };

  const checkSessionStatus = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const data = await api.get(
        `/checkout/check-session?session_id=${sessionId}`
      );
      if (data.data.data.paymentStatus === "paid") {
        setIsPaid(true);
        setChosenRide(data.data.data.lineItems?.[0].description.split(', ')?.[1]?.toLowerCase())
      } else throw new Error();
    } catch (error) {
      console.error(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (session_id) {
      checkSessionStatus(session_id);
    } else isPaid && setIsPaid(false);
  }, [searchParams]);

  if (isSubmitted || liveRideInfo)
    return (
      <FindingDriver
        connection={connection as HubConnection}
        info={info}
        setIsSubmitted={setIsSubmitted}
      />
    );

  return (
    <>
      <div className="space-y-4 border border-darkSecondary rounded-t-lg md:rounded-b-lg p-4 fixed bottom-0 inset-x-2 z-10 md:static bg-darkPrimary md:bg-transparent md:w-1/2 xl:w-[30%]">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl">Choose a Ride</h2>
          <button
            className="md:hidden"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MdKeyboardArrowDown className="h-8 w-8" />
          </button>
        </div>
        <div
          className={`space-y-4 duration-500 transition-[max-height] ${
            showOptions
              ? "max-md:max-h-screen"
              : "max-md:max-h-0 max-md:overflow-hidden"
          }`}
        >
          {!isPaid || (isPaid && chosenRide === "solo") ? (
            <div
              onClick={() => setChosenRide("solo")}
              className={`cursor-pointer flex items-center justify-between gap-2 border-2 rounded-lg pl-2 pr-6 ${
                chosenRide === "solo" ? "border-white" : "border-darkSecondary"
              }`}
            >
              <Image
                src="/car-primary.png"
                alt="Driver's Car"
                height={100}
                width={100}
              />
              <div className="text-3xl">
                <p>USD {cost}</p>
                <p className="text-white opacity-50 text-sm">Solo</p>
              </div>
            </div>
          ) : null}

          {!isPaid || (isPaid && chosenRide === "group") ? (
            <div
              onClick={() => setChosenRide("group")}
              className={`cursor-pointer flex items-center justify-between gap-2 border-2 rounded-lg pl-2 pr-6 ${
                chosenRide === "group" ? "border-white" : "border-darkSecondary"
              }`}
            >
              <Image
                src="/car-primary.png"
                alt="Driver's Car"
                height={100}
                width={100}
              />
              <div className="text-3xl">
                <p>USD {cost * 1.5}</p>
                <p className="text-white opacity-50 text-sm">Group Ride</p>
              </div>
            </div>
          ) : null}

          {!isPaid ? (
            <div className="space-y-1">
              <p>Pay using</p>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-center gap-2 text-lg rounded-lg py-3 border-2 w-1/2 ${
                    paymentMethod === "cash"
                      ? "border-green-500"
                      : "border-darkSecondary"
                  }`}
                >
                  <IoMdCash className="text-green-500" />
                  <p>Cash</p>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 text-lg rounded-lg py-3 border-2 w-1/2 ${
                    paymentMethod === "card"
                      ? "border-bluePrimary"
                      : "border-darkSecondary"
                  }`}
                >
                  <IoCardSharp className="text-bluePrimary" />
                  <p>Card</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-blueSecondary">
              <Check /> Paid using card
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-sm">
              🕒 Estimated Arrival by {finalHours}:
              {finalMinutes < 10 ? `0${finalMinutes}` : finalMinutes.toString()}{" "}
              {finalPeriod}
            </p>

            <button
              onClick={requestRide}
              className="bg-white hover:bg-slate-200 disabled:bg-white/50 text-black rounded-lg py-3 px-6 w-full"
            >
              Confirm Ride
            </button>
          </div>
        </div>
      </div>
      {isLoading && (
        <section className="fixed z-20 inset-0">
          <LoadingScreen semiTransparent />
        </section>
      )}
      <Toast showToast={isError} status="error" text="Payment failed." />
    </>
  );
};

export default ChooseRide;
