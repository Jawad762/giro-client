'use client'
import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

type Location = {
    long: number
    lat: number
}

const MapComponent = ({ location, destination }: { location: Location, destination: Location}) => {

    const driverLocation = {
        lat: 33.8434708,
        long: 35.4987351
    };

    const [viewport, setViewport] = useState({
        latitude: location.lat,
        longitude: location.long,
        zoom: 13
    });

    const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);

    useEffect(() => {
        const getRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.long},${location.lat};${destination.long},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

            const response = await axios.get(url);
            const data = response.data;

            const routeCoordinates = data.routes[0].geometry.coordinates;

            setRouteGeoJSON({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates
                }
            });
        };

        getRoute();
    }, [location, destination]);

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

            {routeGeoJSON && (
                <Source id="route" type="geojson" data={routeGeoJSON}>
                    {/* @ts-ignore */}
                    <Layer {...lineLayer} />
                </Source>
            )}
        </Map>
    );
};

export default MapComponent;
