// файл типов

export type Status = 'confirmed' | 'cancelled'
export interface City {
    code: string,
    name: string,
    country: string
}
export interface Flight {
    id: string,
    flightNumber: string,
    airline: {
        code: string,
        name: string,
    }
    origin: City,
    destination: City,
    departureAt: string,
    arrivalAt: string,
    durationMinutes: number,
    price: {
        amount: number,
        currency: string
    },
    seatsAvailable: number
}
export interface Booking {
    code: string,
    status: Status,
    flight: Flight,
    passengers: Passenger[],
    contact: {
        email: string,
        phone: string
    }
    totalPrice: {
        amount: number,
        currency: string
    }
    createdAt: string
}

export interface Passenger {
    firstName: string,
    lastName: string,
    dateOfBirth: string
    documentNumber: string
}

export interface SearchFlightParams {
    origin: string,
    destination: string,
    date: string,
}