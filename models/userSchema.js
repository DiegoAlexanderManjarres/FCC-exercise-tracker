const { Schema, model } = require('mongoose')
const shortid = require('shortid')


const userSchema = new Schema({
   _id: { type: String, default: shortid.generate },
   username: { type: String, require: true },
   exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
})


module.exports = model('User', userSchema)