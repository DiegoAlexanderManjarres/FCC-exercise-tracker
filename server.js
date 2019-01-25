const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes/routes')


const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URI = `mongodb://${DB_USER}:${DB_PASS}@ds161104.mlab.com:61104/learning` 

const port = process.env.PORT || 3000
const app = express()

//mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors({ optionsSuccessStatus: 200 }))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/exercise', routes)

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})


mongoose.connect(DB_URI, { useNewUrlParser: true })
   .then(result => app.listen(port))
   .then(listener => console.log(listener.address().port))
   .catch(err => console.log(err))