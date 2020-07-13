import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    //footer
    return (
      <footer className="container">
        <div className="item">
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/hyunsukim/">Hyunsu Kim</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/cole-chelton/">
                Cole Chelton
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/andrew-th-nguyen/">
                Andrew Nguyen
              </a>
            </li>
          </ul>
        </div>
        <div className="item">
          <ul>
            <li>
              <a href="https://sites.google.com/mintbean.io/2020-07-10-multiplayer-hackath/home?authuser=2">
                Mintbean
              </a>
            </li>
            <li>
              <a href="https://github.com/astrangethao/frankenman">
                Frankenman Github
              </a>
            </li>
            <li>Frankenstein themed competitive hangman.</li>
          </ul>
        </div>
      </footer>
    );
  }
}

export default Footer;
