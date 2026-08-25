import { useState } from "react";
import { Input } from "../../components/Input"
import type { Booking } from "../../types";
import { cancelBookingByCode, getBookingByCode } from "../../api";

export const CabinetPage = () => {

    const [code, setCode] = useState('');
    const [lastName, setLastName] = useState('');

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim() || !lastName.trim()) return;

        setLoading(true);
        setError(null);
        setBooking(null);

        try {
            const data = await getBookingByCode(code.trim(), lastName.trim());
            setBooking(data);
        } catch (err) {
            console.error(err);
            setError('Бронирование не найдено. Проверьте код и фамилию.');
        } finally {
            setLoading(false);
        }
    };

  const handleCancel = async () => {
    if (!booking) return;

    setIsCancelling(true);
    setError(null);
    try {
      const updatedBooking = await cancelBookingByCode(booking.code, lastName);
      setBooking(updatedBooking); // Обновляем состояние, сервер вернет статус 'cancelled'
    } catch (err) {
      console.error(err);
      setError('Не удалось отменить бронирование. Попробуйте позже.');
    } finally {
      setIsCancelling(false);
    }
  };

    return (
        <div className="space-y-6 py-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Управление бронированием</h1>
                <p className="mt-1 text-sm text-gray-500">Поиск, проверка статуса и отмена ваших авиабилетов</p>
            </div>

            {/* ФОРМА ПОИСКА БРОНИ */}
            <form 
                data-testid="booking-lookup-form" // <-- ТЗ
                onSubmit={handleSearch} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-end"
            >
                <div className="flex-1 w-full">
                    <label htmlFor="lookup-code" className="block text-sm font-medium text-gray-700 mb-1">Код бронирования *</label>
                    <Input 
                        id="lookup-code"
                        data-testid="lookup-code" // <-- ТЗ
                        placeholder="Например, 0S54B6"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                <div className="flex-1 w-full">
                    <label htmlFor="lookup-lastName" className="block text-sm font-medium text-gray-700 mb-1">Фамилия пассажира *</label>
                    <Input 
                        id="lookup-lastName"
                        data-testid="lookup-lastName" // <-- ТЗ
                        placeholder="Латиницей, как в брони"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    data-testid="lookup-submit" // <-- ТЗ
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer w-full sm:w-auto h-[42px]"
                >
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
            </form>

            {/* СОСТОЯНИЕ: НЕ НАЙДЕНО */}
            {error && (
                <div data-testid="booking-not-found" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center text-sm font-medium">
                    {error}
                </div>
            )}

            {/* КАРТОЧКА НАЙДЕННОЙ БРОНИ */}
            {booking && (
                <div data-testid="booking-details" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                {/* Шапка брони */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                        <div className="text-xs text-gray-400 uppercase font-semibold">Код брони</div>
                        <div data-testid="booking-code" className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                            {booking.code}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Статус</div>
                        <span 
                            data-testid="booking-status" 
                            data-status={booking.status} // <-- ТЗ
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {booking.status === 'confirmed' ? 'Подтверждена' : 'Отменена'}
                        </span>
                    </div>
                </div>

                {/* Данные перелета */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 text-sm">Информация о рейсе</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-bold text-blue-600">{booking.flight.airline.name} ({booking.flight.flightNumber})</div>
                        <div className="text-sm mt-1 text-gray-700">
                            Маршрут: <strong>{booking.flight.origin.name}</strong> ➔ <strong>{booking.flight.destination.name}</strong>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Вылет: {new Date(booking.flight.departureAt).toLocaleString('ru-RU')}
                        </div>
                    </div>
                </div>

                {/* Список пассажиров */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 text-sm">Пассажиры</h3>
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                        {booking.passengers.map((p, idx) => (
                            <li key={idx} className="p-3 text-sm text-gray-700 bg-white flex justify-between">
                            <span>{p.firstName} {p.lastName}</span>
                            <span className="text-gray-400 font-mono text-xs">Док: {p.documentNumber}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Итоговая стоимость и кнопка отмены */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                    <div>
                        <div className="text-xs text-gray-400 uppercase font-semibold">Итого оплачено</div>
                        <div className="text-xl font-bold text-gray-900">
                            {booking.totalPrice.amount.toLocaleString('ru-RU')} {booking.totalPrice.currency === 'RUB' ? '₽' : booking.totalPrice.currency}
                        </div>
                    </div>

                    {/* Показываем кнопку отмены только если бронь активна */}
                    {booking.status === 'confirmed' && (
                        <button
                            type="button"
                            data-testid="cancel-booking" // <-- ТЗ
                            disabled={isCancelling}
                            onClick={handleCancel}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer border border-red-200"
                        >
                            {isCancelling ? 'Отмена...' : 'Отменить бронирование'}
                        </button>
                    )}
                </div>
                </div>
            )}
            </div>
    )
}