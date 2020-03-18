pragma solidity ^0.5.12;

contract EscrowBundle {

    /**************
     * Properties *
     **************/
    uint256[] public tokenIds;
    uint256 public bundleValue;
    address payable seller;
    address payable buyer;

    enum State { Created, Locked, Inactive }
    State public state;

    /**********
     * Events *
     **********/
    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    /*************
    * Modifiers *
    *************/
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

    /***************
     * Constructor *
     ***************/
    constructor(uint256[] memory _tokenIds, uint256 _bundleValue) public {
        seller = msg.sender;
        tokenIds = _tokenIds;
        bundleValue = _bundleValue;
    }

    /********************
     * Basic Operations *
     ********************/
    /**
     * @dev Public function to abort the purchase and reclaim the ether
     * @dev Private (Seller only)
     * @dev The contract is locked
     * Reverts if the caller is not the seller
     */
    function abort() public
    onlySeller
    inState(State.Created) {
        emit Aborted();
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }

    /**
     * @dev Public function to confirm the purchase as a buyer
     * @dev Private (Buyer only)
     * @dev The ether will be locked until confirmReceived
     * Reverts if the buyer value is lower than bundle value
     */
    function confirmPurchase() public
    inState(State.Created)
    condition(msg.value >= bundleValue) payable {
        emit PurchaseConfirmed();
        buyer = msg.sender;
        state = State.Locked;
    }

    /**
     * @dev Public function to confirm that you (the buyer) received the token
     * @dev Private (Buyer only)
     * @dev The contract is locked
     * Reverts if the caller is not the Buyer
     */
    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived() public
    onlyBuyer
    inState(State.Locked) {
        emit ItemReceived();
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Inactive;

        // NOTE: This actually allows both the buyer and the seller to
        // block the refund - the withdraw pattern should be used.

        buyer.transfer(bundleValue);
        seller.transfer(address(this).balance);
    }
}
