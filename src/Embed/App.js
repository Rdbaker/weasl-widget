import React, { Component } from 'react';
import AuthModal from './components/AuthModal';
import './App.css';
import { AuthAPI } from 'api/auth.js';

class App extends Component {
  constructor(props) {
    super(props)
    window.addEventListener("message", this.receiveMessage, false);
  }

  receiveMessage = (event) => {
    console.log('got here 2')
    console.log(event)
    if(!!event && event.data && event.data.type) {
      switch(event.data.type) {
        case 'init':
          this.handleInitEvent(event.data.value);
          break;
        case 'GET_USER_VIA_JWT':
          this.handleGetUserEvent(event.data.value);
          break;
      }
    }
  }

  handleInitEvent = (clientId) => {
    global.clientId = clientId
  }

  handleGetUserEvent = async (token) => {
    try {
      console.log('got the token', token);
      const { data } = await AuthAPI.getMe(token);
      window.top.postMessage({type: 'USER_RECEIVED', value: data}, '*');
      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
          <AuthModal />
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
