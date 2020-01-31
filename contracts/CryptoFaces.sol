pragma solidity 0.5.12;

// allows for multi-address access controls to different functions
import "./AccessControl.sol";

// Prevents stuck ether
//import "openzeppelin-solidity/contracts/ownership/HasNoEther.sol";

// For safe maths operations
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// Pause purchasing only in case of emergency/migration
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

// ERC721, ERC721 Enumerable, ERC721 Metadata
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

// ERC721 MetadataMintable
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";

// Utils only
import "./Strings.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";

/**
 * @title CF-V1
 * @author IskanderAndrews
 * Creature - a contract for CF NFTs.
 */

contract CryptoFaces is
ERC721Full,
ERC721MetadataMintable,
AccessControl,
Pausable {
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
    string[] facesURI;

    // Faces Exits
    mapping(string => bool) faceExists;

    /*
     * Events
     */

    // Emitted on every mint
    event Minted(
        uint256 indexed _tokenId,
        string indexed _tokenURI,
        address indexed _buyer
    );

    /*
     * Modifiers
     */

    /*
     * Constructor
     */
    constructor() public payable ERC721Full("CryptoFaces", "CF") {}

    /**
     * @dev Internal function to mint a new token.
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _tokenURI The Face Hash the will be minted with the token
     */
    function mint(address _to ,string memory _tokenURI) public onlyIfCryptoFacesArtists {
        require(!faceExists[_tokenURI]);

        mintWithTokenURI(_to, tokenId, _tokenURI);

        faceExists[_tokenURI] = true;
        facesURI.push(_tokenURI);

        emit Minted(tokenId, _tokenURI, _to);

        tokenId = tokenId.add(1);
    }

    /**
     * @dev Returns whether the specified token exists.
     * @param _tokenId uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function exists(uint256 _tokenId) public view returns (bool isExist) {
        isExist = super._exists(_tokenId);
        return isExist;
    }

    /**
     * @dev Gets the list of token IDs of the requested owner, inherited from ERC721 Enumerable
     * @param _owner address owning the tokens
     * @return uint256[] List of token IDs owned by the requested address
     */
    function tokensOf(address _owner) public onlyIfCryptoFaces view returns (uint256[] memory _tokenIds) {
        require(_owner != address(0));

        _tokenIds = super._tokensOfOwner(owner);

        return _tokenIds;
    }
}
