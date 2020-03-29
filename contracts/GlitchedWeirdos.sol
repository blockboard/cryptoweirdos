pragma solidity ^0.5.0;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract GlitchedWeirdos is TradeableERC721Token {
  constructor(address _proxyRegistryAddress) TradeableERC721Token("GlitchedWeirdos", "GW", _proxyRegistryAddress) public {  }

  function baseTokenURI() public view returns (string memory) {
    return "https://cryptoweirdos.herokuapp.com/api/tokens/";
  }
}
