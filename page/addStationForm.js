import { getApp } from './utils'
import { addStation as saveStation } from './stationList'

export const drawForm = () => {
  const app = getApp()
  const formElement = document.createElement('span')
  formElement.innerHTML = form
  app.insertAdjacentElement('afterbegin', formElement)
  bindButtonToAction()
}

const form = `
  <div id="add_station_form">
    <span id="pick_station_text">Add a new station</span>
    <input type="text" name="station" id="station_input" />
    <button id="add_station_form_button">Add</button>
  </div>
`

const bindButtonToAction = () => {
  document.getElementById("add_station_form_button").addEventListener('click', addStation)
}

const addStation = () => {
  const station = document.getElementById("station_input").value
  console.log(`added station: ${station} to memory`)
  saveStation(station)
  location.reload()
}