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
        //AccessControl(msg.sender);
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

contract CryptoFacesMarketPlace {

    using SafeMath for uint256;

    /**************
     * Properties *
     **************/
    CryptoFaces CFContract;
    Escrow OfferEscrow;

    // Escrow Contracts
    address[] offerEscrowContracts;
    address[] bidEscrowContract;

    // Map tokenId with it's recent Price
    mapping(uint256 => uint256) private tokenIdToValueInWei;

    // Map tokenId to Escrow
    mapping(uint256 => Escrow) private tokenIdToEscrow;

    // Map tokenId to Escrow Address
    mapping(uint256 => address) private tokenIdToEscrowAddress;

    // For single token offering
    struct Offer {
        bool isForSale;
        uint256 tokenId;
        address seller;
        uint256 valueInWei;
        address onlySellTo;     // specify to sell only to a specific person
        address offerEscrowAddress;
    }

    // For bundle of tokens offering
    struct BundleOffer {
        bool areForSale;
        uint256[] tokenIds;
        address seller;
        uint256 valueInWei;
        address onlySellTo;     // specify to sell only to a specific person
    }

    struct Bid {
        bool hasBid;
        uint punkIndex;
        address bidder;
        uint value;
    }

    // Mapping TokenId to Offer
    mapping(uint256 => Offer) tokensOfferedForSale;

    // Mapping TokenId to Bid
    mapping(uint256 => Bid) tokensBid;

    // Total wei been processed through the contract
    uint256 public totalPurchasedValueInWei;

    /**********
     * Events *
     **********/

    // Emitted on offerTokenForSale, and offerTokenForSaleTo
    event TokenOffered(
        uint256 indexed tokenId,
        uint256 indexed valueInWei,
        address indexed escrowContract
    );

    // Emitted on offerBundleOfTokensForSale
    event BundleOffered(
        uint256[] indexed tokenId,
        uint256 indexed valueInWei,
        address indexed seller
    );

    // Emitted on cancel token offering
    event TokenNoLongerForSale(
        uint256 indexed tokenId
    );

    // Emitted on purchases from within this contract
    event Purchase(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 indexed priceInWei
    );

    /*************
     * Modifiers *
     *************/
    modifier onlyForOwnerOrApproved(address _caller, uint256 _tokenId) {
        require(CFContract.isApprovedOrOwner(_caller, _tokenId), "CF: Caller is not Owner nor Approved");
        _;
    }

    modifier onlyForOwnerOrApprovedToBundleTokens(address _caller, uint256[] memory _tokenIds) {
        for(uint i = 0; i <= _tokenIds.length; i++) {
            require(CFContract.isApprovedOrOwner(_caller, _tokenIds[i]), "CF: Caller is not Owner nor Approved");
        }
        _;
    }

    modifier onlyIfTokenIdExists(uint256 _tokenId) {
        require(CFContract.exists(_tokenId), "CF: Token ID not found, not minted yet");
        _;
    }

    modifier onlyIfBundleOfTokenIdsExists(uint256[] memory _tokenIds) {
        for(uint i; i <= _tokenIds.length; i++) {
            require(CFContract.exists(_tokenIds[i]), "CF: Token ID not found, not minted yet");
        }
        _;
    }

    modifier notInActiveEscrow(uint256 _tokenId) {
        require(tokenIdToEscrowAddress[_tokenId] == address(0), "CF: This token is in an active Escrow, Please first deactivate the active Escrow contract");
        _;
    }

    /***************
     * Constructor *
     ***************/
    constructor(CryptoFaces _CFContract) public {
        CFContract = _CFContract;
    }

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
    notInActiveEscrow(_tokenId) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;

        // Create new Escrow for this offer
        Escrow tokenEscrowContract = new Escrow(CFContract, msg.sender, _tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow
        tokenIdToEscrow[_tokenId] = tokenEscrowContract;

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = address(tokenEscrowContract);

        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, msg.sender, _tokenValueInWei, address(0), address(tokenEscrowContract));
        OfferEscrow = tokenEscrowContract;

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
    notInActiveEscrow(_tokenId) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;
        Escrow tokenEscrowContract = new Escrow(CFContract, msg.sender, _tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = address(tokenEscrowContract);

        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, msg.sender, _tokenValueInWei, _to, address(tokenEscrowContract));

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei, address(tokenEscrowContract));
    }


    /**
     * @dev Public function for offer a bundle of tokens for sale
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _tokenIds Token ID
     * @param _offerValueInWei Value assigned from the owner
     */
    /*function offerBundleOfTokensForSale(uint256[] memory _tokenIds, uint256 _offerValueInWei) public
    onlyForOwnerOrApprovedToBundleTokens(_msgSender(), _tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds) {
        // Remove any offers on the chosen bundle of tokens
        for(uint i; i <= _tokenIds.length; i++) {
            if(tokensOfferedForSale[_tokenIds[i]].isForSale) {
                tokenNoLongerForSale(_tokenIds[i]);
            }
        }


        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;
        address tokenEscrowContract = new Escrow(_tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = tokenEscrowContract;
        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, _msgSender(), _tokenValueInWei, _to);

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei, _msgSender());
    }*/

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
    onlyIfTokenIdExists(_tokenId) {
        // Check if the token is on offer, cancel the offer
        if(tokensOfferedForSale[_tokenId].isForSale) {
            tokenNoLongerForSale(_tokenId);
        }

        // Transfer Ownership of the token to _to address
        CFContract.transferFromDirectly(msg.sender, _to, _tokenId);

        // TODO: check for the Bid
    }

    /**
    * @dev Public function transfer tokens to another address without any payments as a gift
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * Reverts if the token is already on an active Escrow contract
    * @param _to Receiver Address
    * @param _tokenIds Token ID
    */
    function transferTokensTo(address _to, uint256[] memory _tokenIds) public
    onlyForOwnerOrApprovedToBundleTokens(msg.sender, _tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds) {
        // Check if the tokens are on offer, cancel the offer
        for(uint i; i <= _tokenIds.length; i++) {
            if(tokensOfferedForSale[_tokenIds[i]].isForSale) {
                tokenNoLongerForSale(_tokenIds[i]);
            }
        }

        // Transfer the Ownership of the tokens to _to address
        for(uint x; x<= _tokenIds.length; x++) {
            CFContract.transferFromDirectly(msg.sender, _to, _tokenIds[x]);
        }
    }

    /**
    * @dev Public function for removing any offers on any token
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * @param _tokenId Token ID
    */
    function tokenNoLongerForSale(uint256 _tokenId) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId) {
        // Deactivate the offer sale
        tokensOfferedForSale[_tokenId] = Offer(false, _tokenId, msg.sender, 0, address(0), address(0));

        // TODO: Burn the offer contract

        // Emit Token no longer for sale event
        emit TokenNoLongerForSale(_tokenId);
    }

    function buyToken(uint256 _tokenId) public payable {
        // Pickup Escrow contract holds tokenId offer
        Escrow tokenEscrowOffer =  tokenIdToEscrow[_tokenId];

        address payable _buyer = msg.sender;

        // Execute Purchase function
        tokenEscrowOffer.confirmPurchase(_buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(tokenIdToValueInWei[_tokenId]);
    }




    /*function enterBidForToken(uint256 _tokenId) public
    onlyIfTokenIdExists(_tokenId) {
        require(msg.value != 0, 'CF: Current address has no sufficient value');
    }*/









    // TODO: Test purchase
    /**
     * @dev Public entry point for purchasing a Token
     * @dev Reverts if payment not provided in full
     * @dev Reverts if token is sold out
     * @dev Reverts if token is not active or available
     */
    /*function purchase(uint256 _tokenId) public payable
    whenNotPaused {
        return purchaseTo(msg.sender, _tokenId);
    }*/

    // TODO: Test purchaseTo
    /**
     * @dev Public entry point for purchasing an edition on behalf of someone else
     * @dev Reverts if edition is invalid
     * @dev Reverts if payment not provided in full
     * @dev Reverts if edition is sold out
     * @dev Reverts if edition is not active or available
     */
    /*
        function purchaseTo(address _to, uint256 _tokenId) public payable
        whenNotPaused {

            // Get an instance of TokenDetails
            TokenDetails storage _tokenDetails = tokenIdToTokenDetails[_tokenId];
            require(msg.value >= _tokenDetails.priceInWei, "Value must be greater than price of edition");

            // Splice funds and handle commissions
            _handleTransfer(_to, _tokenId, _tokenDetails.priceInWei, _tokenDetails.currentOwner);

            // Broadcast purchase
            emit Purchase(_tokenId, _to, msg.value);
        }

        function _handleTransfer(address _to, uint256 _tokenId, uint256 _priceInWei, address payable _currentOwner) internal {

            // Extract the artists commission and send it
            uint256 artistPayment = _priceInWei.div(100);
            if (artistPayment > 0) {
                _currentOwner.transfer(artistPayment);
            }

            // Transfer the ownership of the token to the buyer
            safeTransferFrom(_currentOwner, _to, _tokenId);

            // Record wei sale value
            totalPurchaseValueInWei = totalPurchaseValueInWei.add(msg.value);
        }
    */
}

contract Escrow {

    using SafeMath for uint256;

    address payable CFOwner;
    CryptoFaces CFContract;

    uint256 public tokenId;
    uint256 public tokenValue;
    address payable seller;
    address payable buyer;

    enum State { Created, Locked, Inactive }
    State public state;

    constructor(CryptoFaces _CFContract, address payable _seller, uint256 _tokenId, uint256 _tokenValue) public {
        seller = _seller;
        tokenId = _tokenId;
        tokenValue = _tokenValue;
        CFContract = _CFContract;
        address CFOwnerAddress = CFContract.cryptoFacesOwnerAddress();
        CFOwner = address(uint160(CFOwnerAddress));
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    function abort() public
    onlySeller
    inState(State.Created) {
        emit Aborted();
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }

    /// Confirm the purchase as buyer.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase(address payable _buyer) public
    inState(State.Created)
    condition(msg.value >= tokenValue) payable {
        buyer = _buyer;

        uint256 paymentValue = address(this).balance;
        uint256 ownerValue = paymentValue.div(10);
        uint256 sellerValue = paymentValue.sub(ownerValue);

        CFOwner.transfer(ownerValue);
        seller.transfer(sellerValue);

        CFContract.transferFromDirectly(seller, msg.sender, tokenId);

        state = State.Inactive;

        emit PurchaseConfirmed();
    }

    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    /*function confirmReceived() public
    onlySeller
    inState(State.Locked) {
        emit ItemReceived();
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Inactive;

        // NOTE: This actually allows both the buyer and the seller to
        // block the refund - the withdraw pattern should be used.

        buyer.transfer(tokenValue);
        seller.transfer(address(this).balance);
    }*/
}

