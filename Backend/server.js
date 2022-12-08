const express = require('express')
const dbSetup = require('./database/database-setup')
const bodyParser = require('body-parser')
const Users = require('./database/models/users')
const bcrypt = require('bcrypt')
const Tasks = require('./database/models/tasks')
const jwt = require('jsonwebtoken')
const auth = require('./middlewares/auth')
const cors = require('cors')
const sendEmail = require('./utils')
require('dotenv').config()

dbSetup()

const SECRET_KEY = 'USERSAPI'
const app = express()
app.use(bodyParser.json())
app.use(cors())
const SERVER_PORT = 3001

app.get('/', (req, res) => {
  console.log(process.env.SENDGRID_API_KEY)
  res.send('Hello from the other side.')
})

//Getting all Users
app.get('/users', async (req, res) => {
  const result = await Users.query()
  res.send(result)
})

//Getting all the tasks
app.get('/tasks', auth, async (req, res) => {
  const userId = req.user.id
  const filteredTask = await Tasks.query().where('userId', userId)
  return res.send(filteredTask)
})

//Inserting user to database
app.post('/signup', async (req, res, next) => {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password } = req.body
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const userArr = await Users.query().where('email', email)
    if (userArr.length) return res.status(400).send('User already exists!')

    const createdUser = await Users.query().insert({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword
    })
    res.send('User created Successfully!')
  } catch (err) {
    console.log(err)
    res.status(500).send('Unable to add user')
  }
})

//Login of user after validating from the database
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await Users.query().where('email', email)
  const userData = user[0]

  if (!userData) {
    return res.status(400).send('User not found')
  }

  const passwordMatched = await bcrypt.compare(password, userData.password)
  if (!passwordMatched) {
    return res.status(400).send('Incorrect Password')
  }
  const token = jwt.sign(userData.email, SECRET_KEY)
  delete userData.password
  return res.send({ userData, token})
})

//password reset API
app.patch('/resetPass', async (req, res) => {
  const { password, reset_token } = req.body
  const userId = jwt.verify(reset_token, SECRET_KEY)
  try {
    const user = await Users.query().where('id', userId).first()
    if (user) {
      //Update password in Db after encrypting
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const numUpdated = await Users.query().findById(userId).patch({
        password: hashedPassword
      })
      res.status(204).send("Password Updated Successfully!")
    } else {
      // user not found
      return res.status(400).send('Bad request!')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('Something went wrong')
  }
})

//Adding new Task to database
app.post('/newtask', auth, async (req, res) => {
  const { title, description } = req.body
  const userId = req.user.id
  try {
    const newTask = await Tasks.query().insert({
      title: title,
      description: description,
      userId: userId
    })
    res.send(newTask)
  } catch (err) {
    console.log(err)
    res.status(500).send('Unable to add Task')
  }
})
//Updating task based on ID
app.patch('/tasks/:taskId', auth, async (req, res) => {
  try {
    const { taskId } = req.params
    const userId = req.user.id
    const updatedData = req.body
    const updatedTask = await Tasks.query()
      .patch(updatedData)
      .where({ id: taskId, userId: userId })
      .first()
      .returning('*')

    if (!updatedTask) {
      return res.status(400).send('Task could not be found.')
    }
    return res.send(updatedTask)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong!')
  }
})
// Getting user matched to the email
app.post('/users/sendpasslink', async (req, res) => {
  try {
    const { email } = req.body
    const user = await Users.query().where('email', email).first()

    if (user) {
      // console.log(user.id)
      const userId = user.id
      const token = jwt.sign(userId, SECRET_KEY)
      console.log(token)
      const passwordResetLink = `http://localhost:3000/resetpass?reset_token=${token}`

      const mailBody = `
      Hi ${user.first_name + ' ' + user.last_name},
      Click <a href=${passwordResetLink}>Here</a> to reset password here
      `
      // TODO: send email here
      sendEmail({
        body: mailBody,
        subject: 'Password Reset Link',
        to: email
      })
      res.send('Sending password reset link through email.')
    } else res.status(400).send('User not Found!')
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong!')
  }
})

//Deleting task
app.delete('/tasks/:taskId', auth, async (req, res) => {
  const { taskId } = req.params
  const userId = req.user.id

  const taskToDelete = await Tasks.query().where({ id: taskId, userId: userId })

  if (!taskToDelete) {
    return res.status(400).send('Task not found to delete')
  }

  const numDeleted = await Tasks.query().deleteById(taskId)

  return res.send('Task Deleted successfully!')
})

app.listen(SERVER_PORT, err => {
  if (!err) {
    console.log('sever is running at port ', SERVER_PORT)
  }
})
