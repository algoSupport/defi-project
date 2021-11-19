import React, { Component } from "react";
import Certification from "./contracts/Certification.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import { Button } from 'reactstrap';


import "./App.css";

class App extends Component {

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Certification.networks[networkId];
      const instance = new web3.eth.Contract(
        Certification.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Your Image</h1>
        <p>This image is store on IPFS & Ethereum blockhain!</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        <h2>Upload Image</h2>
        <div className="login-wrap">
          <div className="container login-html">
            <form onSubmit={this.onSubmit} className="form">
                <div className="login-form">
                  <div className="group">
                    <label htmlFor="user" className="label">
                      ID
                    </label>
                    <input id="cert-id" placeholder="ID" className="input" />
                    <label htmlFor="user" className="label">
                      Receipient Name
                    </label>
                    <input
                      id="name"
                      placeholder="Receipient Name"
                      className="input"
                    />
                    <label htmlFor="user" className="label">
                      Organization
                    </label>
                    <input
                      id="org-name"
                      placeholder="Organization"
                      className="input"
                    />
                    <label htmlFor="user" className="label">
                      Course name
                    </label>
                    <input
                      id="course-name"
                      placeholder="Course Name"
                      className="input"
                    />
                    <label htmlFor="user" className="label">
                      Upload
                    </label>

                    <label className="file">
                      <Button
                        style={{
                          border: "1px solid #494949",
                          borderRadius: "50px",
                          backgroundColor: "#F7F7F7",
                        }}
                      >
                        <input
                          type="file"
                          id="file"
                          aria-label="File browser example"
                          onChange={this.captureFile}
                        />
                      </Button>
                      <input type="submit" class="button" value="Upload & Submit" />
                    </label>
                  </div>
                </div>
            </form>
          </div>
          {<div style={{position: 'absolute', bottom: '25px', left: '20px', color: 'white'}} >Hash is: {this.state.ipfsHash}</div>}

        </div>
      </div>
    );
  }
}

export default App;


