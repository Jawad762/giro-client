'use client'
import React, { useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type Location = {
    long: number
    lat: number
}

export type RideInfo = {
    geoJSON: any
    distance: number
    duration: number
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const MapComponent = ({ location, destination, rideInfo }: { location: Location, destination: Location, rideInfo: RideInfo }) => {

    const driverLocation = {
        lat: 33.8434708,
        long: 35.4987351
    };

    const [viewport, setViewport] = useState({
        latitude: location.lat,
        longitude: location.long,
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
            <Marker latitude={location.lat} longitude={location.long} color='black'/>
            <Marker latitude={destination.lat} longitude={destination.long} color='black'/>
            <Marker latitude={driverLocation.lat} longitude={driverLocation.long}>
                <img src='/car-white.svg' alt="Driver's Car" height={40} width={40}/>
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

export default MapComponent;
