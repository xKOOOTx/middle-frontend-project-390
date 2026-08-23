import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {

  }, [])
  return (
    <>
      <h1 className="text-4xl font-bold text-red-500 underline">
        Проверка Tailwind!
      </h1>
    </>
  )
}

export default App
