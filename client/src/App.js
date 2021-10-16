import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SendHash from "./contracts/SendHash.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  state = {
    web3: null,
    accounts: null,
    contract: null,
    buffer: null,
    ipfsHash: "",
    imageStatus: "loading"
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SendHash.networks[networkId];
      const instance = new web3.eth.Contract(
        SendHash.abi,
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

  sendHash = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.sendHash(this.state.ipfsHash).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getHash().call();
    console.log(response)
    // Update state with the result.
    this.setState({ ipfsHash: response });
  };

  captureFile(e) {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("onSubmit...");
    ipfs.files.add(this.state.buffer, (err, result) => {
      if (err) {
        console.error("error");
        return;
      }
      this.setState({ ipfsHash: result[0].hash });
      console.log("ipfsHash", this.state.ipfsHash);
      this.sendHash()
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Your Image</h1>
        <p>This image is store on IPFS & Ethereum blockhain!</p>
        <img
          src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
          alt=""
        />
        <h2>Upload Image</h2>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
        {<div>The Hash is: {this.state.ipfsHash}</div>}
      </div>
    );
  }
}

export default App;


