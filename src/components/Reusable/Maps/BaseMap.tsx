"use client";
import React, { useEffect, useRef } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { LatLong, UserType } from "@/types";
import { LngLatBounds } from "mapbox-gl";
import { useAppSelector } from "@/redux/store";
import { calculateHaversineDistance } from "@/helpers";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const BaseMap = ({
  connection,
  location,
  setLocation,
}: {
  connection: HubConnection;
  location: LatLong | null;
  setLocation: any;
}) => {
  const user = useAppSelector(state => state.main.user) as UserType
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const clearWatch = getUserLocation();

    return () => {
      clearWatch();
    };
  }, [connection.state]);

  const getUserLocation = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const difference = calculateHaversineDistance(lat, long, location?.lat as number, location?.long as number)
        if (difference > 0.02) {
          setLocation({
            lat,
            long,
          });
          if (connection?.state === HubConnectionState.Connected) {
            connection.send("SubscribeToLocation", user.id, lat, long);
          }
        }
        console.log(
          `lat = ${lat}`,
          `long = ${long}`,
          `accuracy = ${accuracy}m`
        );
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      if (connection?.state === HubConnectionState.Connected) {
        connection.send("UnsubscribeFromLocation", user.id);
      }
      navigator.geolocation.clearWatch(watchId);
    };
  };

  const fitMapToBounds = (lat: number, long: number) => {
    const bounds = new LngLatBounds();
    bounds.extend([long, lat]);

    mapRef.current?.fitBounds(bounds, {
      padding: 50,
      duration: 1000
    });
  };

  useEffect(() => {
    if (location) fitMapToBounds(location.lat, location?.long);
  }, [location]);

  return (
    location && (
      <Map
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: 10 }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker latitude={location.lat} longitude={location.long}>
          <h2 className="bg-black text-white p-2 text-xs font-bold pl-4 relative after:absolute after:left-[-1px] after:inset-y-0 after:w-2 after:bg-white">
            My Location
          </h2>
          <img src="/car-white.svg" alt="Driver's Car" height={40} width={40} />
        </Marker>
      </Map>
    )
  );
};

export default BaseMap;
