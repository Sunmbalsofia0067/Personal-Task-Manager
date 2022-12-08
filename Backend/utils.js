const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail (data) {
  try {
    console.log("I'm inside sendEmail")
    const {body, subject, to} = data
    console.log(body, subject, to)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })

    send()

    async function send () {
      const result = await transporter.sendMail({
        from: 'sunmbal@techdots.dev',
        to,
        subject,
        html: body
      })

      console.log(JSON.stringify(result, null, 4))
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = sendEmail
