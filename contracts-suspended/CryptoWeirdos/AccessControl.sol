pragma solidity ^0.5.12;

import "openzeppelin-solidity/contracts/access/Roles.sol";


/**
 * @title Based on OpenZeppelin Whitelist & RBCA contracts, and based on KnownOrigin Access Control.
 * @dev The AccessControl contract provides different access for addresses, and provides basic authorization control functions.
 */
contract AccessControl {

    /**************
     * Properties *
     **************/
    using Roles for Roles.Role;

    uint8 public constant ROLE_CF_ARTISTS = 1;

    address public cryptoFacesOwner;

    mapping(uint8 => Roles.Role) private roles;

    /*************
     * Modifiers *
     *************/
    modifier onlyIfCryptoFacesArtists() {
        require(msg.sender == cryptoFacesOwner || hasRole(msg.sender, ROLE_CF_ARTISTS));
        _;
    }

    event RoleAdded(
        address indexed operator,
        uint8 role
    );

    event RoleRemoved(
        address indexed operator,
        uint8 role
    );


    /*
     * Constructor
     */
    constructor() public {
        cryptoFacesOwner = msg.sender;
    }

    ////////////////////////////////////
    // Whitelist/RBCA Derived Methods //
    ////////////////////////////////////
    function whoIsOwner() public view returns (address) {
        return cryptoFacesOwner;
    }

    function addAddressToAccessControl(address _operator, uint8 _role) public onlyIfCryptoFacesArtists {
        roles[_role].add(_operator);
        emit RoleAdded(_operator, _role);
    }

    function removeAddressFromAccessControl(address _operator, uint8 _role) public onlyIfCryptoFacesArtists {
        roles[_role].remove(_operator);
        emit RoleRemoved(_operator, _role);
    }

    function hasRole(address _operator, uint8 _role) public view returns (bool) {
        return roles[_role].has(_operator);
    }
}