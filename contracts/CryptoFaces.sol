pragma solidity 0.5.12;

// allows for multi-address access controls to different functions
import "./AccessControl.sol";

// Prevents stuck ether
//import "openzeppelin-solidity/contracts/ownership/HasNoEther.sol";

// For safe maths operations
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// Pause purchasing only in case of emergency/migration
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

// ERC721
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

// Utils only
import "./Strings.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";

/**
 * @title CF-V1
 * @author IskanderAndrews
 * Creature - a contract for CF NFTs.
 */

contract CryptoFaces is ERC721Full, AccessControl, Pausable {
    using SafeMath for uint256;
    using Address for address;
    using Counters for uint256;

    /*
     * Properties
     */
    string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

    // To begin from index 100001
    uint256 private tokenId = 100001;

    // All tokens of owner
    uint256[] private ownerTokens;

    // Faces Exits
    mapping(string => bool) faceExits;

    /*
     * Events
     */

    /*
     * Modifiers
     */

    /*
     * Constructor
     */
    constructor() public payable ERC721Full("CryptoFaces", "CF") {

    }

    function tokensOf(address _owner) public view returns (uint256[] memory _tokenIds) {
        require(_owner != address(0));

        _tokenIds = super._tokensOfOwner(owner);

        return _tokenIds;
    }

    function mintFaceToken(string memory _tokenURI) public onlyIfCryptoFacesArtists {
        require(!faceExits[_tokenURI]);

        super._mint(msg.sender, tokenId);
        super._setTokenURI(tokenId, _tokenURI);

        tokenId = tokenId.add(1);
    }
}
