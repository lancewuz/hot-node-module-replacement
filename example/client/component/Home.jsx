import React, { Component } from 'react';
import Hello from './Hello';
import './home.scss';

class Home extends Component {
  componentDidMount() {
    console.log(window && window.__DATA__);
  }
  render() {
    return (
      <div className="home">
        <p className="home-desc">this is home page</p>
        <Hello/>
      </div>
    );
  }
}

export default Home;