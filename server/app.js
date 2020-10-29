const express = require('express')
const randomstring = require("randomstring")
const app = express()
const port = 8080

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')('ACd5757c3e4c3fb3e8e5b54f456d164f9e', '43b6e95a81b82353503539c057f7431c');

var twilio = require('twilio');
var client = new twilio('ACd5757c3e4c3fb3e8e5b54f456d164f9e', '43b6e95a81b82353503539c057f7431c');

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/generate-code', (req, res) => {
  // assuming the phone number recieved is valid
  const phoneNumber = req.body.phoneNumber
  const accessCode = randomstring.generate({length: 6, charset: 'numeric'})

  client.messages.create({
     body: `Your verification code is: ${accessCode}`,
     from: '+14153845479',
     to: phoneNumber
  }).then(message => {
    console.log(message.sid)
    res.json({accessCode})
  });


  // if (phoneNumber) {
  // }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})