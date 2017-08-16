// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import cocoon_artifacts from '../../build/contracts/Cocoon.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var cocoon = contract(cocoon_artifacts);
window.temp = cocoon
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    cocoon.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
     });
  },
  createCocoon: function(){
    var own_addr_1=$('#own_addr1')[0].value
    if (!(web3.isAddress(own_addr_1))){
      bootbox.alert("Invalid owner address 1.");
      return;
    }
    var own_addr_2=$('#own_addr2')[0].value
    if (!(web3.isAddress(own_addr_2))){
      bootbox.alert("Invalid owner address 2.");
      return;
    }
    var rec_addr_1=$('#rec_addr1')[0].value
    if (!(web3.isAddress(rec_addr_1))){
      bootbox.alert("Invalid receiver address 1.");
      return;
    }
    var rec_addr_2=$('#rec_addr2')[0].value
    if (!(web3.isAddress(rec_addr_2))){
      bootbox.alert("Invalid receiver address 2.");
      return;
    }
    bootbox.alert("Cocoon is being created, please wait..")
    cocoon.new([rec_addr_1,rec_addr_2],own_addr_1,own_addr_2,{from: web3.eth.accounts[0]}).then(function(tx) {
  var html = $('<p>Contract has been deployed on ' +
    '<a target="_blank" href="https://ropsten.etherscan.io/address/' + tx.address + '">Etherscan</a>' +
    '. You can transfer funds to this address from now on.</p>');
  bootbox.alert({
    message: html
  });
  }).catch(function(e){bootbox.alert('An error occurred please try again')});

  },
  transfer: function(){
    var amt=$('#amt')[0].value
    var coc_addr=$('#coc_addr')[0].value
    if (!(web3.isAddress(coc_addr))){
      bootbox.alert("Invalid cocoon address.");
      return;
    }
    var rec_addr=$('#rec_addr')[0].value
    if (!(web3.isAddress(rec_addr))){
      bootbox.alert("Invalid receiver address.");
      return;
    }
    bootbox.alert("Ethers are being transferred, please wait..")
    cocoon.at(coc_addr)
  .then(function(instance) {
    return instance.transfer_ether(rec_addr, web3.toWei(amt, 'ether'), {from: web3.eth.accounts[0]});
  })
  .then(function(tx) {
    bootbox.hideAll()
    var html = $('<p>You can view the transaction on etherscan: ' +
    '<a target="_blank" href="https://ropsten.etherscan.io/tx/' + tx.tx + '">Etherscan</a>.</p>');
  bootbox.alert({
    message: html
  });
  })
  .catch(function (e) {
    bootbox.hideAll()
    bootbox.alert('There was an error in tranferring the amount, please check the fields again.')
  });
  }
  
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    App.start();
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    alert("Install MetaMask on Chrome to continue using this website.")
  }

});
