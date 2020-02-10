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

contract CryptoFaces is ERC721Full, ERC721MetadataMintable, AccessControl, Pausable {

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

    /***************
     * Constructor *
     ***************/
    constructor() public payable ERC721Full("CryptoFaces", "CF") {
        //AccessControl(msg.sender);
    }

    /*************
     * Modifiers *
     *************/
    modifier onlyValidTokenId(uint256 _tokenId) {
        require(exists(_tokenId), "Token ID does not exist");
        _;
    }

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

    /**
     * @dev Transfers the ownership of a given token ID to another address, after a successful purchase
     * Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     * Requires the msg.sender to be the owner, approved, or operator.
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
     */
    function transferFromDirectly(address _from, address _to, uint256 _tokenId) public {
        super._transferFrom(_from, _to, _tokenId);
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
    function tokensOf(address _owner) public onlyIfCryptoFacesArtists view returns (uint256[] memory _tokenIds) {
        require(_owner != address(0));

        _tokenIds = super._tokensOfOwner(_owner);

        return _tokenIds;
    }

    /**
     * @dev Public Function that returns true if the spender is the owner or approved of the token
     * @param _spender address checking for ownership
     * @param _tokenId uint256
     * @return bool true if the _spender is the owner or approved
     */
    function isApprovedOrOwner(address _spender, uint256 _tokenId) public view returns (bool) {
        return super._isApprovedOrOwner(_spender, _tokenId);
    }

    /***********************
     * Contract Info Query *
     ***********************/
    /**
      * @dev Gets the address of CryptoFaces Owner
      * @return address
      */
    function cryptoFacesOwnerAddress() public view returns (address) {
        return super.whoIsOwner();
    }

    /**
      * @dev Grand an address CF Artist Role
      * @return address
      */
    function addArtistRoleToAddress(address _artist) public onlyIfCryptoFacesArtists {
        super.addAddressToAccessControl(_artist, 1);
        super.addMinter(_artist);
    }
}

contract CryptoFacesMarketPlace{

    using SafeMath for uint256;

    /**************
     * Properties *
     **************/
    CryptoFaces CFContract;

    // For Each tokenStatus
    struct TokenStatus {
        bool isInCurrentOffer;
    }

    // For single token offering
    struct Offer {
        bool isForSale;
        uint256 tokenId;
        address seller;
        uint256 valueInWei;
        address onlySellTo;     // specify to sell only to a specific person
        address offerEscrowAddress;
    }

    struct Bid {
        bool hasBid;
        uint punkIndex;
        address bidder;
        uint value;
    }

    // mapping tokenId to tokenStatus
    mapping(uint256 => TokenStatus) private tokenIdToTokenStatus;

    // Map tokenId with it's recent Price
    mapping(uint256 => uint256) private tokenIdToValueInWei;

    // Map tokenId to Escrow Address
    mapping(uint256 => address) private tokenIdToEscrowAddress;

    // Mapping TokenId to Offer
    mapping(uint256 => Offer) private tokensOfferedForSale;

    // Mapping TokenId to Bid
    mapping(uint256 => Bid) tokensBid;

    // Total wei been processed through the contract
    uint256 public totalPurchasedValueInWei;

    /***************
     * Constructor *
     ***************/
    constructor(CryptoFaces _CFContract) public {
        CFContract = _CFContract;
    }

    /*************
     * Modifiers *
     *************/
    // For check if caller is owner or approved to token
    modifier onlyForOwnerOrApproved(address _caller, uint256 _tokenId) {
        require(CFContract.isApprovedOrOwner(_caller, _tokenId), "CF MarketPlace: Caller is not Owner nor Approved");
        _;
    }

    // For check if token existence
    modifier onlyIfTokenIdExists(uint256 _tokenId) {
        require(CFContract.exists(_tokenId), "CF MarketPlace: Token ID not found, not minted yet");
        _;
    }

    // For check if token is for sale
    modifier onlyIfTokenForSale(uint256 _tokenId) {
        Offer memory offer = tokensOfferedForSale[_tokenId];
        require(offer.isForSale);
        _;
    }

    // For check that offer is for msg.sender
    modifier isOfferedTo(uint256 _tokenId) {
        Offer memory tokenOffer = tokensOfferedForSale[_tokenId];
        address buyer = tokenOffer.onlySellTo;
        require(buyer != address(0) && buyer == msg.sender);
        _;
    }

    // For check any condition
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    /**********
     * Events *
     **********/
    // Emitted on offerTokenForSale, and offerTokenForSaleTo
    event TokenOffered(
        uint256 indexed tokenId,
        uint256 indexed valueInWei,
        address indexed escrowAddress
    );

    // Emitted on cancel token offering
    event TokenNoLongerForSale(
        uint256 indexed tokenId
    );

    // Emitted on purchases from within this contract
    event OfferBought(
        uint256 indexed tokenId,
        uint256 indexed offerValueInWei,
        address indexed buyer
    );

    /********************
     * Basic Operations *
     ********************/
    /**
     * @dev Public function for sale tokens with specified price
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _tokenId Token ID
     * @param _tokenValueInWei Value assigned from the owner
     */
    function offerTokenForSale(uint256 _tokenId, uint256 _tokenValueInWei) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    condition(!_isInActiveOffer(_tokenId)) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;

        // Create new Escrow for this offer
        Escrow tokenEscrowContract = new Escrow(CFContract, msg.sender, address(0), _tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = address(tokenEscrowContract);

        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, msg.sender, _tokenValueInWei, address(0), address(tokenEscrowContract));

        // Change token status
        tokenIdToTokenStatus[_tokenId] = TokenStatus(true);

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei, address(tokenEscrowContract));
    }

    /**
     * @dev Public function for sale tokens with specified price to specific address
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _to address
     * @param _tokenId Token ID
     * @param _tokenValueInWei Value assigned from the owner
     */
    function offerTokenForSaleTo(address _to, uint256 _tokenId, uint256 _tokenValueInWei) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    condition(!_isInActiveOffer(_tokenId)) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;

        // Create new Escrow for this offer
        Escrow tokenEscrowContract = new Escrow(CFContract, msg.sender, _to, _tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = address(tokenEscrowContract);

        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, msg.sender, _tokenValueInWei, _to, address(tokenEscrowContract));

        // Change token status
        tokenIdToTokenStatus[_tokenId] = TokenStatus(true);

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei, address(tokenEscrowContract));
    }

    // TODO: check if token is in active Escrow
    /**
     * @dev Public function transfer token to another address without any payments as a gift
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _to Receiver Address
     * @param _tokenId Token ID
     */
    function transferTokenTo(address _to, uint256 _tokenId) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    condition(!_isInActiveOffer(_tokenId)) {
        // Check if the token is on offer, cancel the offer
        if(tokensOfferedForSale[_tokenId].isForSale) {
            tokenNoLongerForSale(_tokenId);
        }

        // Transfer Ownership of the token to _to address
        CFContract.transferFromDirectly(msg.sender, _to, _tokenId);

        // TODO: check for the Bid
    }

    /**
    * @dev Public function for purchasing token from existing public offer
    * Reverts if the caller is the owner of the token and offer
    * Reverts if the offer is not a public offer
    * Reverts if msg.value is less than token value in wei
    * @param _tokenId Token ID
    */
    function purchasePublicOffer(uint256 _tokenId) public payable {
        // Check if this offer is for special address or not
        Offer memory tokenOffer = tokensOfferedForSale[_tokenId];
        address isSellTo = tokenOffer.onlySellTo;
        require(isSellTo == address(0), 'CF MarketPlace: This offer is not a public offer');

        address _tokenEscrowAddress = tokenIdToEscrowAddress[_tokenId];
        address _buyer = msg.sender;
        uint256 _tokenValueInWei = tokenIdToValueInWei[_tokenId];

        // Send buyer value to escrow contract
        address(uint160(_tokenEscrowAddress)).send(msg.value);

        // Pickup Escrow contract holds tokenId offer
        Escrow escrowAddress = Escrow(_tokenEscrowAddress);

        // Execute Purchase function
        escrowAddress.confirmPurchase(_buyer);

        // Emit successful Token Bought event
        emit OfferBought(_tokenId, tokenIdToValueInWei[_tokenId], _buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(_tokenValueInWei);

        // Change token mapping escrow to default
        tokenIdToEscrowAddress[_tokenId] = address(0);

        // Change token mapping offer to default
        tokenNoLongerForSale(_tokenId);
    }

    /**
    * @dev Public function for special address to purchase special offer to this address
    * Reverts if the caller is the owner of the token and offer
    * Reverts if the offer is not for this caller
    * Reverts if msg.value is less than token value in wei
    * @param _tokenId Token ID
    */
    function purchaseSpecialOffer(uint256 _tokenId) public
    condition(_notOwnerOfToken(_tokenId))
    isOfferedTo(_tokenId)
    condition(msg.value >= tokenIdToValueInWei[_tokenId])
    condition(_isInActiveOffer(_tokenId)) payable {

        // Pickup Escrow contract holds tokenId offer
        Escrow escrowAddress = Escrow(tokenIdToEscrowAddress[_tokenId]);

        address _buyer = msg.sender;
        uint256 _tokenValueInWei = tokenIdToValueInWei[_tokenId];

        // Send buyer value to escrow contract
        address(uint160(tokenIdToEscrowAddress[_tokenId])).send(msg.value);

        // Execute Purchase function
        escrowAddress.confirmPurchaseTo(_buyer);

        // Emit successful Token Bought event
        emit OfferBought(_tokenId, tokenIdToValueInWei[_tokenId], _buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(_tokenValueInWei);

        // Change token mapping escrow to default
        tokenIdToEscrowAddress[_tokenId] = address(0);

        // Change token mapping offer to default
        tokenNoLongerForSale(_tokenId);
    }

    /**
    * @dev Public function for removing any offers on any token
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * @param _tokenId Token ID
    */
    function tokenNoLongerForSale(uint256 _tokenId) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    onlyIfTokenForSale(_tokenId)
    condition(_isInActiveOffer(_tokenId)) {
        // Deactivate the offer sale
        tokensOfferedForSale[_tokenId] = Offer(false, _tokenId, msg.sender, 0, address(0), address(0));

        // Change token status in offer
        TokenStatus memory _tokenStatus = tokenIdToTokenStatus[_tokenId];
        _tokenStatus.isInCurrentOffer = false;

        // Pickup Escrow contract from it's address
        Escrow escrowAddress = Escrow(tokenIdToEscrowAddress[_tokenId]);

        address _seller = msg.sender;

        // Execute Abort function
        escrowAddress.abort(_seller);

        // Emit Token no longer for sale event
        emit TokenNoLongerForSale(_tokenId);
    }

    /**********************
     * Token Offers Query *
     **********************/
    /**
      * @dev Private Function for check if token is in current offer
      * @return bool
      */
    function _isInActiveOffer(uint256 _tokenId) private returns (bool) {
        TokenStatus memory _tokenStatus = tokenIdToTokenStatus[_tokenId];
        bool _isInCurrentOffer = _tokenStatus.isInCurrentOffer;
        return _isInCurrentOffer;
    }

    /**
     * @dev Private Function for check the ownership of the token
     * @return bool
     */
    function _notOwnerOfToken(uint256 _tokenId) private returns (bool) {
        address _owner = CFContract.ownerOf(_tokenId);
        return (_owner != msg.sender);
    }
}

contract Escrow {

    /*************
     * Libraries *
     *************/
    using SafeMath for uint256;

    /**************
     * Properties *
     **************/
    address payable CFOwner;
    CryptoFaces CFContract;

    uint256 public tokenId;
    uint256 public tokenValue;
    address public seller;
    address public buyer;

    enum State { Created, Locked, Inactive }
    State public state;

    /***************
     * Constructor *
     ***************/
    constructor(CryptoFaces _CFContract, address _seller, address _buyer, uint256 _tokenId, uint256 _tokenValue) public {
        seller = _seller;
        buyer = _buyer;
        tokenId = _tokenId;
        tokenValue = _tokenValue;
        CFContract = _CFContract;
        address CFOwnerAddress = CFContract.cryptoFacesOwnerAddress();
        CFOwner = address(uint160(CFOwnerAddress));
    }

    /*************
     * Modifiers *
     *************/
    modifier onlySeller(address _seller) {
        require(_seller == seller);
        _;
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    /**********
     * Events *
     **********/
    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    /**
    * @dev public function called when seller want to abort this offer, before any purchase happens
    * Reverts if the caller is not the seller
    * @param _seller address of the seller
    */
    function abort(address _seller) public
    onlySeller(_seller)
    inState(State.Created) {
        seller = _seller;
        emit Aborted();
        state = State.Inactive;
        selfdestruct(address(uint160(seller)));
        //seller.transfer(address(this).balance);
    }

    /**
     * @dev public function called when a buyer what to purchase token offer
     * Reverts the state not Created
     * @param _buyer address of the buyer
     */
    function confirmPurchase(address _buyer) public
    inState(State.Created) payable {

        // Check if the buyer address equals zero address, so that it's a public escrow offer from  the seller
        require(buyer == address(0), 'Escrow: This is not a public offer');

        // Complete transferring the ownership of the token from the seller to the buyer (new owner)
        CFContract.transferFromDirectly(seller, _buyer, tokenId);

        // Convert buyer address to Payable address
        buyer = address(uint160(_buyer));

        // Payment value stored within the contract, sent from the Market Place
        //uint256 paymentValue = ;

        // Add 1% from the payment to CF Owner
        //uint256 ownerValue = paymentValue.mul(1/10);

        // Add the rest to token owner (seller)
        //uint256 sellerValue = paymentValue;

        // Transfer 1% of payment value to CF Owner
        //CFOwner.transfer(ownerValue);

        // Convert seller account to Payable
        address(uint160(seller)).transfer(address(this).balance);

        // Set state of the contract to Inactive contract
        state = State.Inactive;

        // Self destroy the contract
        selfdestruct(address(uint160(CFOwner)));

        // Emit purchase confirmed event
        emit PurchaseConfirmed();
    }

    /**
    * @dev public function called when the offer is intended to a specific buyer address
    * Reverts the state not Created
    * @param _buyer address of the buyer
    */
    function confirmPurchaseTo(address _buyer) public
    inState(State.Created) payable {

        // Check if the buyer is not equal to, so it's special offer to some buyer from the seller
        require(buyer != address(0) && buyer == _buyer, 'Escrow: This offer is not for this address');

        // Complete transferring the ownership of the token from the seller to the buyer (new owner)
        CFContract.transferFromDirectly(seller, _buyer, tokenId);

        // Convert buyer address to Payable address
        buyer = address(uint160(_buyer));

        // Payment value stored within the contract, sent from the Market Place
        uint256 paymentValue = address(this).balance;

        // Add 1% from the payment to CF Owner
        //uint256 ownerValue = paymentValue.mul(0.1);

        // Add the rest to token owner (seller)
        uint256 sellerValue = paymentValue;

        // Transfer 1% of payment value to CF Owner
        //CFOwner.transfer(ownerValue);

        // Convert seller account to Payable
        address(uint160(seller)).transfer(sellerValue);

        // Set state of the contract to Inactive contract
        state = State.Inactive;

        // Self destroy the contract
        selfdestruct(address(uint160(CFOwner)));

        // Emit purchase confirmed event
        emit PurchaseConfirmed();
    }
}