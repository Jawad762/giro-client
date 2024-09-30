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