let mongoose = require('mongoose');
const { dbAddress } = require('./config')
const subjects = require('../models/subjects')

let subjectss = [
  { name: 'USDCHF' },
  { name: 'EURUSD' },
  { name: 'USDJPY' },
  { name: 'USDCAD' },
  { name: 'AUDUSD' },
  { name: 'EURGBP' },
  { name: 'EURAUD' },
  { name: 'EURCHF' },
  { name: 'EURJPY' },
  { name: 'GBPCHF' },
  { name: 'CADJPY' },
  { name: 'GBPJPY' },
  { name: 'AUDNZD' },
  { name: 'AUDCAD' },
  { name: 'AUDCHF' },
  { name: 'AUDJPY' },
  { name: 'CHFJPY' },
  { name: 'EURNZD' },
  { name: 'EURCAD' },
  { name: 'CADCHF' },
  { name: 'NZDJPY' },
  { name: 'NZDUSD' },
  { name: 'GBPNZD' },
  { name: 'GBPCAD' },
  { name: 'GBPAUD' },
  { name: 'XAGUSD' },
  { name: 'XAUUSD' },
  { name: 'GBPUSD' },

]

class Database {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connect(dbAddress, { useNewUrlParser: true })
      .then(() => {
        console.log('Database connection successful')
        subjects.create(...subjectss, function (err, jellybean, snickers) {
          if (err) {
            console.log("it's not needed to add new subject")
          }
        })
      })
      .catch(err => {
        console.error('Database connection error 2')
        console.log(err)
      })
  }
}

module.exports = new Database()