const getQueryString = () => {
  let queryStr = ''
  $('#country-selector').children().each(function(i) {
    queryStr += 'countries[]=' + $(this).find('input').attr('id') + '&'
  })
  return queryStr
}

const getSelectedCountries = () => {
  let countries = []
  $('#country-selector').children().each(function(i) {
    if ($(this).find('input').prop('checked')) {
      countries.push($(this).find('input').attr('id'))
    }
  })
  return countries
}

const saveCountries = (countries) => {
  if (typeof(Storage) !== "undefined") {
    window.localStorage.setItem('countries', JSON.stringify(countries))
  } else {
    // No web storage Support.
  }
}

const initCountries = () => {
  let countriesDefault = ['france', 'italy', 'spain']
  let countries
  if (typeof(Storage) !== "undefined") {
    countries = JSON.parse(window.localStorage.getItem('countries'));
  }
  console.log(countries)
  countries = countries ? countries : countriesDefault
  console.log(countries)
  countries.forEach((country) => {
    $('#'+country).prop('checked', true)
  })
}

const init = (charts) => {
  const Promise1 = axios.get('/data?type=' + 'confirmed' + '&' + getQueryString())
  const Promise2 = axios.get('/data?type=' + 'deaths' + '&' + getQueryString())

  
  Promise.all([Promise1, Promise2])
    .then((responses)=> {

      // init blocks
      for (const data of responses[0].data.data) {
        $('.block_' + data.label.replace(' ', '_').toLowerCase() + ' > .content > .stats > .confirmed > .number').text(data.lastValue)
      }
      for (const data of responses[1].data.data) {
        $('.block_' + data.label.replace(' ', '_').toLowerCase() + ' > .content > .stats > .deaths > .number').text(data.lastValue)
      }


      // init charts
      for (const [i, response] of responses.entries()) {
        const chart = charts[i]
        myChartDatasets[chart.id] = response.data.data

        myChartCfg[chart.id] = {
          type: 'line',
          data: {
            labels: response.data.dataLabels,
            datasets: myChartDatasets[chart.id].filter(dataset => getSelectedCountries().indexOf(dataset.label) != -1)

          },
          options: {
            title: {
              display: true,
              text: chart.label
            },
            legend: {
              position: 'top',
              align: 'center'
            }
          }
        }
        ctx = document.getElementById(chart.id)
        Chart.defaults.global.defaultFontColor = '#ccc';
        myChart[chart.id]    = new Chart(ctx, myChartCfg[chart.id])
      }
    })
}


// CHARTS
let myChart = []
let myChartCfg = []
let myChartDatasets = []

const charts = [
  {id: 'myChart1', label: 'Infected Cases', type: 'confirmed'},
  {id: 'myChart2', label: 'Deaths',         type: 'deaths'},
]

initCountries()
init(charts)




$( document ).ready(function() {

  // on country select
  $('.checkbox').click(function() {
    let countries = getSelectedCountries()
    saveCountries(countries)
    console.log('clic')


    // filter data and update
    myChartCfg['myChart1'].data.datasets = myChartDatasets['myChart1'].filter(dataset => countries.indexOf(dataset.label) != -1)
    myChart['myChart1'].update()
    myChartCfg['myChart2'].data.datasets = myChartDatasets['myChart2'].filter(dataset => countries.indexOf(dataset.label) != -1)
    myChart['myChart2'].update()
    
  })

  

})

