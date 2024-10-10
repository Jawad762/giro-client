'use client'
import React, { useState } from 'react';
import Map, { Marker, Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LiveRideMapInfo as MapType } from '@/types';
import Circle from '../Icons/Circle';
import Square from '../Icons/Square';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const LiveRideMap = ({ liveRideInfo }: { liveRideInfo: MapType }) => {

    const [viewport, setViewport] = useState({
        latitude: liveRideInfo.riderLocation.lat,
        longitude: liveRideInfo.riderLocation.long,
        zoom: 15
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
            <Marker latitude={liveRideInfo.riderLocation.lat} longitude={liveRideInfo.riderLocation.long}>
                <Circle/>
            </Marker>
            
            <Marker latitude={liveRideInfo.riderDestination.lat} longitude={liveRideInfo.riderDestination.long}>
                <Square/>
            </Marker>

            <Marker latitude={liveRideInfo.driverLocation.lat} longitude={liveRideInfo.driverLocation.long}>
                {/* <h2 className='bg-black text-white p-2 text-xs font-bold rounded-md relative border-2 after:absolute after:bottom-[-8px] after:left-2 after:h-2 after:w-2 after:bg-black after:border-x-2 after:border-b-2'>You're here</h2> */}
                <img src="/car-white.svg" alt="Driver's Car" height={40} width={40} />
            </Marker>

            {liveRideInfo?.geoJSON && (
                <Source id="route" type="geojson" data={liveRideInfo.geoJSON}>
                    {/* @ts-ignore */}
                    <Layer {...lineLayer} />
                </Source>
            )}
        </Map>
    );
};


export default LiveRideMap;