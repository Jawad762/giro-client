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
    duration: number
    distance: number
    locationAddress: string
    destinationAddress: string
    riderConnection: string
}

export interface DriverInfo {
    driverName: string
    car: string
    profilePicture: string
    location: number[]
}

export interface LiveRideMapInfo {
    riderDestination: LatLong
    riderLocation: LatLong
    driverLocation: LatLong
    geoJSON: any
    distance: number
}