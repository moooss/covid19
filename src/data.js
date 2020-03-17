const parse = require('csv-parse/lib/sync')
const axios = require('axios')

class Data {

  constructor() {
    this.urlFileConfimed = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'
    this.urlFileDeaths   = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv'
  }

  async getData(type, countries, colors) {

    if (countries === undefined || !countries.length) {
      return {}
    }

    let url = this.urlFileConfimed
    if (type == 'deaths') {
      url = this.urlFileDeaths
    }
    
    const response = await axios.get(url)
    
    const csvData = parse(response.data, {
      columns: true,
      skip_empty_lines: true
    })
    
    
    let dataset = []
    let i = 0
    let dataLabels
    countries.forEach((country) => {
      let tempCountry = this._formatCountryData(this._getCountry(country, csvData))
      let tempDataset = {
        label: country,
        fill: false,
        data: tempCountry.data,
        lastValue: tempCountry.lastValue,
        //backgroundColor: colors[i],
        borderColor: colors[i]
      }
      i++
      dataset.push(tempDataset)
      dataLabels = tempCountry.labels
    })
    return {dataLabels: dataLabels, data: dataset}

  }

  /*
  * _getCountry
  * get raw data for one country
  */
  _getCountry(countryName, data) {
    for (var i = 0; i < data.length; i++){
      if (data[i]['Country/Region'] !== undefined && data[i]['Country/Region'].replace(' ','-').toLowerCase() == countryName){
        return data[i]
      }
    }
  }

  /*
  * _formatCountryData
  * get formated data
  */
  _formatCountryData(countryData) {
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
    const lastStatRaw = statsRaw[statsRaw.length-1]

    let arrayData = []
    let arrayLabels = []
    for (const [date, value] of statsRaw) {
      if (new Date(date) > new Date('2020/02/25')) {
        arrayData.push({x: new Date(date), y: value})
        arrayLabels.push(date)
      }
    }

    data.lastValue = lastStatRaw[1]
    data.data = arrayData
    data.labels = arrayLabels
    return data
  }
}

module.exports = Data