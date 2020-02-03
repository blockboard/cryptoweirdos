pragma solidity ^0.4.0;

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

    //
    mapping(uint256 => address) private tokenIdToEscrowAddress;

    struct Offer {
        bool isForSale;
        uint256 tokenId;
        address seller;
        uint256 priceInWei;
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
    event TokenOffered(
        uint256 indexed tokenId,
        uint256 indexed priceInWei,
        address indexed seller
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

    modifier onlyIfTokenIdExists(uint256 _tokenId) {
        require(exists(_tokenId));
        _;
    }

    modifier notInActiveEscrow(uint256 _tokenId) {
        require(tokenIdToEscrowAddress(_tokenId) != address(0), "CF: This token is in an active Escrow, Please first deactivate the active Escrow contract");
        _;
    }

    constructor() CryptoFacesMarketPlace { }

    /**
     * @dev Public function for sale tokens with specified price
     * @dev Private (CF Artists only)
     * @dev Payment not needed for this method
     * Reverts if the given token ID already exists, and if the face already exists
     * @param _tokenURI The Face Hash the will be minted with the token
     */
    function offerFaceForSale(uint _tokenId, uint _tokenValueInWei) public
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


    // TODO: Test purchase
    /**
     * @dev Public entry point for purchasing a Token
     * @dev Reverts if payment not provided in full
     * @dev Reverts if token is sold out
     * @dev Reverts if token is not active or available
     */
    function purchase(uint256 _tokenId) public payable
    whenNotPaused {
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
}
