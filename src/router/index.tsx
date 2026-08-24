import { createBrowserRouter, Link, Outlet } from 'react-router-dom'
import { MainPage } from '../pages/Main'
import { BookingPage } from '../pages/Booking'
import { CabinetPage } from '../pages/Cabinet'
import { NotFound } from '../components/NotFound'
const RootLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white border-b border-gray-200 p-4">
                <div className="max-w-6xl mx-auto flex gap-6 items-center">
                    <Link to='/' className='text-xl font-bold mr-4 text-blue-600'>
                        <h1>Бронирование авиабилетов</h1>
                    </Link>
                    <nav className='flex gap-4'>
                        <Link to='/' className='text-blue-500 hover:underline'>Поиск рейсов</Link>
                        <Link to='/booking' className='text-blue-500 hover:underline'>Мои брони</Link>
                    </nav>
                </div>
            </header>
            <main className='max-w-6xl mx-auto mt-6 px-4'>
                <Outlet />
            </main>
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <MainPage />
            },
            {
                path: '/booking/:id',
                element: <BookingPage />
            },
            {
                path: '/cabinet',
                element: <CabinetPage />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    },
])