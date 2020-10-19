import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { getElementError } from '@testing-library/react';
import { Button, Form, Input, Label, Media, Alert } from 'reactstrap';

const myToken='btc6kgf48v6ro77tvnpg'; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStock: '',
      stockPrice: 0,
      prevClosingPrice: 0,
      stockName: '',
      stockTicker: '',
      photoSrc: '',
      lostInternetConnection: false
    };
  }

  componentDidMount() {
    setInterval(() => {this.heartBeat()}, 5000);
  }

  handleSubmit = (event) => {
    this.getStock();
    this.getImage();
    event.preventDefault();
  }

  // get price difference

  getStock = () => {
    console.log('hit');
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${this.state.currentStock}&token=${myToken}`)
    .then((response) => {
      console.log(response.data);
      this.setState({
        stockPrice: response.data.c,
        prevClosingPrice: response.data.pc
      });
    }, (error) => {
      console.log(error)
    });
  }

  getImage() {
    // alert to enter stock price
    // if (this.state.currentStock === '') {
      
    // }
    axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${this.state.currentStock}&token=${myToken}`)
    .then((response) => {
      this.setState({
        photoSrc: response.data.logo === '' ? logo : response.data.logo,
        stockName: response.data.name,
        stockTicker: response.data.ticker
      });
    }, (error) => {
      console.log(error)
    });
  }

  heartBeat() {
    // ping google to check for internet connection
    axios.get(`https://finnhub.io/api/v1/news?category=general&token=${myToken}`).then((response) => {
      console.log('heartbeat', response);
      this.setState({
        lostInternetConnection: false
      });
    }).catch((error) => {
      console.log(error);
      this.setState({
        lostInternetConnection: true
      });
    });
  }

  handleChange = (e) => {
    this.setState({currentStock: e.target.value});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Alert color='danger' isOpen={this.state.lostInternetConnection}>Internet connection lost!</Alert>
          <div>
            <span>
              { this.state.stockName === '' || this.state.stockName === undefined ?
              <p>Please enter stock symbol</p>
              : 
                <p>{this.state.stockName} ({this.state.stockTicker}) : {this.state.stockPrice} {Number(this.state.stockPrice - this.state.prevClosingPrice).toFixed(2)}</p>
              }
            </span>
          </div>
          <Media src={this.state.photoSrc === '' || this.state.photoSrc === undefined ? logo : this.state.photoSrc} className="App-logo" alt="logo" />
          <p>
            Submit ticker symbol to get current price of stock.
          </p>
          <Form className='form-inline' onSubmit={this.handleSubmit}>
            <Label>Stock Symbol:</Label>
            <Input value={this.state.currentStock} onChange={this.handleChange} type='text'/>
            <Button type="submit" >Submit</Button>
          </Form>
        </header>
      </div>
    );
  }
}

export default App;
