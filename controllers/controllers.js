const User = require('../models/userSchema')
const Exercise = require('../models/exerciseSchema')


exports.createUser = async (req, res, next) => {
   try{
      const username = req.body['new-user']

      const existingUser = await User.findOne({ username })
      if (existingUser) { return res.status(422).json('username alredy taken ') }

      const user = new User({ username })
      await user.save()

      return res.status(201).json({ username: user.username , _id: user._id })

   } catch(err) { throw err}
}


exports.addExercise = async (req, res, next) => {
   try {
      const { userId, description, duration, date } = req.body
      console.log(new Date(date))

      const user = await User.findById(userId)
      if (!user) { return res.status(422).json('unknown _id') }

      const formatedDate = !date || new Date(date).toString() === 'Invalid Date'
         ? new Date().toDateString() : new Date(date).toDateString()

      const exercise = new Exercise(
         { userId, description, duration, date: formatedDate }
         )
      await exercise.save()
      
      user.exercises.push(exercise)
      await user.save()

      return res.status(201).json({
            _id: exercise.userId,
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: new Date(exercise.date).toDateString()
         })
   } catch(err) { throw err }
}


exports.getLog = async (req, res, next) => {
   try{
      const userId = req.query.userId
      const user = await User.findById(userId)
      if (!user) { return res.status(401).json('unknown userId')}

      const log = {}
      if (new Date(req.query.from).toString() !== 'Invalid Date') {
         log.from = new Date(req.query.from).toDateString()
      }
      if (new Date(req.query.to).toString() !== 'Invalid Date') {
         log.to = new Date(req.query.to).toDateString()
      }

     const aDay = (((60 * 60) * 24) * 1) * 1000
      const tenDays = (((60 * 60) * 24) * 10) * 1000
      const fromDate = log.from || new Date().valueOf() - tenDays
      const toADate = log.to || new Date().valueOf() + aDay
      const limit = parseInt(req.query.limit) || 0          

      const query = { 
         userId, 
         "date": { 
            $gte: new Date(fromDate).toDateString(),
            $lte: new Date(toADate).toDateString()
         }
      }

      const exercises = await Exercise.find(query).limit(limit).sort({ date: -1 })
      if (!exercises) { return res.status(500).json('Fetching exercises failed') }

      const logExercises = exercises.map(({ description, duration, date }) => (
            { description, duration, date: new Date(date).toDateString() }
         ))

      return res.status(200).json({ 
         _id: user._id, 
         username: user.username,
         count: logExercises.length,
         ...log,
         log: logExercises,         
      })

   } catch(err) { throw err }
}