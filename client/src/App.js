import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [accessCode, setAccessCode] = useState('')

  const sendPhoneNumber = () => {
    const url = 'localhost:8080/generate-code'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {phoneNumber}
      )
    }).then(res => {
      return res.json()
    }).then(json => {
      console.log(json)
    })
  }
  return (
    <div className="App">
      <div className="m-auto">
        <label>Phone number:</label>
        <input onChange={e => setPhoneNumber(e.target.value)}/>
      </div>
      <div>
        <label> Access code:</label>
        <input/>
      </div>
      <button type="button" class="btn btn-outline-secondary" onClick={sendPhoneNumber}>Send</button>
    </div>
  );
}

export default App;
