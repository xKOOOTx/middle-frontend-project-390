import { useEffect, useState } from "react"
import { SearchForm } from "../../components/SearchForm"
import type { City, Flight, SearchFlightParams } from "../../types"
import { getCities, searchFlights } from "../../api"

export const MainPage = () => {
    
    const [cities, setCities] = useState<City[]>([])
    const [flights, setFlights] = useState<Flight[]>([])
    const [loadingCities, setLoadingCities] = useState(true)
    const [loadingFlights, setLoadingFlights] = useState(false)
    const [currentPassengers, setCurrentPassengers] = useState(1)

    useEffect(() => {
        console.log(flights)
        console.log(currentPassengers)
    },[])
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

    if (loadingCities) {
        return <div className="p-6 text-center text-gray-500">Загрузка интерфейса...</div>;
    }

    return (
        <div>
            <SearchForm cities={cities} onSearch={handleSearch} />
            Главная страница
            {loadingFlights && (<div>Загрузка...</div>)}
        </div>
    )
}