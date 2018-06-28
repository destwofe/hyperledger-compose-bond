import React, { Component } from 'react';
import Main from './component/Main'
import Navbar from './component/Navbar'
import {NotificationContainer} from 'react-notifications'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <Main />
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default App;
