import React, { Component } from 'react'
import Certification from '../../../src/contracts/Certification.json'
import getWeb3 from '../../getWeb3'
import ipfs from '../../ipfs'
import { Button } from 'reactstrap'
import '../styles/home.scss'
import '../styles/form.scss'
class Home extends Component {
  constructor(props) {
    super(props)

    this.captureFile = this.captureFile.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  state = {
    web3: null,
    accounts: null,
    contract: null,
    buffer: null,
    ipfsHash: '',
    imageStatus: 'loading',
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Certification.networks[networkId]
      const instance = new web3.eth.Contract(
        Certification.abi,
        deployedNetwork && deployedNetwork.address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  sendHash = async () => {
    const { accounts, contract } = this.state
    console.log(document.getElementById('cert-id').value)
    const id = await contract.methods.generateId(document.getElementById('cert-id').value).call()
    await contract.methods.generateCertificate(
        id,
        document.getElementById('name').value,
        document.getElementById('org-name').value,
        document.getElementById('course-name').value,
        this.state.ipfsHash,
      )
      .send({ from: accounts[0], gas: 3000000 })


    const response = await contract.methods.getHash(document.getElementById('cert-id').value).call()
    console.log(response)
    // Update state with the result.
    this.setState({ ipfsHash: response })
  }

  captureFile(e) {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(e) {
    e.preventDefault()
    console.log('onSubmit...')
    ipfs.files.add(this.state.buffer, (err, result) => {
      if (err) {
        console.error('error')
        return
      }
      this.setState({ ipfsHash: result[0].hash })
      console.log('ipfsHash', this.state.ipfsHash)
      this.sendHash()
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div>
        <section className="et-hero-tabs">
          <h1>Certification System</h1>
          <h3>Using Etherum Blockchain</h3>

          <div className="et-hero-tabs-container">
            <a className="et-hero-tab" href="#tab-university">
              University
            </a>
            <a className="et-hero-tab" href="#tab-student">
              Student
            </a>
            <a className="et-hero-tab" href="#tab-enterprise">
              Enterprise
            </a>
            <span className="et-hero-tab-slider"></span>
          </div>
        </section>

        <main className="et-main">

          <section className="et-slider" id="tab-university">
            <div className="row">
              <div>
                <h1>University</h1>
                <h3> Upload a Certificate</h3>
              </div>
              <div className="container">
                <h2>Upload Data</h2>
                <form onSubmit={this.onSubmit} className="form">
                  <fieldset className="form-fieldset ui-input __first">
                    <input type="email" id="cert-id" tabIndex="0" />
                    <label htmlFor="username">
                      <span data-text="E-mail Address">E-mail Address</span>
                    </label>
                  </fieldset>

                  <fieldset className="form-fieldset ui-input __second">
                    <input type="text" id="name" tabIndex="0" />
                    <label htmlFor="email">
                      <span data-text="Name">Name</span>
                    </label>
                  </fieldset>

                  <fieldset className="form-fieldset ui-input __third">
                    <input type="text"  id="org-name" />
                    <label htmlFor="new-password">
                      <span data-text="Organization">Organization</span>
                    </label>
                  </fieldset>

                  <fieldset className="form-fieldset ui-input __fourth">
                    <input type="text"  id="course-name" />
                    <label htmlFor="repeat-new-password">
                      <span data-text="Courses">Courses</span>
                    </label>
                  </fieldset>

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
                      <input type="submit" className="btn-u" value="Upload & Submit" />
                    </label>
                  <div className="form-footer">
                    <button className="btn">Upload</button>
                  </div>
                </form>
              </div>
            </div>
          </section>


          <section className="et-slide" id="tab-student">
            <h1>Student</h1>
          </section>
          <section className="et-slide" id="tab-enterprise">
            <h1>Enterprise</h1>
          </section>
        </main>
       
      </div>
     
    )
  }
}

export default Home
