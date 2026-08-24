import { useLocation, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { useEffect, useState } from "react";
import type { Booking, Flight, Passenger } from "../../types";
import { createBooking, getFlightById } from "../../api";

export const BookingPage = () => {

    const { id } = useParams<{ id: string }>(); // Достаем id рейса из URL
    const location = useLocation();
    const initialPassengersCount = location.state?.passengers || 1;

    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorFlight, setErrorFlight] = useState(false);

    const [passengers, setPassengers] = useState<Passenger[]>(
    Array(initialPassengersCount).fill(null).map(() => ({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        documentNumber: ''
        }))
    );
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Стейты для отправки и результатов
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setErrorFlight(false);

        getFlightById(id)
        .then(setFlight)
        .catch((err) => {
            console.error(err);
            setErrorFlight(true); // Включаем состояние "рейс не найден"
        })
        .finally(() => setLoading(false));
    }, [id]);

    const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
        setPassengers(prev => prev.map((passenger, i) => 
        i === index ? { ...passenger, [field]: value } : passenger
        ));
    };

    const handleAddPassenger = () => {
        setPassengers(prev => [
        ...prev,
        { firstName: '', lastName: '', dateOfBirth: '', documentNumber: '' }
        ]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        const isFormValid = email.trim() && phone.trim() && passengers.every(p => 
            p.firstName.trim() && p.lastName.trim() && p.dateOfBirth.trim() && p.documentNumber.trim()
        );

        if (!isFormValid) {
            setBookingError('Пожалуйста, заполните все обязательные поля формы.');
            return;
        }

        setIsSubmitting(true);
        setBookingError(null);

        try {
            const response = await createBooking({
                flightId: id,
                passengers,
                contact: { email, phone }
            });
            setSuccessBooking(response); // Показываем панель успеха
        } catch (err: any) {
            console.error(err);
            setBookingError(err.message || 'Произошла ошибка при оформлении бронирования.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Загрузка данных рейса...</div>;
    }

    if (errorFlight || !flight) {
        return (
            <div data-testid="flight-not-found" className="max-w-md mx-auto mt-12 bg-white border border-red-200 rounded-xl p-6 text-center shadow-sm">
                <h2 className="text-xl font-bold text-red-700 mb-2">Рейс не найден</h2>
                <p className="text-sm text-gray-600">Запрошенный вами авиарейс отсутствует в системе или был отменен.</p>
            </div>
        );
    }

    if (successBooking) {
        return (
            <div data-testid="booking-success" className="space-y-4 py-6 max-w-xl">
                {/* Заголовок */}
                <h1 className="text-3xl font-bold text-gray-900">
                Бронирование оформлено
                </h1>

                {/* Код бронирования */}
                <p className="text-lg text-gray-800">
                Код бронирования: <span data-testid="booking-code" className="font-bold">{successBooking.code}</span>
                </p>

                {/* Маршрут и номер рейса */}
                <p className="text-lg text-gray-800">
                {successBooking.flight.origin.name} ➔ {successBooking.flight.destination.name}, {successBooking.flight.flightNumber}
                </p>

                {/* Количество пассажиров */}
                <p className="text-lg text-gray-800">
                Пассажиров: {successBooking.passengers.length}
                </p>

                {/* Итоговая стоимость */}
                <p className="text-lg text-gray-800">
                Итого: {successBooking.totalPrice.amount.toLocaleString('ru-RU')} {successBooking.totalPrice.currency === 'RUB' ? '₽' : successBooking.totalPrice.currency}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-6 max-w-3xl mx-auto">
            <div data-testid="booking-flight" className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-2">
                <h2 className="font-bold text-lg text-blue-900">Выбранный рейс: {flight.flightNumber}</h2>
                <div className="text-sm text-blue-800 flex gap-4">
                <span>Откуда: <strong>{flight.origin.name} ({flight.origin.code})</strong></span>
                <span>➔</span>
                <span>Куда: <strong>{flight.destination.name} ({flight.destination.code})</strong></span>
                </div>
                <div className="text-xs text-blue-600">
                    Вылет: {new Date(flight.departureAt).toLocaleString('ru-RU')} | Время прилета: {new Date(flight.arrivalAt).toLocaleString('ru-RU')} | Стоимость билета: <b>{flight.price.amount} {flight.price.currency}</b>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">Оформление бронирования</h1>

            {bookingError && (
                <div data-testid="booking-error" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center text-sm font-medium">
                {bookingError}
                </div>
            )}

            <form data-testid="booking-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Данные пассажиров */}
                {passengers.map((passenger, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">
                    Пассажир #{index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`p-${index}-fn`} className="block text-sm font-medium text-gray-700 mb-1">Имя (латиницей) *</label>
                        <Input 
                        id={`p-${index}-fn`}
                        data-testid={`passenger-${index}-firstName`} // Нумерация с 0 строго по ТЗ
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor={`p-${index}-ln`} className="block text-sm font-medium text-gray-700 mb-1">Фамилия (латиницей) *</label>
                        <Input 
                        id={`p-${index}-ln`}
                        data-testid={`passenger-${index}-lastName`} // Нумерация с 0 строго по ТЗ
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor={`p-${index}-db`} className="block text-sm font-medium text-gray-700 mb-1">Дата рождения *</label>
                        <Input 
                        id={`p-${index}-db`}
                        data-testid={`passenger-${index}-dob`} // Нумерация с 0 строго по ТЗ
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor={`p-${index}-dc`} className="block text-sm font-medium text-gray-700 mb-1">Серия и номер документа *</label>
                        <Input 
                        id={`p-${index}-dc`}
                        data-testid={`passenger-${index}-document`} // Нумерация с 0 строго по ТЗ
                        value={passenger.documentNumber}
                        onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
                        required
                        />
                    </div>
                    </div>
                </div>
                ))}

                {/* Кнопка добавления пассажира */}
                <button
                type="button"
                data-testid="add-passenger" // Строго по ТЗ
                onClick={handleAddPassenger}
                className="w-full border border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-gray-50/50 py-3 rounded-xl text-sm font-medium text-gray-500 transition-colors cursor-pointer text-center"
                >
                + Добавить еще одного пассажира
                </button>

                {/* Контактные данные */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Контактные данные</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="c-email" className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <Input 
                        id="c-email"
                        data-testid="contact-email" // Строго по ТЗ
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="c-phone" className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                    <Input 
                        id="c-phone"
                        data-testid="contact-phone" // Строго по ТЗ
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    </div>
                </div>
                </div>

                {/* Итоговая сумма и кнопка отправки */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-xl gap-4">
                <div className="text-gray-700 text-sm">
                    Всего пассажиров: <strong className="text-gray-900">{passengers.length}</strong> | К оплате: <strong className="text-lg text-blue-600">{(flight.price.amount * passengers.length).toLocaleString('ru-RU')} {flight.price.currency}</strong>
                </div>
                <button 
                    type="submit"
                    data-testid="booking-submit" // Строго по ТЗ
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer w-full sm:w-auto text-center"
                >
                    {isSubmitting ? 'Оформление...' : 'Подтвердить бронирование'}
                </button>
                </div>
            </form>
        </div>
    );
};