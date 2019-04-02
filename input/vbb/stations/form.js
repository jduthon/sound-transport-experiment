import { addStation as addStationApi, cleanStations as cleanStationsApi } from './memoryApi'
import { drawInputs } from '../../drawInputs'

export const drawForm = (app) => {
  const formElement = document.createElement('span')
  formElement.innerHTML = form
  app.insertAdjacentElement('afterbegin', formElement)
  bindButtonToAction(app)
}

const form = `
  <div id="add_station_form">
    <span id="pick_station_text">Add a new station</span>
    <input type="text" name="station" id="station_input" />
    <button id="add_station_form_button">Add</button>
    <button id="remove_station_form_button">Clean Stations</button>
  </div>
`

const bindButtonToAction = (app) => {
  document.getElementById("add_station_form_button").addEventListener('click', addStation(app))
  document.getElementById("remove_station_form_button").addEventListener('click', cleanStations(app))

}

const cleanStations = (app) => () => {
  cleanStationsApi()
  redraw(app)
}

const addStation = (app) => () => {
  const station = document.getElementById("station_input").value
  console.log(`added station: ${station} to memory`)
  addStationApi(station)
  redraw(app)
}

const redraw = (app) => {
  drawInputs(app);
}