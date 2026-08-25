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
    const [searchError, setSearchError] = useState<string | null>(null)

    const navigate = useNavigate()
    
    useEffect(() => {
        const initPage = async () => {
        try {
            const fetchedCities = await getCities();
            setCities(fetchedCities);

            // Показываем список рейсов сразу при открытии главной (с разумными дефолтами)
            setLoadingFlights(true);
            const today = new Date().toISOString().split('T')[0];
            const defaultFlights = await searchFlights({
            origin: 'MOW',
            destination: 'LED',
            date: today,
            });
            setFlights(defaultFlights);
        } catch (error) {
            console.error(error);
            setSearchError('Не удалось загрузить данные. Пожалуйста, обновите страницу.');
        } finally {
            setLoadingCities(false);
            setLoadingFlights(false);
        }
        };

        initPage();
    }, []);

    useEffect(() => {
        getCities()
        .then(setCities)
        .catch(console.error)
        .finally(() => setLoadingCities(false))
    }, [])

    const handleSearch = async (params: SearchFlightParams & { passengers: number }) => {
        setLoadingFlights(true)
        setSearchError(null);
        setCurrentPassengers(params.passengers)

        try {
            const data = await searchFlights({
                origin: params.origin,
                destination: params.destination,
                date: params.date,
            })
            setFlights(data)
        } catch (error) {
            console.error('Ошибка:', error);
            setSearchError('Произошла ошибка при поиске рейсов. Попробуйте еще раз.')
        } finally {
            setLoadingFlights(false);
        }
    }

    const handleSelectFlight = (flightId: string) => {
        navigate(`/booking/${flightId}`, { state: { passengers: currentPassengers } })
    }

    if (loadingCities) {
        return <div className="p-6 text-center text-gray-500">Загрузка интерфейса...</div>;
    }

    return (
        <div className="space-y-4">
            <SearchForm cities={cities} onSearch={handleSearch} />
            {/* Состояние загрузки */}
            {loadingFlights && (<div>Загрузка...</div>)}
            {/* Состояние ошибки */}
            {!loadingFlights && searchError && (
                <div data-testid="flights-error" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
                    {searchError}
                </div>
            )}
            {/* Состояние пустого результата */}
            {!loadingFlights && !searchError && flights.length === 0 && (
                <div data-testid="flights-empty" className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
                    Рейсов не найдено. Попробуйте изменить параметры поиска.
                </div>
            )}
            {/* Состояние загруженного результата */}
            {!loadingFlights && !searchError && flights.length > 0 && (
                <div data-testid="flight-results" className="space-y-4">
                    {flights.map((flight) => (
                    <Card
                        key={flight.id}
                        flight={flight}
                        passengersCount={currentPassengers}
                        onSelect={handleSelectFlight}
                    />
                    ))}
                </div>
            )}
            <div className="mt-12 pt-6 border-t border-gray-100 flex justify-center">
                <button
                    type="button"
                    onClick={() => {
                    throw new Error("Тестовая ошибка фронтенда для проверки Bugsink!");
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                    Спровоцировать ошибку прода
                </button>
            </div>
        </div>
    )
}