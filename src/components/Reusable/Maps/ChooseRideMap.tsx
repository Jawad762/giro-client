'use client'
import React, { useEffect, useRef } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LatLong, RideInfo } from '@/types';
import Circle from '../Icons/Circle';
import Square from '../Icons/Square';
import { LngLatBounds } from 'mapbox-gl';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const ChooseRideMap = ({ rideInfo }: {  rideInfo: RideInfo }) => {

    const mapRef = useRef<MapRef>(null)

    const lineLayer = {
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#888',
            'line-width': 4
        }
    };

    const fitMapToBounds = (location: LatLong, destination: LatLong) => {
        const bounds = new LngLatBounds(
          [Math.min(location.long, destination.long), Math.min(location.lat, destination.lat)],
          [Math.max(location.long, destination.long), Math.max(location.lat, destination.lat)]
        );

        mapRef.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
    };

    useEffect(() => {
        if (rideInfo.location && rideInfo.destination) {
            setTimeout(() => {
                fitMapToBounds(rideInfo.location, rideInfo.destination);
            }, 200)
        }
      }, [rideInfo.destination, rideInfo.location]);

    return (
        <Map
            ref={mapRef}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            
            <Marker latitude={rideInfo.location.lat} longitude={rideInfo.location.long}>
                <Circle/>
            </Marker>
            <Marker latitude={rideInfo.destination.lat} longitude={rideInfo.destination.long}>
                <Square/>
            </Marker>

            {rideInfo?.geoJSON && (
                <Source id="route" type="geojson" data={rideInfo.geoJSON}>
                    {/* @ts-ignore */}
                    <Layer {...lineLayer} />
                </Source>
            )}
        </Map>
    );
};

export default ChooseRideMap;
