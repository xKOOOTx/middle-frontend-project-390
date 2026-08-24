import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SearchForm } from "../../components/SearchForm"
import type { City, Flight, SearchFlightParams } from "../../types"
import { getCities, searchFlights } from "../../api"
import { Card } from "../../components/Card"

export const MainPage = () => {
    
    const [cities, setCities] = useState<City[]>([])
    const [flights, setFlights] = useState<Flight[]>([])
    const [loadingCities, setLoadingCities] = useState(true)
    const [loadingFlights, setLoadingFlights] = useState(false)
    const [currentPassengers, setCurrentPassengers] = useState(1)

    const navigate = useNavigate()
    
    useEffect(() => {
        getCities()
        .then(setCities)
        .catch(console.error)
        .finally(() => setLoadingCities(false))
    }, [])

    const handleSearch = async (params: SearchFlightParams & { passengers: number }) => {
        setLoadingFlights(true)

        try {
            const data = await searchFlights({
                origin: params.origin,
                destination: params.destination,
                date: params.date,
            })
            setFlights(data)
            setCurrentPassengers(params.passengers)
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setLoadingFlights(false);
        }
    }

    const handleSelectFlight = (flightId: string) => {
        navigate(`/booking?flightId=${flightId}&passengers=${currentPassengers}`)
    }

    if (loadingCities) {
        return <div className="p-6 text-center text-gray-500">Загрузка интерфейса...</div>;
    }

    return (
        <div className="space-y-4">
            <SearchForm cities={cities} onSearch={handleSearch} />
            {loadingFlights ? 
                (<div>Загрузка...</div>) : 
                (
                    <div className="space-y-4">
                        {flights.map(flight => (
                            <Card key={flight.id} flight={flight} passengersCount={currentPassengers} onSelect={handleSelectFlight} />
                        ))}
                    </div>
                )
            }
        </div>
    )
}