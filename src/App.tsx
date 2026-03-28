import { useState } from 'react'
import { WelcomeScreen } from './components/WelcomeScreen'
import { HomeScreen } from './components/HomeScreen'
import './index.css'

export interface Coordinates {
  latitude: number;
  longitude: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'home'>('welcome')
  const [coords, setCoords] = useState<Coordinates | null>(null)

  const handleComplete = (coordinates: Coordinates | null) => {
    setCoords(coordinates)
    setCurrentScreen('home')
  }

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onComplete={handleComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen coordinates={coords} />
      )}
    </>
  )
}

export default App
