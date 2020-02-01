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
    struct TokenDetails {
        // Identifiers
        uint256 tokenId;    // the range e.g. 10000
        address artistAccount;    // artists account
        // Config
        uint256 priceInWei;       // base price for edition, could be overridden by external contracts
        string tokenURI;          // IPFS hash - see base URI
        address payable currentOwner;      // Will changed after any purchase happen
        // Counters
        uint256 totalPurchases;      // Total purchases
    }

    // _tokenId : TokenDetails
    mapping(uint256 => TokenDetails) internal tokenIdToTokenDetails;

    /**********
     * Events *
     **********/
    // Emitted on purchases from within this contract
    event Purchase(
        uint256 indexed _tokenId,
        address indexed _buyer,
        uint256 indexed _priceInWei
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
     * @dev Internal function to mint a new token to the creator (caller)
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _tokenURI The Face Hash the will be minted with the token
     * @param _priceInWei The initial price to the nft
     */
    function mint(string memory _tokenURI, uint256 _priceInWei) public
    onlyIfCryptoFacesArtists {
        // Checks that tokenURI is unique
        require(!tokenURIExists[_tokenURI]);

        // Mint token form parent "ERC721MetadataMintable"
        mintWithTokenURI(_msgSender(), tokenId, _tokenURI);

        // Update the new minted token data
        tokenURIExists[_tokenURI] = true;
        tokenURIs.push(_tokenURI);
        tokenIdToTokenDetails[tokenId] = TokenDetails({
            tokenId: tokenId,
            artistAccount: _msgSender(),
            priceInWei: _priceInWei,
            tokenURI: _tokenURI,
            currentOwner: _msgSender(),
            totalPurchases: 0
            });

        tokenId = tokenId.add(1);
    }

    /**
     * @dev Internal function to mint a new token to specific address
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _to The account address of the received address
     * @param _tokenURI The Face Hash the will be minted with the token
     * @param _priceInWei The initial price to the nft
     */
    function mintTo(address payable _to ,string memory _tokenURI, uint256 _priceInWei) public
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
               priceInWei: _priceInWei,
               tokenURI: _tokenURI,
               currentOwner: _to,
               totalPurchases: 0
            });

        tokenId = tokenId.add(1);
    }

    // TODO: Test purchase
    /**
     * @dev Public entry point for purchasing a Token
     * @dev Reverts if payment not provided in full
     * @dev Reverts if token is sold out
     * @dev Reverts if token is not active or available
     */
    function purchase(uint256 _tokenId) public payable
    returns (uint256) {
        return purchaseTo(msg.sender, _tokenId);
    }

    // TODO: Test purchaseTo
    /**
     * @dev Public entry point for purchasing an edition on behalf of someone else
     * @dev Reverts if edition is invalid
     * @dev Reverts if payment not provided in full
     * @dev Reverts if edition is sold out
     * @dev Reverts if edition is not active or available
     */
    function purchaseTo(address _to, uint256 _tokenId) public payable
    whenNotPaused
    returns (uint256) {

        TokenDetails storage _tokenDetails = tokenIdToTokenDetails[_tokenId];
        require(msg.value >= _tokenDetails.priceInWei, "Value must be greater than price of edition");

        // Splice funds and handle commissions
        _handleTransfer(_tokenId, _tokenDetails.priceInWei, _tokenDetails.currentOwner);

        // Broadcast purchase
        emit Purchase(_tokenId, _to, msg.value);

        return _tokenId;
    }

    function _handleTransfer(uint256 _tokenId, uint256 _priceInWei, address payable _currentOwner) internal {

        // Extract the artists commission and send it
        uint256 artistPayment = _priceInWei.div(100);
        if (artistPayment > 0) {
            _currentOwner.transfer(artistPayment);
        }

        // Transfer the ownership of the token to the buyer
        safeTransferFrom(_currentOwner, _msgSender(), _tokenId);

        // Record wei sale value
        totalPurchaseValueInWei = totalPurchaseValueInWei.add(msg.value);
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

    function burn(uint256 _tokenId) public onlyIfCryptoFacesArtists {

    }
}
