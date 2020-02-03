pragma solidity ^0.5.12;

// CryptoFaces
import "./CryptoFaces.sol";

// Escrow
import "./Escrow.sol";

contract CryptoFacesMarketPlace is CryptoFaces {

    /**************
     * Properties *
     **************/

    // Escrow Contracts
    address[] offerEscrowContracts;
    address[] bidEscrowContract;

    // Map tokenId with it's recent Price
    mapping(uint256 => uint256) private tokenIdToValueInWei;

    // Map tokenId to Escrow Address
    mapping(uint256 => address) private tokenIdToEscrowAddress;

    // For single token offering
    struct Offer {
        bool isForSale;
        uint256 tokenId;
        address seller;
        uint256 valueInWei;
        address onlySellTo;     // specify to sell only to a specific person
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

    // Mapping offered tokens
    mapping(uint256 => Offer) tokensOfferedForSale;

    // Total wei been processed through the contract
    uint256 public totalPurchaseValueInWei;

    /**********
     * Events *
     **********/

    // Emitted on offerTokenForSale, and offerTokenForSaleTo
    event TokenOffered(
        uint256 indexed tokenId,
        uint256 indexed valueInWei,
        address indexed seller
    );

    // Emitted on offerBundleOfTokensForSale
    event BundleOffered(
        uint256[] indexed tokenId,
        uint256 indexed valueInWei,
        address indexed seller
    );

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
        require(super._isApprovedOrOwner(_caller, _tokenId), "CF: Caller is not Owner nor Approved");
        _;
    }

    modifier onlyForOwnerOrApprovedToBundleTokens(address _caller, uint256[] memory _tokenIds) {
        for(uint i = 0; i <= _tokenIds.length; i++) {
            require(super._isApprovedOrOwner(_caller, _tokenIds[i]), "CF: Caller is not Owner nor Approved");
        }
        _;
    }

    modifier onlyIfTokenIdExists(uint256 _tokenId) {
        require(exists(_tokenId), "CF: Token ID not found, not minted yet");
        _;
    }

    modifier onlyIfBundleOfTokenIdsExists(uint256[] memory _tokenIds) {
        for(uint i; i <= _tokenIds; i++) {
            require(exists(_tokenId), "CF: Token ID not found, not minted yet");
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
    constructor() CryptoFacesMarketPlace public { }

    /**
     * @dev Public function for sale tokens with specified price
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _tokenId Token ID
     * @param _tokenValueInWei Value assigned from the owner
     */
    function offerTokenForSale(uint256 _tokenId, uint256 _tokenValueInWei) public
    onlyForOwnerOrApproved(_msgSender(), _tokenId)
    onlyIfTokenIdExists(_tokenId)
    notInActiveEscrow(_tokenId) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;
        address tokenEscrowContract = new Escrow(_tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = tokenEscrowContract;
        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, _msgSender(), _tokenValueInWei, address(0));

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei, _msgSender());
    }

    /**
     * @dev Public function for sale tokens with specified price to specific address
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _tokenId Token ID
     * @param _tokenValueInWei Value assigned from the owner
     */
    function offerTokenForSaleTo(address _to, uint256 _tokenId, uint256 _tokenValueInWei) public
    onlyForOwnerOrApproved(_msgSender(), _tokenId)
    onlyIfTokenIdExists(_tokenId)
    notInActiveEscrow(_tokenId) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;
        address tokenEscrowContract = new Escrow(_tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = tokenEscrowContract;
        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, _msgSender(), _tokenValueInWei, _to);

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei, _msgSender());
    }

    /**
     * @dev Public function for offer a bundle of tokens for sale
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _tokenId Token ID
     * @param _tokenValueInWei Value assigned from the owner
     */
    /*function offerBundleOfTokensForSale(uint256[] memory _tokenIds, uint256 _offerValueInWei) public
    onlyForOwnerOrApprovedToBundleTokens(_msgSender(), _tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds) {
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
    onlyForOwnerOrApproved(_tokenId)
    onlyIfTokenIdExists(_tokenId) {
        // Check if the token is on offer, cancel the offer
        if(tokensOfferedForSale[_tokenId].isForSale) {
            tokenNoLongerForSale(_tokenId);
        }

        // Transfer Ownership of the token to _to address
        safeTransferFrom(_msgSender(), _to, _tokenId);

        // TODO: check for the Bid
    }

    /**
    * @dev Public function transfer tokens to another address without any payments as a gift
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * Reverts if the token is already on an active Escrow contract
    * @param _to Receiver Address
    * @param _tokenId Token ID
    */
    function transferTokensTo(address _to, uint256[] _tokenIds) public
    onlyForOwnerOrApprovedToBundleTokens(_tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds) {
        // Check if the tokens are on offer, cancel the offer
        for(uint i; i <= _tokenIds.length; i++) {
            if(tokensOfferedForSale[_tokenIds[i]].isForSale) {
                tokenNoLongerForSale(_tokenIds[i]);
            }
        }

        // Transfer the Ownership of the tokens to _to address
        for(uint x; x<= _tokenIds.length; i++) {
            safeTransferFrom(_msgSender(), _to, _tokenIds[i]);
        }
    }

    /**
    * @dev Public function for removing any offers on any token
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * @param _tokenId Token ID
    */
    function tokenNoLongerForSale(uint256 _tokenId) public
    onlyForOwnerOrApproved(_tokenId)
    onlyIfTokenIdExists(_tokenId) {
        // Deactivate the offer sale
        tokensOfferedForSale[_tokenId] = Offer(false, _tokenId, _msgSender(), 0, address(0));

        // TODO: Burn the offer contract

        // Emit Token no longer for sale event
        emit TokenNoLongerForSale(_tokenId);
    }













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
