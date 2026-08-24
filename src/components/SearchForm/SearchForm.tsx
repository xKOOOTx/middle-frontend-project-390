import { useState } from "react"
import { Input } from "../Input"
import type { City, SearchFlightParams } from "../../types";

interface SearchFormParams {
    cities: City[]
    onSearch: (params: SearchFlightParams & { passengers: number}) => void
}

export const SearchForm = ({cities = [], onSearch}: SearchFormParams) => {

    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !date) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        // Передаем собранные данные наверх, в MainPage
        onSearch({ origin, destination, date, passengers });
    };

    return (
        <form 
            className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            onSubmit={handleSubmit}
        >
            <div className="flex-1">
                <label htmlFor="origin-select" className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Откуда</label>
                <select 
                    id="origin-select"
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                >
                    <option value=''>Выберите город</option>
                    {cities.map(city => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex-1">
                <label htmlFor="destination-select" className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Куда</label>
                <select
                    id="destination-select"
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                >
                    <option value="">Выберите город</option>
                    {cities
                    .filter((city) => city.code !== origin)
                    .map(city => (
                        <option value={city.code}>{city.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Дата</label>
                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div className="flex-1">
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500">Пассажиры</label>
                <Input
                    id="passengers"
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    min={0}
                    required
                    />
            </div>
            <div className="flex items-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium w-full h-10.5">
                    Найти
                </button>
            </div>
        </form>
    )
}