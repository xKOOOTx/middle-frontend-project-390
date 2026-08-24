import type { Flight } from "../../types";

interface FlightCardProps {
    flight: Flight,
    passengersCount: number,
    onSelect: (flightId: string) => void
}
export const Card = ({flight, passengersCount, onSelect}: FlightCardProps) => {

    const totalAmount = flight.price.amount * passengersCount;

    const departureDate = new Date(flight.departureAt).toLocaleString('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
    const arrivalDate = new Date(flight.arrivalAt).toLocaleString('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short'
    })

    return (
        <div data-testid="flight-result-item" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
            <div className="space-y-2">
                {/* Авиакомпания и номер рейса */}
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-blue-600">{flight.airline.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-semibold">
                        {flight.flightNumber}
                    </span>
                </div>
                
                {/* Маршрут: Откуда -> Куда */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                    <div>
                        <span className="font-semibold">{flight.origin.name}</span> 
                        <span className="text-gray-400 text-xs ml-1">({flight.origin.code})</span>
                    </div>
                    <span className="text-gray-400">➔</span>
                    <div>
                        <span className="font-semibold">{flight.destination.name}</span> 
                        <span className="text-gray-400 text-xs ml-1">({flight.destination.code})</span>
                    </div>
                </div>
                
                {/* Дополнительная инфа */}
                <div className="text-xs text-gray-400">
                    Вылет: {departureDate} | Время прибытия: {arrivalDate} | В пути: {flight.durationMinutes} мин.
                </div>
            </div>

            {/* Правая часть: Цена и Кнопка */}
            <div className="flex items-center md:flex-col justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 gap-2">
                <div className="text-left md:text-right">
                    <div className="text-xs text-gray-400">
                        Стоимость {passengersCount > 1 ? `(за ${passengersCount} пасс.)` : ''}
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                        {totalAmount.toLocaleString('ru-RU')} {flight.price.currency}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                        Осталось мест: {flight.seatsAvailable}
                    </div>
                </div>
                
                <button
                    data-testid="book-flight"
                    onClick={() => onSelect(flight.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer w-full md:w-auto text-center"
                >
                    Забронировать
                </button>
            </div>
        </div>
    )
}