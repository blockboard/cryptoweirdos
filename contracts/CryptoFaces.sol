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

// ERC721 MetadataMintable
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol";

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

    /*************
     * Libraries *
     *************/
    using SafeMath for uint256;
    using Address for address;
    using Counters for uint256;

    /**************
     * Properties *
     **************/
    // Owner of the project
    address payable cryptoFacesOwner;

    // Base URI link for Faces Hashes (URI)
    string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

    // To begin from index 100001
    uint256 private tokenId = 100001;

    // All faces URIs
    string[] private tokenURIs;

    // Faces Exits
    mapping(string => bool) private tokenURIExists;

    // Object for token details
    struct TokenDetails {
        // Identifiers
        uint256 tokenId;    // the range e.g. 10000
        address artistAccount;    // artists account
        // Config
        string tokenURI;          // IPFS hash - see base URI
        address currentOwner;      // Will changed after any purchase happen
        // Counters
        uint256 totalPurchases;      // Total purchases
    }

    // _tokenId : TokenDetails
    mapping(uint256 => TokenDetails) internal tokenIdToTokenDetails;

    /**********
     * Events *
     **********/

    // Emitted whenever any token minted
    event Minted(
        address indexed artist,
        uint256 indexed tokenId
    );

    // Emitted whenever any token minted to any another address
    event MintedTo(
        address indexed artist,
        address indexed to,
        uint256 indexed tokenId
    );

    /*************
     * Modifiers *
     *************/
    modifier onlyValidTokenId(uint256 _tokenId) {
        require(exists(_tokenId), "Token ID does not exist");
        _;
    }

    /***************
     * Constructor *
     ***************/
    constructor() public payable ERC721Full("CryptoFaces", "CF") {
        cryptoFacesOwner = msg.sender;
    }

    /********************
     * Basic Operations *
     ********************/
    /**
     * @dev Public function to mint a new token to the creator (caller), Mint is for general minting not for submitting any price
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _tokenURI The Face Hash the will be minted with the token
     */
    function mint(string memory _tokenURI) public
    onlyIfCryptoFacesArtists {
        // Checks that tokenURI is unique
        require(!tokenURIExists[_tokenURI]);

        // Mint token from parent "ERC721MetadataMintable"
        mintWithTokenURI(_msgSender(), tokenId, _tokenURI);

        // Update the new minted token data
        tokenURIExists[_tokenURI] = true;
        tokenURIs.push(_tokenURI);
        tokenIdToTokenDetails[tokenId] = TokenDetails({
            tokenId: tokenId,
            artistAccount: _msgSender(),
            tokenURI: _tokenURI,
            currentOwner: _msgSender(),
            totalPurchases: 0
            });

        tokenId = tokenId.add(1);

        emit Minted(_msgSender(), tokenId);
    }

    /**
     * @dev Internal function to mint a new token to specific address
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _to The account address of the received address
     * @param _tokenURI The Face Hash the will be minted with the token
     */
    function mintTo(address payable _to ,string memory _tokenURI) public
    onlyIfCryptoFacesArtists {
        // Checks that tokenURI is unique
        require(!tokenURIExists[_tokenURI]);

        // Mint token form parent "ERC721MetadataMintable"
        mintWithTokenURI(_to, tokenId, _tokenURI);

        // Update the new minted token data
        tokenURIExists[_tokenURI] = true;
        tokenURIs.push(_tokenURI);
        tokenIdToTokenDetails[tokenId] = TokenDetails({
               tokenId: tokenId,
               artistAccount: _msgSender(),
               tokenURI: _tokenURI,
               currentOwner: _to,
               totalPurchases: 0
            });

        tokenId = tokenId.add(1);

        emit MintedTo(_msgSender(), _to, tokenId);
    }

    /***************
     * Token Query *
     ***************/
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

    /**
      * @dev Gets the address of CryptoFaces Owner
      * @return address
      */
    function cryptoFacesOwnerAddress() public view returns (address payable) {
        return cryptoFacesOwner;
    }
}
