const { Schema, model } = require('mongoose')


const exerciseSchema = new Schema({
  // _id: { type: Schema.Types.ObjectId, required: true },
   description: { type: String, required: true },
   duration: { type: Number, required: true },
   date: { type: Date, required: true },
   userId: { type: String, ref: 'User', required: true } 
})

module.exports = model('Exercise', exerciseSchema)