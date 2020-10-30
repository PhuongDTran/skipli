import './App.css';
import { useState } from 'react';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showVerification, setShowVerification] = useState(false)

  const sendPhoneNumber = () => {
    // only fetch when user entered something
    if (!phoneNumber) return

    const url = 'http://localhost:8080/generate-code'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({phoneNumber})
    }).then(response => {
      return response.json()
    }).then(json => {
      if(json.accessCode) {
        setShowVerification(true)
      }else {
        throw {msg: "Unable to send a message. Make you you have a correct phone number"}
      }
    }).catch(err => {
      alert(err.msg)
    })
  }
  return (
    <div style={{textAlign: 'center'}}>
      <div className="justify-content-center">
        <label>Phone number:</label>
        <input onChange={e => setPhoneNumber(e.target.value)} />
      </div>
      <button type="button" className="btn btn-primary " onClick={sendPhoneNumber}>Send</button>
      {showVerification ? <Verification phoneNumber={phoneNumber} setShowVerification={setShowVerification} /> : null}
    </div>
  );
}
export default App;

function Verification({ phoneNumber, setShowVerification }) {

  const [accessCode, setAccessCode] = useState('')

  const verifyCode = () => {
    const url = 'http://localhost:8080/validate'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {accessCode, phoneNumber}
      )
    }).then(response => {
        return response.json()
      }).then(json => {
        if(json.success) {
          alert("Phone number vefified!")
          setShowVerification(false)
        }else {
          alert("Incorrect Code. Enter the code again or resend.")
        }
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className='d-flex flex-column' style={{textAlign: 'center'}}>
          <label> Enter the 6-digit code we sent to</label>
          <label style={{ color: 'blue' }}>{phoneNumber}</label>
          <input type="text" className="form-control mb-2 mt-2" placeholder=" 6-digit code" value={accessCode} onChange={e => setAccessCode(e.target.value)}></input>
        </div>
        <div className='d-flex justify-content-center'>
          <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowVerification(false)}> Cancel</button>
          <button type="button" className="btn btn-primary" onClick={verifyCode}> Verify</button>
        </div>
      </div>
    </div>

  )
}
