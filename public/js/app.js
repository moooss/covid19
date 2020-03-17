const getQueryString = () => {
  let queryStr = ''
  $('#country-selector').children().each(function(i) {
    if ($(this).find('input').prop('checked')) {
      queryStr += 'countries[]=' + $(this).find('input').attr('id') + '&'
    }
  })
  return queryStr
}

const initGraph = (chartId, chartLabel, chartType) => {

  axios.get('/data?type=' + chartType + '&' + getQueryString())
  .then((response)=> {

    myChartDatasets[chartId] = response.data.data

    myChartCfg[chartId] = {
      type: 'line',
      data: {
        labels: response.data.dataLabels,
        datasets: myChartDatasets[chartId]

      },
      options: {
        title: {
          display: true,
          text: chartLabel
        },
        legend: {
          position: 'top',
          align: 'center'
        }
      }
    }
    
    ctx = document.getElementById(chartId)
    Chart.defaults.global.defaultFontColor = '#ccc';
    myChart[chartId]    = new Chart(ctx, myChartCfg[chartId])

  })

  
}

const initBlocks = () => {
  const Promise1 = axios.get('/data?type=' + 'confirmed' + '&' + getQueryString())
  const Promise2 = axios.get('/data?type=' + 'deaths' + '&' + getQueryString())

  Promise.all([Promise1, Promise2])
    .then((response)=> {
      for (const data of response[0].data.data) {
        console.log(data.label)
        $('.block_' + data.label.replace(' ', '_').toLowerCase() + ' > .content > .stats > .confirmed > .number').text(data.lastValue)
      }
      for (const data of response[1].data.data) {
        $('.block_' + data.label.replace(' ', '_').toLowerCase() + ' > .content > .stats > .deaths > .number').text(data.lastValue)
      }
    })
}


// CHARTS
let myChart = []
let myChartCfg = []
let myChartDatasets = []

const chartId1 = 'myChart1'
const chartId2 = 'myChart2'

initGraph(chartId1, 'Infected Cases', 'confirmed')
initGraph(chartId2, 'Deaths', 'deaths')

initBlocks()




$( document ).ready(function() {

  // on country select
  $('#country-selector').click(function() {
    let countries = []
    console.log('clic')
    $('#country-selector').children().each(function(i) {
      console.log('each')
      if ($(this).find('input').prop('checked')) {
        countries.push($(this).find('input').attr('id'))
      }
    })

    // filter data and update
    myChartCfg[chartId1].data.datasets = myChartDatasets[chartId1].filter(dataset => countries.indexOf(dataset.label) != -1)
    myChart[chartId1].update()
    myChartCfg[chartId2].data.datasets = myChartDatasets[chartId2].filter(dataset => countries.indexOf(dataset.label) != -1)
    myChart[chartId2].update()
    
  })

  

})

