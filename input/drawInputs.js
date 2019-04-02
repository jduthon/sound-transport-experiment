import { drawStations } from './vbb/drawStations'
import { drawForm } from './vbb/stations/form'

export const drawInputs = (app) => {
  app.innerHTML = ''
  drawStations(app)
  drawForm(app)
}