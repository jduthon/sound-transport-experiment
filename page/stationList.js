const MEMORY_KEY = 'station_list' 

export const getSavedStations = () => {
  const fromMemory = getStations()
  if(fromMemory.length > 0 ) { return fromMemory }
  return loadDefaultInMemory()
}

const getStations = () => (
  JSON.parse(window.localStorage.getItem(MEMORY_KEY) || '[]')
)

const loadDefaultInMemory = () => {
  putStations(["S+U Alexanderplatz", "U Moritzplatz", "U Weinmeisterstraße"])
  return getStations()
}

const putStations = (stations) => {
  const previousStations = getStations()
  window.localStorage.setItem(MEMORY_KEY, JSON.stringify([...previousStations, ...stations]))
} 

export const addStation = (station) => { putStations([station]) }