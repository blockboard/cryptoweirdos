pragma solidity ^0.5.12;

import "openzeppelin-solidity/contracts/access/Roles.sol";


/**
 * @title Based on OpenZeppelin Whitelist & RBCA contracts, and based on KnownOrigin Access Control.
 * @dev The AccessControl contract provides different access for addresses, and provides basic authorization control functions.
 */
contract AccessControl {

    using Roles for Roles.Role;

    uint8 public constant ROLE_CRYPTO_FACES = 1;
    uint8 public constant ROLE_CF_ARTISTS = 2;
    uint8 public constant ROLE_CF_OFFER = 3;

    event RoleAdded(
        address indexed operator,
        uint8 role
    );

    event RoleRemoved(
        address indexed operator,
        uint8 role
    );

    address public owner;

    mapping(uint8 => Roles.Role) private roles;

    modifier onlyIfCryptoFaces() {
        require(msg.sender == owner || hasRole(msg.sender, ROLE_CRYPTO_FACES));
        _;
    }

    modifier onlyIfCryptoFacesArtists() {
        require(msg.sender == owner || hasRole(msg.sender, ROLE_CRYPTO_FACES) || hasRole(msg.sender, ROLE_CF_ARTISTS));
        _;
    }

    modifier onlyIfCryptoFacesOffer() {
        require(msg.sender == owner || hasRole(msg.sender, ROLE_CRYPTO_FACES) || hasRole(msg.sender, ROLE_CF_OFFER));
        _;
    }

    /*
     * Constructor
     */
    constructor() public {
        owner = msg.sender;
    }

    ////////////////////////////////////
    // Whitelist/RBCA Derived Methods //
    ////////////////////////////////////

    function addAddressToAccessControl(address _operator, uint8 _role) public onlyIfCryptoFaces {
        roles[_role].add(_operator);
        emit RoleAdded(_operator, _role);
    }

    function removeAddressFromAccessControl(address _operator, uint8 _role) public onlyIfCryptoFaces {
        roles[_role].remove(_operator);
        emit RoleRemoved(_operator, _role);
    }

    /*function checkRole(address _operator, uint8 _role) public view {
        roles[_role].check(_operator);
    }*/

    function hasRole(address _operator, uint8 _role) public view returns (bool) {
        return roles[_role].has(_operator);
    }
}