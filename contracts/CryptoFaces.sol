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
    // Base URI link for Faces Hashes (URI)
    string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

    // To begin from index 100001
    uint256 private tokenId = 100001;

    // All faces URIs
    string[] tokenURIs;

    // Faces Exits
    mapping(string => bool) tokenURIExists;

    // Total wei been processed through the contract
    uint256 public totalPurchaseValueInWei;

    // Object for token details
    struct TokenDetails{
        // Identifiers
        uint256 tokenId;    // the range e.g. 10000
        // Config
        address artistAccount;    // artists account
        uint256 priceInWei;       // base price for edition, could be overridden by external contracts
        string tokenURI;          // IPFS hash - see base URI
        // Counters
        uint256 totalPurchases;      // Total purchases
    }

    // _tokenId : EditionDetails
    mapping(uint256 => TokenDetials) internal tokenIdToTokenDetails;

    /**********
     * Events *
     **********/
    // Emitted on every mint
    event Minted(
        uint256 indexed _tokenId,
        string indexed _tokenURI,
        address indexed _buyer
    );

    // Emitted on purchases from within this contract
    event Purchase(
        uint256 indexed _tokenId,
        address indexed _buyer,
        uint256 _priceInWei
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
    constructor() public payable ERC721Full("CryptoFaces", "CF") { }

    /********************
     * Basic Operations *
     ********************/
    /**
     * @dev Internal function to mint a new token.
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _tokenURI The Face Hash the will be minted with the token
     */
    function mint(address _to ,string memory _tokenURI) public
    onlyIfCryptoFacesArtists {
        require(!tokenURIExists[_tokenURI]);

        mintWithTokenURI(_to, tokenId, _tokenURI);

        tokenURIExists[_tokenURI] = true;
        tokenURIs.push(_tokenURI);

        // inheriting ti
        emit Minted(tokenId, _tokenURI, _to);

        tokenId = tokenId.add(1);
    }

    /**
     * @dev Public entry point for purchasing a Token
     * @dev Reverts if payment not provided in full
     * @dev Reverts if token is sold out
     * @dev Reverts if token is not active or available
     */
    function purchase(uint256 _tokenId)
    public
    payable
    returns (uint256) {
        return purchaseTo(msg.sender, _tokenId);
    }

    /**
     * @dev Public entry point for purchasing an edition on behalf of someone else
     * @dev Reverts if edition is invalid
     * @dev Reverts if payment not provided in full
     * @dev Reverts if edition is sold out
     * @dev Reverts if edition is not active or available
     */
    /*function purchaseTo(address _to, uint256 _tokenId)
    public
    payable
    returns (uint256) {

        require(msg.value >= _editionDetails.priceInWei, "Value must be greater than price of edition");

        // Construct next token ID e.g. 100000 + 1 = ID of 100001 (this first in the edition set)
        uint256 _tokenId = _nextTokenId(_editionNumber);

        // Create the token
        _mintToken(_to, _tokenId, _editionNumber, _editionDetails.tokenURI);

        // Splice funds and handle commissions
        _handleFunds(_editionNumber, _editionDetails.priceInWei, _editionDetails.artistAccount, _editionDetails.artistCommission);

        // Broadcast purchase
        emit Purchase(_tokenId, _editionNumber, _to, msg.value);

        return _tokenId;
    }*/

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

    function burn(uint256 _tokenId) public onlyIfCryptoFacesArtists {

    }
}
