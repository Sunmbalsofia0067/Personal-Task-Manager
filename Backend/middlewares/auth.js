const jwt = require('jsonwebtoken')
const SECRET_KEY = 'USERSAPI'
const Users = require('../database/models/users')
module.exports = async (req, res, next) => {
  try {
    let token = req.headers.authorization
    if (token) {
      token = token.split(' ')[1]
      let email = jwt.verify(token, SECRET_KEY)
      const user = await Users.query()
        .where('email', email)
        .first()

      if (!user) {
        return res.status(401).send('Unauthorized User!')
      }

      //getting user id in assigning to req ID
      req.user = user
    } else {
      return res.status(401).send('Unauthorized User!')
    }

    next()
  } catch (err) {
    console.log(err)
    res.status(401).send('Unauthorized User!')
  }
}
