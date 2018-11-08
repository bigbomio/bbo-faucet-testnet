// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bboFaucetArtifact from '../../build/contracts/BBOFaucet.json'

import bboArtifact from '../../build/contracts/ERC20.json'
// BBOFaucet is our usable abstraction, which we'll use through the code below.
const bboAddress = '0x1d893910d30edc1281d97aecfe10aefeabe0c41b';
const faucetAddress = '0xb5fb85d8a777498974a444c5ca681d6b141231e9';
const BBOFaucet = contract(bboFaucetArtifact)

const BBO = contract(bboArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
var account

const App = {
  start: function () {
    const self = this

    // Bootstrap the BBOFaucet abstraction for Use.
    BBOFaucet.setProvider(web3.currentProvider)
    BBO.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts. Please unlock & select Ropsten testnet from Metamask')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      
      self.refreshBalance()
    })

    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        self.refreshBalance();
      }
    }, 100);
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this
    document.getElementById('address').innerHTML = account;
    let bbo
    BBO.at(bboAddress).then(function (instance) {
      bbo = instance
      return bbo.balanceOf.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = web3.fromWei(value.valueOf(), 'ether');
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },

  faucet: function () {
    const self = this
    this.setStatus('Initiating transaction... (please wait)')

    let meta
    BBOFaucet.at(faucetAddress).then(function (instance) {
      meta = instance
      return meta.faucet({ from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }
}

window.App = App

window.addEventListener('load',async () => {
  if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
           
        } catch (error) {
          alert('User denied account access...');
          window.location.reload();
            // User denied account access...
        }
    } else if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 BBOFaucet,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})