pragma solidity ^0.5.0;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract GlitchedWeirdos is TradeableERC721Token {
  string tokensURI;

  constructor(address _proxyRegistryAddress) TradeableERC721Token("GlitchedWeirdos", "GW", _proxyRegistryAddress) public {
    tokensURI = "https://cryptoweirdos.herokuapp.com/api/tokens/";
  }

  function showCurrentTokenBaseURI() public view returns (string memory) {
    return tokensURI;
  }

  function changeTokensBaseURI(string memory _tokensURI) public onlyOwner{
    tokensURI = _tokensURI;
  }

  function baseTokenURI() public view returns (string memory) {
    return tokensURI;
  }
}
