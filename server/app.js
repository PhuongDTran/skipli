require('dotenv').config();
const express = require('express')
const firebase = require('firebase');
const randomstring = require("randomstring")
const app = express()
const port = 8080

// https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);

//config Firebase
var config = {
  apiKey: "AIzaSyB1t9FRDoBXk8FL1hL837UAoAz_VCBwh0Y",
  authDomain: "skipli-d6fe8.firebaseapp.com",
  databaseURL: "https://skipli-d6fe8.firebaseio.com/",
  storageBucket: "gs://skipli-d6fe8.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();

// read and write to Firebase
async function writeData(phoneNumber, accessCode) {
  return database.ref('phones/' + phoneNumber).set({
    accessCode
  }).then( () => {
    return true
  }).catch(() => {
    return false
  })
}
async function readData(phoneNumber) {
  return database.ref('phones/' + phoneNumber).once('value').then(function (snapshot) {
    return snapshot.val()
  })
}

app.use(express.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/generate-code', async (req, res) => {
  // assuming the phone number recieved is valid
  const phoneNumber = req.body.phoneNumber
  const accessCode = randomstring.generate({ length: 6, charset: 'numeric' })
  const ok = await writeData(phoneNumber, accessCode)
  // failed to write to Firebase
  if (!ok) {
    res.json({ success: false })
  }

  client.messages.create({
    body: `Your verification code is: ${accessCode}`,
    from: '+14153845479',
    to: phoneNumber
  }).then(() => {
    res.json({ accessCode})
  }).catch(() => {
    res.json({ accessCode: null })
  });
})

app.post('/validate', async (req, res) => {
  const { phoneNumber, accessCode } = req.body
  const dbResult = await readData(phoneNumber)
  if (dbResult && dbResult.accessCode === accessCode) {
    await writeData(phoneNumber, "")
    res.json({ success: true })
  } else {
    res.json({ success: false })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})