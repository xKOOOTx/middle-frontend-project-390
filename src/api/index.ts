import type { Booking, City, CreateBookingPayload, Flight, SearchFlightParams } from "../types"

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

export const getFlightById = async (id: string): Promise<Flight> => {
  const response = await fetch(`/api/flights/${id}`);
  if (!response.ok) {
    throw new Error(`Ошибка получения данных рейса: ${response.status}`);
  }
  return response.json();
};

// Создание нового бронирования
export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Ошибка сервера: ${response.status}`);
    (error as any).statusCode = response.status;
    throw error;
  }

  return response.json();
};

export const getBookingByCode = async (code: string, lastName: string): Promise<Booking> => {
  const queryParams = new URLSearchParams({ lastName });
  const response = await fetch(`/api/bookings/${code}?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Бронь не найдена: ${response.status}`);
  }
  return response.json();
};

export const cancelBookingByCode = async (code: string, lastName: string): Promise<Booking> => {
  const response = await fetch(`/api/bookings/${code}/cancel`, {
    method: 'POST', // Используем POST строго по спецификации сервера
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({lastName})
  });

  if (!response.ok) {
    throw new Error(`Не удалось отменить бронирование: ${response.status}`);
  }
  return response.json();
};