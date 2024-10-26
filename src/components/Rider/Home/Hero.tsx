"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import heroImage from "../../../../public/hero.webp";
import { FaLocationArrow } from "react-icons/fa6";
import axios from "axios";
import { LocationType } from "@/types";
import { api } from "@/axios";
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

const Hero = () => {
  const [locationInput, setLocationInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [location, setLocation] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationType[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    LocationType[]
  >([]);
  const [countryCode, setCountryCode] = useState<string>("");
  const router = useRouter();

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(async (position: any) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        
        try {
          const { data } = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
          );

          data.results.forEach((result: any) => {
            if (
              result.geometry.location_type === "GEOMETRIC_CENTER" &&
              result.types.includes("route")
            ) {
              setLocation({
                description: result.formatted_address,
                lat,
                long,
              });
              setLocationInput(result.formatted_address);
            }

            result.address_components.forEach((component: any) => {
              if (component.types.includes("country")) {
                setCountryCode(component.short_name);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleAutocomplete = async (
    input: string,
    type: "location" | "destination"
  ) => {
    if (input.length > 1) {
      const { data } = await api.get(
        `/places/autocomplete?input=${input}&country=${countryCode}`
      );
      type === "location"
        ? setLocationSuggestions(data.data)
        : setDestinationSuggestions(data.data);
    }
  };

  const handlePlaceSelect = async (
    suggestion: LocationType,
    type: "location" | "destination"
  ) => {
    try {
      if (type === "location") {
        setLocation({
          description: suggestion.description,
          lat: suggestion.lat,
          long: suggestion.long,
        });
        setLocationInput(suggestion.description);
        setLocationSuggestions([]);
      } else {
        setDestination({
          description: suggestion.description,
          lat: suggestion.lat,
          long: suggestion.long,
        });
        setDestinationInput(suggestion.description);
        setDestinationSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "location" | "destination"
  ) => {
    const input = e.target.value;
    type === "location" ? setLocation(null) : setDestination(null);
    handleAutocomplete(input, type);
  };

  const handleSeePrices = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const obj = {
        location: {
          lat: parseFloat(location?.lat?.toFixed(7) as string),
          long: parseFloat(location?.long?.toFixed(7) as string)
        },
        destination: {
          lat: parseFloat(destination?.lat?.toFixed(7) as string),
          long: parseFloat(destination?.long?.toFixed(7) as string)
        }
      }

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string).toString();
      router.push(
        `/rider/go?data=${encodeURIComponent(encrypted)})}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="_container flex-1 flex flex-col xl:flex-row items-center justify-center gap-3 bg-pattern-1 relative">
      <div className="w-full xl:w-1/2 space-y-4 pt-32 xl:pt-10">
        <h2 className="text-5xl font-bold leading-snug">
          Go anywhere with Giro
        </h2>
        <p>Request a ride, hop in, and go.</p>
        <form onSubmit={handleSeePrices} className="max-w-sm space-y-4">
          <div className="space-y-2 text-black">
            <div
              className={`px-5 py-3 rounded-lg flex items-center gap-2 relative group ${
                location ? "bg-bluePrimary text-white" : "bg-white text-black"
              }`}
            >
              <input
                placeholder="Enter location"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  handleInputChange(e, "location");
                }}
                className="flex-1 outline-none bg-transparent"
              />
              <button type="button" onClick={getUserLocation}>
                <FaLocationArrow className="text-2xl" />
              </button>
              {locationSuggestions.length > 0 && (
                <ul className="bg-white z-10 shadow-md rounded-lg inset-x-0 absolute -bottom-1 translate-y-full max-h-60 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-0 last:rounded-b-lg first:rounded-t-lg"
                      onClick={() => handlePlaceSelect(suggestion, "location")}
                    >
                      <p className="line-clamp-1 text-sm">
                        {suggestion.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div tabIndex={0} className="flex flex-col relative group">
              <input
                placeholder="Enter destination"
                className={`flex-1 outline-none px-5 py-3 rounded-lg ${
                  destination
                    ? "bg-bluePrimary text-white"
                    : "bg-white text-black"
                }`}
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value);
                  handleInputChange(e, "destination");
                }}
              />
              {destinationSuggestions.length > 0 && (
                <ul className="bg-white shadow-md z-10 rounded-lg inset-x-0 absolute -bottom-1 translate-y-full max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-0 last:rounded-b-lg first:rounded-t-lg"
                      onClick={() =>
                        handlePlaceSelect(suggestion, "destination")
                      }
                    >
                      <p className="line-clamp-1 text-sm">
                        {suggestion.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            className="bg-white disabled:bg-white/50 disabled:cursor-not-allowed text-black rounded-lg py-3 px-6"
            disabled={!location || !destination}
          >
            See Prices
          </button>
        </form>
      </div>
      <Image
        height={500}
        width={500}
        alt="hero"
        src={heroImage}
        className="pt-10"
      />
    </section>
  );
};

export default Hero;
