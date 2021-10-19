import React, { Component } from "react";
import Certification from "./contracts/Certification.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import { Button } from 'reactstrap';


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

  sendHash = async () => {
    const { accounts, contract } = this.state;
    console.log(document.getElementById('cert-id').value);
    // Stores a given value, 5 by default.
    await contract.methods.generateCertificate(document.getElementById('cert-id').value,document.getElementById('name').value,document.getElementById('org-name').value,document.getElementById('course-name').value,(this.state.ipfsHash)).send({ from: accounts[0], gas:3000000 });

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
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        <h2>Upload Image</h2>
        <div className="container">
          <form onSubmit={this.onSubmit} className="form">
            <div className="input-field">
            <input id="cert-id" placeholder="ID" />
            <input id="name" placeholder="Receipient Name" />
            <input id="org-name" placeholder="Organization"/>
            <input id="course-name" placeholder="Course Name"/>
            <label className="file">
              <Button style={{border: '1px solid #494949', borderRadius: '5px 0px 0px 5px', backgroundColor: '#F7F7F7'}}><input type="file" id="file" aria-label="File browser example" onChange={this.captureFile} /></Button>
              <Button color="primary" style={{borderRadius: '0px 5px 5px 0px'}} ><input type="submit" />Upload</Button>
            </label>
            </div>
          </form>
          {<div>The Hash is: {this.state.ipfsHash}</div>}
        </div>
      </div>
    );
  }
}

export default App;


