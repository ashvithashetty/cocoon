pragma solidity ^0.4.11;

contract ERC20 {
    function transfer(address _to, uint256 _value) public returns (bool success);
}

contract Cocoon {
    address public owner;
    address public intermediary;
    mapping (address => bool) public whitelist;

    function Cocoon (address[] _whitelist, address _owner, address _intermediary) {
        intermediary = _intermediary;
        owner = _owner;

        // Add all whitelisted addresses to a map
        for (uint256 i = 0; i < _whitelist.length; i++) {
            whitelist[_whitelist[i]] = true;
        }
    }

    // Accept ETH transfers to the contract
    function () payable {}

    // This contract does keep track of or care about the balance of various ERC20 tokens.
    // It will try to transfer whatever amount of tokens you ask it to transfer and it
    // is up to the token's contract to throw an error if there isn't enough balance.
    function transfer(address _receiver, address _token_contract_address, uint _amount) public {
        // msg.sender has to be owner or intermediary
        // _receiver should be in the whitelist
        if (((msg.sender == owner) || (msg.sender == intermediary)) && (whitelist[_receiver] == true)) {
            ERC20 erc20_instance = ERC20(_token_contract_address);
            erc20_instance.transfer(_receiver, _amount);
        }
        else {
            revert();
        }
    }

    function transfer_ether(address _receiver, uint _amount) public {
        // msg.sender has to be owner or intermediary
        // _receiver should be in the whitelist
        if (((msg.sender == owner) || (msg.sender == intermediary)) && (whitelist[_receiver] == true)) {
            _receiver.transfer(_amount);
        }
        else {
            revert();
        }
    }
}