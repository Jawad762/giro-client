export interface UserType {
    id: number
    email: string
    firstName: string
    lastName: string
    profilePicture?: string
    role: string
    isConfirmed: boolean
}

export interface JwtType {
    accessToken: string
    refreshToken: string
}

export interface ErrorType {
    response: {
        data: {
            errorDetails: string | null
            errorMessage: string
            status: string
        }
    }
}

export interface LocationType {
    description: string
    lat: number
    long: number
}

export interface LatLong {
    lat: number
    long: number
}

export interface RideInfo {
    geoJSON: any
    distance: number
    duration: number
    location: LatLong
    destination: LatLong
}

export interface ConfirmRideInfo {
    riderName: string;
    riderId: number;
    location: number[];
    destination: number[];
    price: number;
}

export interface ExtendedRideInfo extends ConfirmRideInfo {
    durationInMinutes: number
    distanceInKilometers: number
    locationAddress: string
    destinationAddress: string
    riderId: number
    riderProfilePicture: string
}

export interface DriverInfo {
    driverName: string
    car: string
    location: number[]
    driverProfilePicture: string
}

export enum RideStatus {
    DRIVER_ON_THE_WAY,
    HEADING_TO_DESTINATION,
    ARRIVED_TO_DESTINATION
}

export interface LiveRideMapInfo extends DriverInfo {
    riderDestination: LatLong
    riderLocation: LatLong
    driverLocation: LatLong
    geoJSON: any
    distance: number
    riderId: number
    status: RideStatus
}

export interface VehicleInfo {
    type: string | null;
    color: string | null;
    licenseNumber: string | null
}