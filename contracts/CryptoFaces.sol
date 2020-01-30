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

/**
 * @title CF-V1
 * @author IskanderAndrews
 * Creature - a contract for CF NFTs.
 */

contract CryptoFaces is ERC721Full, AccessControl, Pausable {
    using SafeMath for uint256;

    /*
     * Properties
     */

    string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

    // To begin from index 1
    uint public nextFaceIndexToAssign = 100001;

    // Number of CFs minted
    uint256 public totalFacesMinted;

    // For single face offer
    struct Offer {
        bool isForSale;
        uint256 faceIndex;
        address seller;
        uint minValue;          // in ether
        address onlySellTo;     // specify to sell only to a specific person
    }

    // For a bundle of faces offer
    struct multiOffers {
        bool areForSale;
        uint256[] facesIndexes;
        address seller;
        uint minValue;
        address onlySellTo;
    }

    struct Bid {
        bool hasBid;
        uint faceIndex;
        address bidder;
        uint value;
    }

    /*
     * Events
     */
    event Minted(
        uint256 indexed _tokenId,
        address indexed _buyer
    );

    /*
     * Modifiers
     */


    /*
     * Constructor
     */
    constructor() public payable ERC721Full("CryptoFaces", "CF") {

    }

    /*function mint(address _to, uint256 _tokenId) public onlyIfCryptoFacesArtists {
        super._mint(_to, _tokenId);


    }*/

}
