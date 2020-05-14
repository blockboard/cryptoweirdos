pragma solidity ^0.5.12;

import "./contracts/CryptoFaces.sol";

// For safe maths operations
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract BundleEscrow {

    /*************
     * Libraries *
     *************/
    using SafeMath for uint256;

    /**************
     * Properties *
     **************/
    address payable CFOwner;
    CryptoFaces CFContract;

    uint256[] public tokenIds;
    uint256 public tokensValue;
    address public seller;
    address public buyer;

    enum State { Created, Locked, Inactive }
    State public state;

    /***************
     * Constructor *
     ***************/
    constructor(CryptoFaces _CFContract, address _seller, address _buyer, uint256[] memory _tokenIds, uint256 _tokensValue) public {
        seller = _seller;
        buyer = _buyer;
        tokenIds = _tokenIds;
        tokensValue = _tokensValue;
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
        require(buyer == address(0), 'BundleEscrow: This is not a public offer');

        for(uint i; i <= tokenIds.length; i++) {
            // Complete transferring the ownership of the token from the seller to the buyer (new owner)
            CFContract.transferFromDirectly(seller, _buyer, tokenIds[i]);
        }

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

    /**
     * @dev public function called when the offer is intended to a specific buyer address
     * Reverts the state not Created
     * @param _buyer address of the buyer
     */
    function confirmPurchaseTo(address _buyer) public
    inState(State.Created) payable {

        // Check if the buyer is not equal to, so it's special offer to some buyer from the seller
        require(buyer != address(0) && buyer == _buyer, 'BundleEscrow: This offer is not for this address');

        for(uint i; i <= tokenIds.length; i++) {
            // Complete transferring the ownership of the token from the seller to the buyer (new owner)
            CFContract.transferFromDirectly(seller, _buyer, tokenIds[i]);
        }

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
