'use client'
import React, { useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RideInfo } from '@/types';
import Circle from '../Icons/Circle';
import Square from '../Icons/Square';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const ChooseRideMap = ({ rideInfo }: {  rideInfo: RideInfo }) => {

    const [viewport, setViewport] = useState({
        latitude: rideInfo.location.lat,
        longitude: rideInfo.location.long,
        zoom: 13
    });

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

    return (
        <Map
            initialViewState={viewport}
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
