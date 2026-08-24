import { Link } from "react-router-dom"

export const NotFound = () => {

    return (
        <main className="grid min-h-full place-items-center bg-gray-50 text-gray-900 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">Страница которую вы ищете не найдена</h1>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/" className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Вернуться на главную</Link>
                </div>
            </div>
        </main>
    )
}