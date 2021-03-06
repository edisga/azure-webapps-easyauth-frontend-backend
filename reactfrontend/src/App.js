import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = { token: '', backend: '', backend2: '' };
  }

  async componentDidMount() {
    try {
      const request = await fetch('/.auth/me');
      const response = await request.json();
      const jsonString = JSON.stringify(response)
      console.log('String: ' + jsonString);
      const jsonArray = JSON.parse(jsonString)
      console.log('Array: '+ jsonArray);
      var id_token =jsonArray[0].id_token;  // or jsonArray[0].access_token
      console.log('Token: '+ id_token);
      this.setState({ token: jsonArray[0].id_token });
      if (jsonArray !== undefined) {
        console.log('Array has content');
        const requestToBackEnd = await fetch('https://edisga-nodejs-backend.azurewebsites.net/echo/test',
        {
          method: "GET",
          //body: JSON.stringify(data),
          headers: {
            "Authorization": "Bearer " + id_token 
          },
          //credentials: "same-origin"
        });
        const responseFromBackEnd = await requestToBackEnd.json();
        const jsonStringBackEnd = JSON.stringify(responseFromBackEnd)
        this.setState({ backend: jsonStringBackEnd });
        console.log('String Backend: ' + jsonStringBackEnd);

        axios({
          method: 'get',
          url: 'https://edisga-nodejs-backend.azurewebsites.net/echo/test',
          headers: {'Authorization': "Bearer " + id_token, 'Accept' : 'application/json', 'Content-Type': 'application/json'},
          cancelToken: new axios.CancelToken((token) => {
          this.cancelToken = token;
          })
        })
        .then((res) => {
          this.cancelToken = null;
          this.setState({ backend2: JSON.stringify(res.data) });
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          Token from Azure AD: { this.state.token }
        </p>
        <p className="App-intro">
          Values from Backend: { this.state.backend }
        </p>
        <p className="App-intro">
          Values from Backend using axios: { this.state.backend2 }
        </p>
      </div>
    );
  }

}

export default App;
