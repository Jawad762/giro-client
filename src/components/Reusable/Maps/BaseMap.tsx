'use client';
import React, { useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

type Location = {
  long: number;
  lat: number;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const BaseMap = ({ connection, viewport, setViewport }: { connection: HubConnection, viewport: any, setViewport: any }) => {

  useEffect(() => {
    const clearWatch = getUserLocation();

    return () => {
      clearWatch()
    };
  }, [connection.state]);

  const getUserLocation = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        setViewport({
          zoom: 18,
          latitude: lat,
          longitude: long,
        });
        if (connection?.state === HubConnectionState.Connected) {
          connection.send('SubscribeToLocation', lat, long)
        }
        console.log(`lat = ${lat}`, `long = ${long}`, `accuracy = ${accuracy}m`);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      if (connection?.state === HubConnectionState.Connected) {
        connection.send('UnsubscribeFromLocation')
      }
      navigator.geolocation.clearWatch(watchId)
    };
  };

  return viewport && (
    <Map
      initialViewState={viewport}
      style={{ width: '100%', height: '100%', borderRadius: 10 }}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
        <h2 className='bg-black text-white p-2 text-xs font-bold rounded-md relative border-2 after:absolute after:bottom-[-8px] after:left-2 after:h-2 after:w-2 after:bg-black after:border-x-2 after:border-b-2'>You're here</h2>
        <img src="/car-white.svg" alt="Driver's Car" height={40} width={40} />
      </Marker>
    </Map>
  );
};

export default BaseMap;
