const parse = require('csv-parse/lib/sync')
const express = require('express')
const hbs = require('hbs')
const fs = require('fs')
const path = require('path')
const axios = require('axios')


function getCountry(countryName, data) {
  for (var i = 0; i < data.length; i++){
    if (data[i]['Country/Region'] == countryName){
      return data[i]
    }
  }
}

function parseCounrty(countryData) {
  let data = {
    country: countryData['Country/Region'],
    state: countryData['Province/State'],
    geo: {lat: countryData.Lat, lng: countryData.Long},
    labels: [],
    data: []
  }

  delete countryData['Province/State']
  delete countryData['Country/Region']
  delete countryData.Lat
  delete countryData.Long

  const statsRaw = Object.entries(countryData)

  let arrayData = []
  let arrayLabels = []
  for (const [date, value] of statsRaw) {
    if (new Date(date) > new Date('2020/02/14')) {
      arrayData.push({x: new Date(date), y: value})
      arrayLabels.push(date)
    }
  }

  data.data = arrayData
  data.labels = arrayLabels
  return data
}


// INIT
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// MAIN
//const csvContents = fs.readFileSync('data/time_series_19-covid-Confirmed.csv');
const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
axios.get(url).then((response) => {

  const csvData = parse(response.data, {
    columns: true,
    skip_empty_lines: true
  })
  
  
  const countries = ['Spain', 'France', 'Germany']
  const colors = ['rgba(0, 150, 136, 0.75)', 'rgba(255, 193, 7, 1)', 'rgba(255, 235, 59, 0.75)', 'rgba(0, 235, 59, 0.75)']
  
  //const countryData = []
  let dataset = []
  let i = 0
  let dataLabels
  countries.forEach((country) => {
    let tempCountry = parseCounrty(getCountry(country, csvData))
    let tempDataset = {
      label: country,
      data: tempCountry.data,
      backgroundColor: colors[i],
      borderColor: colors[i]
    }
    i++
    dataset.push(tempDataset)
    dataLabels = tempCountry.labels
  })
  
//console.log(countryData)
  let datasets

  // GET
  app.get('', (req, res) => {

    //color picker : https://simonwep.github.io/pickr/
    res.render('index', {
      name: 'moooss',
      dataLabels: dataLabels,
      dataset: dataset

    })
    
  })
})




// EXPRESS INIT
app.listen(port, () => {
  console.log('Server is up on port ' + port)
})

