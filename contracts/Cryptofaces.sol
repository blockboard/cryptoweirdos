pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract Cryptofaces is ERC721Full {


    string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

    constructor() ERC721Full("Cryptofaces", "Ṏ") public {

    }
}
