
/*
const weatherForm = document.querySelector('form')
const search = document.querySelector('input') 
const fcLine1 = document.querySelector('.forecast-l1') 
const fcLine2 = document.querySelector('.forecast-l2') 

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const location = search.value

  
  url = '/weather?address=' + location

  fcLine1.innerHTML = "Loading..."
  fcLine2.innerHTML = ""

  fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      fcLine1.innerHTML = data.error

    } else {
      fcLine1.innerHTML = "Meteo à : " + data.location
      fcLine2.innerHTML = 
        data.forecast.summary +
        "<br/>Il fait actuellement " + data.forecast.temperature + "°C dehors." +
        "<br/>Le taux d'humidité est de " + data.forecast.humidity + "%." +
        "<br/>La probabilité de pluie est de " + data.forecast.precip + "%."

    }
  })
})
*/

