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
    // get different regions
    let regionsData = []
    for (let i = 0; i < data.length; i++){
      if (data[i]['Country/Region'] !== undefined && data[i]['Country/Region'].replace(' ','-').toLowerCase() == countryName){
        const regionData = Object.entries(data[i])
        const regionDataFiltered = []

        // filter fields other than dates
        for (let j = 0; j < regionData.length; j++) {
          const date  = regionData[j][0]
          const value = regionData[j][1]
          if (date.match(/([0-9]+\/[0-9]+\/[0-9]+)/i)) {
            regionDataFiltered.push({date, value})
          }
        }
        regionsData.push(regionDataFiltered)
      }
    }

    // init countryData
    let countryData = []
    for (let j=0; j < regionsData[0].length; j++) {
      const date  = regionsData[0][j].date
      const value =  regionsData[0][j].value
      countryData.push({date, value: 0})
    }
    
    // sum values for all regions and all dates
    for (let i=0; i < regionsData.length; i++) {
      for (let j=0; j < regionsData[i].length; j++) {
        countryData[j].value =  parseInt(regionsData[i][j].value) + countryData[j].value
      }
    }
    return {name: countryName, data: countryData}
  }

  /*
  * _formatCountryData
  * get formated data fort charting
  */
  _formatCountryData(countryData) {
    let data = {
      country: countryData.Name,
      labels: [],
      data: []
    }

    let arrayData = []
    let arrayLabels = []
    for (let i=0; i < countryData.data.length; i++) {
      const date  = countryData.data[i].date
      const value = countryData.data[i].value
      if (new Date(date) > new Date('2020/02/25')) {
        arrayData.push({x: new Date(date), y: value})
        arrayLabels.push(date)
      }
    }

    data.lastValue = countryData.data[countryData.data.length-1].value
    data.data = arrayData
    data.labels = arrayLabels
    return data
  }
}

module.exports = Data