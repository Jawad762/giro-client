import axios from "axios";
import { LatLong } from "./types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export const getGeoJson = async (loc1: LatLong, loc2: LatLong) => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${loc1.long},${loc1.lat};${loc2.long},${loc2.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

      const response = await axios.get(url);
      const data = response.data;
      const routeCoordinates = data.routes[0].geometry.coordinates;

      return {
        geoJSON: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeCoordinates,
          },
        },
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    } catch (error) {
      console.error(error);
    }
  };

  export const calculateHaversineDistance = (lat1: number, long1: number, lat2: number, long2: number) =>
  {
      const R = 6371;
      const lat1Rad = toRadians(lat1);
      const lon1Rad = toRadians(long1);
      const lat2Rad = toRadians(lat2);
      const lon2Rad = toRadians(long2);

      const dLat = lat2Rad - lat1Rad;
      const dLon = lon2Rad - lon1Rad;

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
  }

  const toRadians = (angle: number) =>
  {
      return angle * (Math.PI / 180);
  }

  // const calculateNextPosition = (currentLat: number, currentLng: number, targetLat: number, targetLng: number, speedFactor: number) => {
//     const latDiff = targetLat - currentLat;
//     const lngDiff = targetLng - currentLng;

//     console.log(`lat diff = ${latDiff}`)
//     console.log(`long diff = ${lngDiff}`)

//     const stepLat = latDiff * speedFactor;
//     const stepLng = lngDiff * speedFactor;

//     return {
//         lat: currentLat + stepLat,
//         long: currentLng + stepLng
//     };
// };

// useEffect(() => {
//     const interval = setInterval(() => {
//         const speedFactor = 0.01;

//         const nextPosition = calculateNextPosition(
//             liveRideInfo.driverLocation.lat,
//             liveRideInfo.driverLocation.long,
//             liveRideInfo.riderLocation.lat,
//             liveRideInfo.riderLocation.long,
//             speedFactor
//         );

//         dispatch(updateLiveRideInfo({
//             ...liveRideInfo,
//             driverLocation: {
//                 lat: nextPosition.lat,
//                 long: nextPosition.long
//             }
//         }));
//     }, 1000);

//     return () => clearInterval(interval);
// }, [liveRideInfo, dispatch]);
