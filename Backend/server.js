const express = require('express')
const dbSetup = require('./database/database-setup')
const bodyParser = require('body-parser')
const Users = require('./database/models/users')
const bcrypt = require('bcrypt')
const Tasks = require('./database/models/tasks')
const jwt = require('jsonwebtoken')
const auth = require('./middlewares/auth')
const cors = require('cors')

dbSetup()

const SECRET_KEY = 'USERSAPI'
const app = express()
app.use(bodyParser.json())
app.use(cors())
const SERVER_PORT = 3001

app.get('/', (req, res) => {
  res.send('Hello from the other side.')
})

//Getting all Users
app.get('/users', async (req, res) => {
  const result = await Users.query()
  res.send(result)
})

//Getting all the tasks
app.get('/tasks', auth , async (req, res) => {
  const userId = req.user.id;
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
}, )

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
  return res.send({ userData, token })
})

//Adding new Task to database
app.post('/newtask', auth, async (req, res) => {
  const { title, description } = req.body
  const userId = req.user.id
  try {
    const newTask= await Tasks.query().insert({
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
