import { useState } from "react"
import { SearchForm } from "../../components/SearchForm"
import type { City, Flight } from "../../types"

export const MainPage = () => {
    
    const [cities, setCities] = useState<City[]>([])
    const [flights, setFlights] = useState<Flight[]>([])
    const [loadingCities, setLoadingCities] = useState(true)
    const [loadingFlights, setLoadingFlights] = useState(true)

    
    return (
        <div>
            <SearchForm cities={cities} onSearch={() => {}} />
            Главная страница
        </div>
    )
}