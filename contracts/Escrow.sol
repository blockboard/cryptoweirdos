pragma solidity ^0.5.12;

//Source: http://solidity.readthedocs.io/en/v0.3.2/solidity-by-example.html#safe-remote-purchase

// CryptoFaces
import "./CryptoFaces.sol";

// For safe maths operations
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

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
        CFOwner = CFContract.cryptoFacesOwnerAddress();
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
    function _abort() internal
    onlySeller
    inState(State.Created) {
        emit Aborted();
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }

    /// Confirm the purchase as buyer.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase() external
    inState(State.Created)
    condition(msg.value >= tokenValue) payable {
        buyer = msg.sender;

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

