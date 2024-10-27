"use client";
import React, { useEffect, useRef } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Circle from "../Icons/Circle";
import Square from "../Icons/Square";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateLiveRideInfo } from "@/redux/mainSlice";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { LatLong, LiveRideMapInfo, RideStatus, UserType } from "@/types";
import { calculateHaversineDistance, getGeoJson } from "@/helpers";
import { LngLatBounds } from "mapbox-gl";
import debounce from 'lodash.debounce';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const LiveRideMap = ({ connection }: { connection: HubConnection }) => {
  const user = useAppSelector((state) => state.main.user) as UserType;
  const liveRideInfo = useAppSelector(
    (state) => state.main.liveRideInfo
  ) as LiveRideMapInfo;
  const dispatch = useAppDispatch();

  const mapRef = useRef<MapRef>(null);

  const lineLayer = {
    id: "route",
    type: "line",
    source: "route",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#888", "line-width": 4 },
  };

  useEffect(() => {
    if (connection) {
      connection.on("LocationChange", async (loc: LatLong) => {
        updateDriverLocation(loc);
      });
    }
  }, [connection]);

  useEffect(() => {
    if (user.role === "driver") {
      const clearWatch = watchDriverLocation();
      return clearWatch;
    }
  }, [connection.state]);

  useEffect(() => {
    if (liveRideInfo.riderLocation && liveRideInfo.driverLocation) {
      fitMapToBounds(liveRideInfo.driverLocation, liveRideInfo.riderLocation);
    }
  }, [liveRideInfo.riderLocation, liveRideInfo.driverLocation]);

  const updateDriverLocation = debounce(async (loc: LatLong) => {
    dispatch(
      updateLiveRideInfo({
        ...liveRideInfo,
        driverLocation: { lat: loc.lat, long: loc.long },
      })
    );
  
    if (liveRideInfo.status === RideStatus.DRIVER_ON_THE_WAY) {
      fitMapToBounds(liveRideInfo.driverLocation, liveRideInfo.riderLocation);
      await updateGeoJsonAndStatus(loc, liveRideInfo.riderLocation, RideStatus.HEADING_TO_DESTINATION);
    } else if (liveRideInfo.status === RideStatus.HEADING_TO_DESTINATION) {
      fitMapToBounds(liveRideInfo.driverLocation, liveRideInfo.riderDestination);
      await updateGeoJsonAndStatus(loc, liveRideInfo.riderDestination, RideStatus.ARRIVED_TO_DESTINATION);
    }
  }, 2000);

  const updateGeoJsonAndStatus = async (currentLoc: LatLong, targetLoc: LatLong, nextStatus: RideStatus) => {
    const newGeoJson = await getGeoJson(currentLoc, targetLoc);
    dispatch(updateLiveRideInfo({ ...liveRideInfo, geoJSON: newGeoJson?.geoJSON }));

    const distance = calculateHaversineDistance(currentLoc.lat, currentLoc.long, targetLoc.lat, targetLoc.long);
    if (distance < 0.05) {
      dispatch(updateLiveRideInfo({ ...liveRideInfo, status: nextStatus }));
    }
  };

  const watchDriverLocation = () => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude: lat, longitude: long, accuracy } = position.coords;

        const difference = calculateHaversineDistance(lat, long, liveRideInfo.driverLocation?.lat as number, liveRideInfo.driverLocation?.long as number)

        if (!difference || difference > 0.02) {
          updateDriverLocation({ lat, long });
          if (connection?.state === HubConnectionState.Connected) {
            connection.send("DriverLocationChange", lat, long, liveRideInfo.riderId, user.id);
          }
        }

        console.log(`lat = ${lat}`, `long = ${long}`, `accuracy = ${accuracy}m`);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId)
      updateDriverLocation.cancel()
    };
  };

  const fitMapToBounds = (driverLoc: LatLong, targetLoc: LatLong) => {
    const bounds = new LngLatBounds(
      [Math.min(driverLoc.long, targetLoc.long), Math.min(driverLoc.lat, targetLoc.lat)],
      [Math.max(driverLoc.long, targetLoc.long), Math.max(driverLoc.lat, targetLoc.lat)]
    );

    mapRef.current?.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });
  };

  return (
    <Map
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: 10 }}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {liveRideInfo.status === RideStatus.DRIVER_ON_THE_WAY && (
        <Marker latitude={liveRideInfo.riderLocation.lat} longitude={liveRideInfo.riderLocation.long}>
          <Circle />
        </Marker>
      )}

      <Marker latitude={liveRideInfo.riderDestination.lat} longitude={liveRideInfo.riderDestination.long}>
        <Square />
      </Marker>

      <Marker latitude={liveRideInfo.driverLocation.lat} longitude={liveRideInfo.driverLocation.long}>
        <img src="/car-white.svg" alt="Driver's Car" height={40} width={40} />
      </Marker>

      {liveRideInfo.geoJSON && (
        <Source id="route" type="geojson" data={liveRideInfo.geoJSON}>
          <Layer {...lineLayer as any} />
        </Source>
      )}
    </Map>
  );
};

export default LiveRideMap;