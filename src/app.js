const express = require('express')
const hbs = require('hbs')
const fs = require('fs')
const path = require('path')
const Data = require('./data')


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
hbs.registerHelper('color', function (index) {
  return colors[index];
});



// EXPRESS INIT
app.listen(port, () => {
  console.log('Server is up on port ' + port)
})

const countries = ['Italy','France','Spain','Germany', 'Switzerland', 'Denmark', 'United Kingdom', 'China', 'US']
const colors = ['rgb(52, 74, 94)', 'rgb(45, 204, 112)', 'rgb(42, 128, 185)', 'rgb(155, 88, 181)', 'rgb(241, 196, 16)', 'rgb(231, 126, 34)', 'rgb(232, 76, 61)', 'rgb(35, 188, 154)']

// RENDER INTERFACE
app.get('', (req, res) => {
  res.render('index', {
    name: 'moooss',
    countries: countries.map((country) => { return country.replace(' ', '-').toLowerCase()})
  })
})


 // GET DATA
app.get('/data', (req, res) => {
  const countries = req.query.countries
  const type      = req.query.type

	try {
    console.log('get data :', type)

    const data = new Data()
    data.getData(type, countries, colors).then((result) => {

      res.status(201).send(result)
    })
  

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})



 // GET LAST DATA
 app.get('/last-data', (req, res) => {
  const countries = req.query.countries
  const type      = req.query.type

	try {
    console.log('get data')

    const data = new Data()
    data.getData(type, countries, colors).then((result) => {

      res.status(201).send(result)
    })
  

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

