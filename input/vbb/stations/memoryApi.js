const MEMORY_KEY = 'station_list' 

export const getSavedStations = () => {
  const fromMemory = getStations()
  if(fromMemory) { return fromMemory }
  return loadDefaultInMemory()
}

export const addStation = (station) => { putStation(station) }

export const cleanStations = () => {
  loadDefaultInMemory()
}

const getStations = () => {
  let stations = window.localStorage.getItem(MEMORY_KEY)
  if (stations === null) { 
    stations = loadDefaultInMemory() 
  }
  else {
    stations = JSON.parse(stations)
  }

  return stations
}

const loadDefaultInMemory = () => {
  const defaultStations = ["S+U Alexanderplatz", "U Moritzplatz", "U Weinmeisterstraße"]
  window.localStorage.setItem(MEMORY_KEY, JSON.stringify(defaultStations))
  return defaultStations
}

const putStation = (station) => {
  const previousStations = getStations()
  window.localStorage.setItem(MEMORY_KEY, JSON.stringify([...previousStations, station]))
} 