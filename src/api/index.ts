import type { City, Flight, SearchFlightParams } from "../types"

// базовый инстанс для fetch
export const getCities = async (): Promise<City[]> => {
    const response = await fetch('/api/cities')
    if(!response.ok) {
        throw new Error(`Ошибка получения городов ${response.status}`)
    }
    return response.json()
}

export const searchFlights = async (params: SearchFlightParams): Promise<Flight[]> => {
    const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        date: params.date
    })
    const response = await fetch(`/api/flights?${queryParams.toString()}`)

    if(!response.ok) {
        throw new Error(`Ошибка получения списка `)
    }

    return response.json();
}