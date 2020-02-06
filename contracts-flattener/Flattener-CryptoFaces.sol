
// File: openzeppelin-solidity/contracts/access/Roles.sol

pragma solidity ^0.5.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}

// File: contracts/AccessControl.sol

pragma solidity ^0.5.12;



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

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

pragma solidity ^0.5.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     *
     * _Available since v2.4.0._
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

// File: openzeppelin-solidity/contracts/GSN/Context.sol

pragma solidity ^0.5.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal { }
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: openzeppelin-solidity/contracts/access/roles/PauserRole.sol

pragma solidity ^0.5.0;



contract PauserRole is Context {
    using Roles for Roles.Role;

    event PauserAdded(address indexed account);
    event PauserRemoved(address indexed account);

    Roles.Role private _pausers;

    constructor () internal {
        _addPauser(_msgSender());
    }

    modifier onlyPauser() {
        require(isPauser(_msgSender()), "PauserRole: caller does not have the Pauser role");
        _;
    }

    function isPauser(address account) public view returns (bool) {
        return _pausers.has(account);
    }

    function addPauser(address account) public onlyPauser {
        _addPauser(account);
    }

    function renouncePauser() public {
        _removePauser(_msgSender());
    }

    function _addPauser(address account) internal {
        _pausers.add(account);
        emit PauserAdded(account);
    }

    function _removePauser(address account) internal {
        _pausers.remove(account);
        emit PauserRemoved(account);
    }
}

// File: openzeppelin-solidity/contracts/lifecycle/Pausable.sol

pragma solidity ^0.5.0;



/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
contract Pausable is Context, PauserRole {
    /**
     * @dev Emitted when the pause is triggered by a pauser (`account`).
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by a pauser (`account`).
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state. Assigns the Pauser role
     * to the deployer.
     */
    constructor () internal {
        _paused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() public onlyPauser whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyPauser whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

// File: openzeppelin-solidity/contracts/introspection/IERC165.sol

pragma solidity ^0.5.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: openzeppelin-solidity/contracts/token/ERC721/IERC721.sol

pragma solidity ^0.5.0;


/**
 * @dev Required interface of an ERC721 compliant contract.
 */
contract IERC721 is IERC165 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of NFTs in `owner`'s account.
     */
    function balanceOf(address owner) public view returns (uint256 balance);

    /**
     * @dev Returns the owner of the NFT specified by `tokenId`.
     */
    function ownerOf(uint256 tokenId) public view returns (address owner);

    /**
     * @dev Transfers a specific NFT (`tokenId`) from one account (`from`) to
     * another (`to`).
     *
     *
     *
     * Requirements:
     * - `from`, `to` cannot be zero.
     * - `tokenId` must be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this
     * NFT by either {approve} or {setApprovalForAll}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public;
    /**
     * @dev Transfers a specific NFT (`tokenId`) from one account (`from`) to
     * another (`to`).
     *
     * Requirements:
     * - If the caller is not `from`, it must be approved to move this NFT by
     * either {approve} or {setApprovalForAll}.
     */
    function transferFrom(address from, address to, uint256 tokenId) public;
    function approve(address to, uint256 tokenId) public;
    function getApproved(uint256 tokenId) public view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) public;
    function isApprovedForAll(address owner, address operator) public view returns (bool);


    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public;
}

// File: openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol

pragma solidity ^0.5.0;

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
contract IERC721Receiver {
    /**
     * @notice Handle the receipt of an NFT
     * @dev The ERC721 smart contract calls this function on the recipient
     * after a {IERC721-safeTransferFrom}. This function MUST return the function selector,
     * otherwise the caller will revert the transaction. The selector to be
     * returned can be obtained as `this.onERC721Received.selector`. This
     * function MAY throw to revert and reject the transfer.
     * Note: the ERC721 contract address is always the message sender.
     * @param operator The address which called `safeTransferFrom` function
     * @param from The address which previously owned the token
     * @param tokenId The NFT identifier which is being transferred
     * @param data Additional data with no specified format
     * @return bytes4 `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
     */
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4);
}

// File: openzeppelin-solidity/contracts/utils/Address.sol

pragma solidity ^0.5.5;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * This test is non-exhaustive, and there may be false-negatives: during the
     * execution of a contract's constructor, its address will be reported as
     * not containing a contract.
     *
     * IMPORTANT: It is unsafe to assume that an address for which this
     * function returns false is an externally-owned account (EOA) and not a
     * contract.
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != 0x0 && codehash != accountHash);
    }

    /**
     * @dev Converts an `address` into `address payable`. Note that this is
     * simply a type cast: the actual underlying value is not changed.
     *
     * _Available since v2.4.0._
     */
    function toPayable(address account) internal pure returns (address payable) {
        return address(uint160(account));
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     *
     * _Available since v2.4.0._
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-call-value
        (bool success, ) = recipient.call.value(amount)("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

// File: openzeppelin-solidity/contracts/drafts/Counters.sol

pragma solidity ^0.5.0;


/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented or decremented by one. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 * Since it is not possible to overflow a 256 bit integer with increments of one, `increment` can skip the {SafeMath}
 * overflow check, thereby saving gas. This does assume however correct usage, in that the underlying `_value` is never
 * directly accessed.
 */
library Counters {
    using SafeMath for uint256;

    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        counter._value += 1;
    }

    function decrement(Counter storage counter) internal {
        counter._value = counter._value.sub(1);
    }
}

// File: openzeppelin-solidity/contracts/introspection/ERC165.sol

pragma solidity ^0.5.0;


/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts may inherit from this and call {_registerInterface} to declare
 * their support of an interface.
 */
contract ERC165 is IERC165 {
    /*
     * bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7
     */
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    /**
     * @dev Mapping of interface ids to whether or not it's supported.
     */
    mapping(bytes4 => bool) private _supportedInterfaces;

    constructor () internal {
        // Derived contracts need only register support for their own interfaces,
        // we register support for ERC165 itself here
        _registerInterface(_INTERFACE_ID_ERC165);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     *
     * Time complexity O(1), guaranteed to always use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return _supportedInterfaces[interfaceId];
    }

    /**
     * @dev Registers the contract as an implementer of the interface defined by
     * `interfaceId`. Support of the actual ERC165 interface is automatic and
     * registering its interface id is not required.
     *
     * See {IERC165-supportsInterface}.
     *
     * Requirements:
     *
     * - `interfaceId` cannot be the ERC165 invalid interface (`0xffffffff`).
     */
    function _registerInterface(bytes4 interfaceId) internal {
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721.sol

pragma solidity ^0.5.0;








/**
 * @title ERC721 Non-Fungible Token Standard basic implementation
 * @dev see https://eips.ethereum.org/EIPS/eip-721
 */
contract ERC721 is Context, ERC165, IERC721 {
    using SafeMath for uint256;
    using Address for address;
    using Counters for Counters.Counter;

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    // Mapping from token ID to owner
    mapping (uint256 => address) private _tokenOwner;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private _tokenApprovals;

    // Mapping from owner to number of owned token
    mapping (address => Counters.Counter) private _ownedTokensCount;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    /*
     *     bytes4(keccak256('balanceOf(address)')) == 0x70a08231
     *     bytes4(keccak256('ownerOf(uint256)')) == 0x6352211e
     *     bytes4(keccak256('approve(address,uint256)')) == 0x095ea7b3
     *     bytes4(keccak256('getApproved(uint256)')) == 0x081812fc
     *     bytes4(keccak256('setApprovalForAll(address,bool)')) == 0xa22cb465
     *     bytes4(keccak256('isApprovedForAll(address,address)')) == 0xe985e9c5
     *     bytes4(keccak256('transferFrom(address,address,uint256)')) == 0x23b872dd
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256)')) == 0x42842e0e
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)')) == 0xb88d4fde
     *
     *     => 0x70a08231 ^ 0x6352211e ^ 0x095ea7b3 ^ 0x081812fc ^
     *        0xa22cb465 ^ 0xe985e9c ^ 0x23b872dd ^ 0x42842e0e ^ 0xb88d4fde == 0x80ac58cd
     */
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

    constructor () public {
        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(_INTERFACE_ID_ERC721);
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner address to query the balance of
     * @return uint256 representing the amount owned by the passed address
     */
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");

        return _ownedTokensCount[owner].current();
    }

    /**
     * @dev Gets the owner of the specified token ID.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");

        return owner;
    }

    /**
     * @dev Approves another address to transfer the given token ID
     * The zero address indicates there is no approved address.
     * There can only be one approved address per token at a given time.
     * Can only be called by the token owner or an approved operator.
     * @param to address to be approved for the given token ID
     * @param tokenId uint256 ID of the token to be approved
     */
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @dev Gets the approved address for a token ID, or zero if no address set
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to query the approval of
     * @return address currently approved for the given token ID
     */
    function getApproved(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf.
     * @param to operator address to set the approval
     * @param approved representing the status of the approval to be set
     */
    function setApprovalForAll(address to, bool approved) public {
        require(to != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][to] = approved;
        emit ApprovalForAll(_msgSender(), to, approved);
    }

    /**
     * @dev Tells whether an operator is approved by a given owner.
     * @param owner owner address which you want to query the approval of
     * @param operator operator address which you want to query the approval of
     * @return bool whether the given operator is approved by the given owner
     */
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address.
     * Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     * Requires the msg.sender to be the owner, approved, or operator.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(address from, address to, uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transferFrom(from, to, tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement {IERC721Receiver-onERC721Received},
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement {IERC721Receiver-onERC721Received},
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the _msgSender() to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransferFrom(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function _safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) internal {
        _transferFrom(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether the specified token exists.
     * @param tokenId uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    /**
     * @dev Returns whether the given spender can transfer a given token ID.
     * @param spender address of the spender to query
     * @param tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     * is an operator of the owner, or is the owner of the token
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    /**
     * @dev Internal function to safely mint a new token.
     * Reverts if the given token ID already exists.
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _safeMint(address to, uint256 tokenId) internal {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Internal function to safely mint a new token.
     * Reverts if the given token ID already exists.
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     * @param _data bytes data to send along with a safe transfer check
     */
    function _safeMint(address to, uint256 tokenId, bytes memory _data) internal {
        _mint(to, tokenId);
        require(_checkOnERC721Received(address(0), to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to].increment();

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * Deprecated, use {_burn} instead.
     * @param owner owner of the token to burn
     * @param tokenId uint256 ID of the token being burned
     */
    function _burn(address owner, uint256 tokenId) internal {
        require(ownerOf(tokenId) == owner, "ERC721: burn of token that is not own");

        _clearApproval(tokenId);

        _ownedTokensCount[owner].decrement();
        _tokenOwner[tokenId] = address(0);

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * @param tokenId uint256 ID of the token being burned
     */
    function _burn(uint256 tokenId) internal {
        _burn(ownerOf(tokenId), tokenId);
    }

    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _clearApproval(tokenId);

        _ownedTokensCount[from].decrement();
        _ownedTokensCount[to].increment();

        _tokenOwner[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * This function is deprecated.
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data)
        internal returns (bool)
    {
        if (!to.isContract()) {
            return true;
        }

        bytes4 retval = IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data);
        return (retval == _ERC721_RECEIVED);
    }

    /**
     * @dev Private function to clear current approval of a given token ID.
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _clearApproval(uint256 tokenId) private {
        if (_tokenApprovals[tokenId] != address(0)) {
            _tokenApprovals[tokenId] = address(0);
        }
    }
}

// File: openzeppelin-solidity/contracts/token/ERC721/IERC721Enumerable.sol

pragma solidity ^0.5.0;


/**
 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
contract IERC721Enumerable is IERC721 {
    function totalSupply() public view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256 tokenId);

    function tokenByIndex(uint256 index) public view returns (uint256);
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol

pragma solidity ^0.5.0;





/**
 * @title ERC-721 Non-Fungible Token with optional enumeration extension logic
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
contract ERC721Enumerable is Context, ERC165, ERC721, IERC721Enumerable {
    // Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) private _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    /*
     *     bytes4(keccak256('totalSupply()')) == 0x18160ddd
     *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) == 0x2f745c59
     *     bytes4(keccak256('tokenByIndex(uint256)')) == 0x4f6ccce7
     *
     *     => 0x18160ddd ^ 0x2f745c59 ^ 0x4f6ccce7 == 0x780e9d63
     */
    bytes4 private constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;

    /**
     * @dev Constructor function.
     */
    constructor () public {
        // register the supported interface to conform to ERC721Enumerable via ERC165
        _registerInterface(_INTERFACE_ID_ERC721_ENUMERABLE);
    }

    /**
     * @dev Gets the token ID at a given index of the tokens list of the requested owner.
     * @param owner address owning the tokens list to be accessed
     * @param index uint256 representing the index to be accessed of the requested tokens list
     * @return uint256 token ID at the given index of the tokens list owned by the requested address
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    /**
     * @dev Gets the total amount of tokens stored by the contract.
     * @return uint256 representing the total amount of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @dev Gets the token ID at a given index of all the tokens in this contract
     * Reverts if the index is greater or equal to the total number of tokens.
     * @param index uint256 representing the index to be accessed of the tokens list
     * @return uint256 token ID at the given index of the tokens list
     */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
        return _allTokens[index];
    }

    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to transferFrom, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(address from, address to, uint256 tokenId) internal {
        super._transferFrom(from, to, tokenId);

        _removeTokenFromOwnerEnumeration(from, tokenId);

        _addTokenToOwnerEnumeration(to, tokenId);
    }

    /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to address the beneficiary that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(address to, uint256 tokenId) internal {
        super._mint(to, tokenId);

        _addTokenToOwnerEnumeration(to, tokenId);

        _addTokenToAllTokensEnumeration(tokenId);
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * Deprecated, use {ERC721-_burn} instead.
     * @param owner owner of the token to burn
     * @param tokenId uint256 ID of the token being burned
     */
    function _burn(address owner, uint256 tokenId) internal {
        super._burn(owner, tokenId);

        _removeTokenFromOwnerEnumeration(owner, tokenId);
        // Since tokenId will be deleted, we can clear its slot in _ownedTokensIndex to trigger a gas refund
        _ownedTokensIndex[tokenId] = 0;

        _removeTokenFromAllTokensEnumeration(tokenId);
    }

    /**
     * @dev Gets the list of token IDs of the requested owner.
     * @param owner address owning the tokens
     * @return uint256[] List of token IDs owned by the requested address
     */
    function _tokensOfOwner(address owner) internal view returns (uint256[] storage) {
        return _ownedTokens[owner];
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _ownedTokens[from].length.sub(1);
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        _ownedTokens[from].length--;

        // Note that _ownedTokensIndex[tokenId] hasn't been cleared: it still points to the old slot (now occupied by
        // lastTokenId, or just over the end of the array if the token was the last one).
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length.sub(1);
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        _allTokens.length--;
        _allTokensIndex[tokenId] = 0;
    }
}

// File: openzeppelin-solidity/contracts/token/ERC721/IERC721Metadata.sol

pragma solidity ^0.5.0;


/**
 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
contract IERC721Metadata is IERC721 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol

pragma solidity ^0.5.0;





contract ERC721Metadata is Context, ERC165, ERC721, IERC721Metadata {
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /*
     *     bytes4(keccak256('name()')) == 0x06fdde03
     *     bytes4(keccak256('symbol()')) == 0x95d89b41
     *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
     *
     *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
     */
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    /**
     * @dev Constructor function
     */
    constructor (string memory name, string memory symbol) public {
        _name = name;
        _symbol = symbol;

        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
    }

    /**
     * @dev Gets the token name.
     * @return string representing the token name
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * @dev Gets the token symbol.
     * @return string representing the token symbol
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns an URI for a given token ID.
     * Throws if the token ID does not exist. May return an empty string.
     * @param tokenId uint256 ID of the token to query
     */
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Internal function to set the token URI for a given token.
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to set its URI
     * @param uri string URI to assign
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = uri;
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * Deprecated, use _burn(uint256) instead.
     * @param owner owner of the token to burn
     * @param tokenId uint256 ID of the token being burned by the msg.sender
     */
    function _burn(address owner, uint256 tokenId) internal {
        super._burn(owner, tokenId);

        // Clear metadata (if any)
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol

pragma solidity ^0.5.0;




/**
 * @title Full ERC721 Token
 * @dev This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology.
 *
 * See https://eips.ethereum.org/EIPS/eip-721
 */
contract ERC721Full is ERC721, ERC721Enumerable, ERC721Metadata {
    constructor (string memory name, string memory symbol) public ERC721Metadata(name, symbol) {
        // solhint-disable-previous-line no-empty-blocks
    }
}

// File: openzeppelin-solidity/contracts/access/roles/MinterRole.sol

pragma solidity ^0.5.0;



contract MinterRole is Context {
    using Roles for Roles.Role;

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    Roles.Role private _minters;

    constructor () internal {
        _addMinter(_msgSender());
    }

    modifier onlyMinter() {
        require(isMinter(_msgSender()), "MinterRole: caller does not have the Minter role");
        _;
    }

    function isMinter(address account) public view returns (bool) {
        return _minters.has(account);
    }

    function addMinter(address account) public onlyMinter {
        _addMinter(account);
    }

    function renounceMinter() public {
        _removeMinter(_msgSender());
    }

    function _addMinter(address account) internal {
        _minters.add(account);
        emit MinterAdded(account);
    }

    function _removeMinter(address account) internal {
        _minters.remove(account);
        emit MinterRemoved(account);
    }
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol

pragma solidity ^0.5.0;




/**
 * @title ERC721MetadataMintable
 * @dev ERC721 minting logic with metadata.
 */
contract ERC721MetadataMintable is ERC721, ERC721Metadata, MinterRole {
    /**
     * @dev Function to mint tokens.
     * @param to The address that will receive the minted tokens.
     * @param tokenId The token id to mint.
     * @param tokenURI The token URI of the minted token.
     * @return A boolean that indicates if the operation was successful.
     */
    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public onlyMinter returns (bool) {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return true;
    }
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol

pragma solidity ^0.5.0;



/**
 * @title ERC721 Burnable Token
 * @dev ERC721 Token that can be irreversibly burned (destroyed).
 */
contract ERC721Burnable is Context, ERC721 {
    /**
     * @dev Burns a specific ERC721 token.
     * @param tokenId uint256 id of the ERC721 token to be burned.
     */
    function burn(uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
    }
}

// File: contracts/Strings.sol

pragma solidity ^0.5.0;

library Strings {
  // via https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol
  function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal pure returns (string memory) {
      bytes memory _ba = bytes(_a);
      bytes memory _bb = bytes(_b);
      bytes memory _bc = bytes(_c);
      bytes memory _bd = bytes(_d);
      bytes memory _be = bytes(_e);
      string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
      bytes memory babcde = bytes(abcde);
      uint k = 0;
      for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
      for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
      for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
      for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
      for (uint i = 0; i < _be.length; i++) babcde[k++] = _be[i];
      return string(babcde);
    }

    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d) internal pure returns (string memory) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string memory _a, string memory _b, string memory _c) internal pure returns (string memory) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string memory _a, string memory _b) internal pure returns (string memory) {
        return strConcat(_a, _b, "", "", "");
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}

// File: contracts/CryptoFaces.sol

pragma solidity 0.5.12;

// allows for multi-address access controls to different functions


// Prevents stuck ether
//import "openzeppelin-solidity/contracts/ownership/HasNoEther.sol";

// For safe maths operations


// Pause purchasing only in case of emergency/migration


// ERC721, ERC721 Enumerable, ERC721 Metadata


// ERC721 MetadataMintable


// ERC721 MetadataMintable


// Utils only




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

contract CryptoFacesMarketPlace {

    using SafeMath for uint256;

    /**************
     * Properties *
     **************/
    CryptoFaces CFContract;

    // For Each tokenStatus
    struct TokenStatus {
        bool isInCurrentOffer;
        bool isInCurrentBundleOffer;
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

    // mapping tokenId to tokenStatus
    mapping(uint256 => TokenStatus) private tokenIdToTokenStatus;

    // Map tokenId with it's recent Price
    mapping(uint256 => uint256) private tokenIdToValueInWei;

    // Map tokenId to Escrow Address
    mapping(uint256 => address) private tokenIdToEscrowAddress;

    // Mapping TokenId to Offer
    mapping(uint256 => Offer) private tokensOfferedForSale;

    // Map first tokenId (tokenIds[0]) in bundleOffer as an identifier to it's BundleOffer to list the resting tokenIds
    mapping(uint256 => BundleOffer) private firstTokenIdToBundleOffer;

    // Map first tokenId bundle offer to it's Bundle Escrow address
    mapping(uint256 => address) private firstTokenIdToBundleEscrowAddress;

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

    // For check if caller is owner or approved to bundle of tokens
    modifier onlyForOwnerOrApprovedToBundleTokens(address _caller, uint256[] memory _tokenIds) {
        for(uint i = 0; i <= _tokenIds.length; i++) {
            require(CFContract.isApprovedOrOwner(_caller, _tokenIds[i]), "CF MarketPlace: Caller is not Owner nor Approved");
        }
        _;
    }

    // For check if token existence
    modifier onlyIfTokenIdExists(uint256 _tokenId) {
        require(CFContract.exists(_tokenId), "CF MarketPlace: Token ID not found, not minted yet");
        _;
    }

    // For check if bundle of token existence
    modifier onlyIfBundleTokenIdsExits(uint256 _tokenIds) {
        for(uint i = 0; i <= _tokenIds.length; i++) {
            require(CFContract.exists(_tokenIds[i]), "CF MarketPlace: Token ID not found, not minted yet");
        }
        _;
    }

    // For check if token is for sale
    modifier onlyIfTokenForSale(uint256 _tokenId) {
        Offer memory offer = tokensOfferedForSale[_tokenId];
        require(offer.isForSale);
        _;
    }

    modifier onlyIfBundleTokensForSale(uint256 _firstTokenId) {
        BundleOffer memory _bundleOffer = firstTokenIdToBundleOffer[_firstTokenId];
        require(_bundleOffer.areForSale);
        _;
    }

    // For check that bundle of tokens is larger than one token
    modifier onlyIfBundleOfTokensLargerThanOne(uint256[] memory _tokenIds) {
        require(_tokenIds.length > 1);
        _;
    }

    // For check that offer is for msg.sender
    modifier isOfferedTo(uint256 _tokenId) {
        Offer tokenOffer = tokensOfferedForSale[_tokenId];
        address buyer = tokenOffer.onlySellTo;
        require(buyer != address(0) && buyer == msg.sender);
        _;
    }

    // For check that Bundle offer is for msg.sender
    modifier isBundleOfferedTo(uint256 _firstTokenId) {
        BundleOffer _bundleOffer = firstTokenIdToBundleOffer[_firstTokenId];
        address buyer = _bundleOffer.onlySellTo;
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
        uint256 indexed valueInWei
    );

    // Emitted on offerBundleOfTokensForSale
    event BundleOffered(
        uint256 indexed firstTokenId,
        uint256 indexed valueInWei,
        address indexed seller
    );

    // Emitted on cancel token offering
    event TokenNoLongerForSale(
        uint256 indexed tokenId
    );

    event BundleNoLongerForSale(
        uint256 indexed firstTokenId
    );

    // Emitted on purchases from within this contract
    event OfferBought(
        uint256 indexed tokenId,
        uint256 indexed offerValueInWei,
        address indexed buyer
    );

    // Emitted on Bundle purchases from within this contract
    event BundleOfferBought(
        uint256 indexed firstTokenId,
        uint256 indexed bundleValueInWei,
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
     * @returns success bool
     */
    function offerTokenForSale(uint256 _tokenId, uint256 _tokenValueInWei) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    condition(_notInAnyActiveOffer(_tokenId)) returns (bool success) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;

        // Create new Escrow for this offer
        Escrow tokenEscrowContract = new Escrow(CFContract, msg.sender, address(0), _tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = address(tokenEscrowContract);

        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, msg.sender, _tokenValueInWei, address(0), address(tokenEscrowContract));

        // Change token status
        tokenIdToTokenStatus[_tokenId] = TokenStatus(true, false);

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei);

        return true;
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
    notInAnyActiveOffer(_tokenId)
    condition(_notInAnyActiveOffer(_tokenId)) {
        // Map tokenId with it's Value
        tokenIdToValueInWei[_tokenId] = _tokenValueInWei;
        Escrow tokenEscrowContract = new Escrow(CFContract, msg.sender, _to, _tokenId, _tokenValueInWei);

        // Map tokenId to it's Escrow contract address
        tokenIdToEscrowAddress[_tokenId] = address(tokenEscrowContract);

        // Map tokenId to it's Offer
        tokensOfferedForSale[_tokenId] = Offer(true, _tokenId, msg.sender, _tokenValueInWei, _to, address(tokenEscrowContract));

        // Change token status
        tokenIdToTokenStatus[_tokenId] = TokenStatus(true, false);

        // Emit TokenOffered event
        emit TokenOffered(_tokenId, _tokenValueInWei);
    }

    /**
     * @dev Public function for offer a bundle of tokens for sale
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _tokenIds Token ID
     * @param _offerValueInWei Value assigned from the owner
     */
    function offerBundleOfTokensForSale(uint256[] memory _tokenIds, uint256 _bundleValueInWei) public
    onlyForOwnerOrApprovedToBundleTokens(_msgSender(), _tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds)
    condition(_tokensNotInAnyActiveOffer(_tokenIds))
    onlyIfBundleOfTokensLargerThanOne(_tokenIds) {

        // Remove any offers on the chosen bundle of tokens
        for(uint i; i <= _tokenIds.length; i++) {
            if(tokensOfferedForSale[_tokenIds[i]].isForSale) {
                tokenNoLongerForSale(_tokenIds[i]);
            }
        }

        // Pickup first tokenId in tokenIds array to be an Identifier
        uint256 firstTokenId = _tokenIds[0];

        // Create new BundleEscrow for this offer
        BundleEscrow bundleTokensEscrowContract = new BundleEscrow(CFContract, msg.sender, address(0), _tokenIds, _bundleValueInWei);

        // Map firstTokenId to it's BundleEscrow contract address
        firstTokenIdToBundleEscrowAddress[firstTokenId] = address(bundleTokensEscrowContract);

        // Map firstTokenId to it's BundleOffer
        firstTokenIdToBundleOffer[firstTokenId] = new BundleOffer(true, _tokenIds, msg.sender, _bundleValueInWei, address(0));

        // Change token status in offer
        for(uint i; i <= _tokenIds.length; i++) {
            tokenIdToTokenStatus[_tokenIds[i]] = TokenStatus(false, true);
        }

        // Emit BundleOffered event
        emit BundleOffered(firstTokenId, _bundleValueInWei, msg.sender);
    }

    /**
     * @dev Public function for offer a bundle of tokens for sale for specific address
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _to address
     * @param _tokenIds uint256[] Token ID
     * @param _offerValueInWei uint256 Value assigned from the owner
     */
    function offerBundleOfTokensForSaleTo(address _to, uint256[] memory _tokenIds, uint256 _bundleValueInWei) public
    onlyForOwnerOrApprovedToBundleTokens(_msgSender(), _tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds)
    condition(_tokensNotInAnyActiveOffer(_tokenIds))
    onlyIfBundleOfTokensLargerThanOne(_tokenIds) {

        // Remove any offers on the chosen bundle of tokens
        for(uint i; i <= _tokenIds.length; i++) {
            if(tokensOfferedForSale[_tokenIds[i]].isForSale) {
                tokenNoLongerForSale(_tokenIds[i]);
            }
        }

        // Pickup first tokenId in tokenIds array to be an Identifier
        uint256 firstTokenId = _tokenIds[0];

        // Create new BundleEscrow for this offer
        BundleEscrow bundleTokensEscrowContract = new BundleEscrow(CFContract, msg.sender, _to, _tokenIds, _bundleValueInWei);

        // Map firstTokenId to it's BundleEscrow contract address
        firstTokenIdToBundleEscrowAddress[firstTokenId] = address(bundleTokensEscrowContract);

        // Map firstTokenId to it's BundleOffer
        firstTokenIdToBundleOffer[firstTokenId] = new BundleOffer(true, _tokenIds, msg.sender, _bundleValueInWei, address(0));

        // Change token status in offer
        for(uint i; i <= _tokenIds.length; i++) {
            tokenIdToTokenStatus[_tokenIds[i]] = TokenStatus(false, true);
        }

        // Emit BundleOffered event
        emit BundleOffered(firstTokenId, _bundleValueInWei, msg.sender);
    }

    // TODO: check if token is in active Escrow
    /**
     * @dev Public function transfer token to another address without any payments as a gift
     * Reverts if the caller is not owner nor approved
     * Reverts if the token not exits before, on other words not minted yet
     * Reverts if the token is already on an active Escrow contract
     * @param _to Receiver Address
     * @param _tokenId Token ID
     * @return bool
     */
    function transferTokenTo(address _to, uint256 _tokenId) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    condition(_notInAnyActiveOffer(_tokenId)) returns (bool) {
        // Check if the token is on offer, cancel the offer
        if(tokensOfferedForSale[_tokenId].isForSale) {
            tokenNoLongerForSale(_tokenId);
        }

        // Transfer Ownership of the token to _to address
        CFContract.transferFromDirectly(msg.sender, _to, _tokenId);

        // TODO: check for the Bid

        return true;
    }

    /**
    * @dev Public function transfer tokens to another address without any payments as a gift
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * Reverts if the token is already on an active Escrow contract
    * @param _to Receiver Address
    * @param _tokenIds Token ID
    * @return bool
    */
    function transferBundleTokensTo(address _to, uint256[] memory _tokenIds) public
    onlyForOwnerOrApprovedToBundleTokens(msg.sender, _tokenIds)
    onlyIfBundleOfTokenIdsExists(_tokenIds)
    condition(_tokensNotInAnyActiveOffer(_tokenIds)) returns (bool) {
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

        // TODO: check for the Bid

        return true;
    }

    /**
    * @dev Public function for purchasing token from existing public offer
    * Reverts if the caller is the owner of the token and offer
    * Reverts if the offer is not a public offer
    * Reverts if msg.value is less than token value in wei
    * @param _tokenId Token ID
    */
    function purchasePublicOffer(uint256 _tokenId) public
    whenNotPaused
    condition(_notOwnerOfToken(_tokenId))
    condition(msg.value >= tokenIdToValueInWei[_tokenId])
    condition(_isInActiveOffer(_tokenId)) payable returns (bool success) {

        // Check if this offer is for special address or not
        Offer tokenOffer = tokensOfferedForSale[_tokenId];
        address isSellTo = tokenOffer.isSellTo;
        require(isSellTo == address(0), 'CF MarketPlace: This offer is not a public offer');

        // Pickup Escrow contract holds tokenId offer
        Escrow escrowAddress = Escrow(tokenIdToEscrowAddress[_tokenId]);

        address _buyer = msg.sender;

        // Send buyer value to escrow contract
        address(uint160(tokenIdToEscrowAddress[_tokenId])).send(msg.value);

        // Execute Purchase function
        escrowAddress.confirmPurchase(_buyer);

        // Emit successful Token Bought event
        emit OfferBought(_tokenId, tokenIdToValueInWei[_tokenId], _buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(tokenIdToValueInWei[_tokenId]);

        // Change token mapping escrow to default
        tokenIdToEscrowAddress[_tokenId] = address(0);

        // Change token mapping offer to default
        tokenNoLongerForSale(_tokenId);

        return true;
    }

    /**
    * @dev Public function for special address to purchase special offer to this address
    * Reverts if the caller is the owner of the token and offer
    * Reverts if the offer is not for this caller
    * Reverts if msg.value is less than token value in wei
    * @param _tokenId Token ID
    */
    function purchaseSpecialOffer(uint256 _tokenId) public
    whenNotPaused
    condition(_notOwnerOfToken(_tokenId))
    isOfferedTo(_tokenId)
    condition(msg.value >= tokenIdToValueInWei[_tokenId])
    condition(_isInActiveOffer(_tokenId)) payable returns (bool success) {

        // Pickup Escrow contract holds tokenId offer
        Escrow escrowAddress = Escrow(tokenIdToEscrowAddress[_tokenId]);

        address _buyer = msg.sender;

        // Send buyer value to escrow contract
        address(uint160(tokenIdToEscrowAddress[_tokenId])).send(msg.value);

        // Execute Purchase function
        escrowAddress.confirmPurchaseTo(_buyer);

        // Emit successful Token Bought event
        emit OfferBought(_tokenId, tokenIdToValueInWei[_tokenId], _buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(tokenIdToValueInWei[_tokenId]);

        // Change token mapping escrow to default
        tokenIdToEscrowAddress[_tokenId] = address(0);

        // Change token mapping offer to default
        tokenNoLongerForSale(_tokenId);

        return true;
    }

    /**
     * @dev Public function for purchasing bundle of tokens from existing public offer
     * Reverts if the caller is the owner of the token and offer
     * Reverts if the offer is not a public offer
     * Reverts if msg.value is less than token value in wei
     * @param _tokenId Token ID
     */
    function purchasePublicBundleOffer(uint256[] _tokenIds) public
    whenNotPaused
    condition(_notOwnerOfBundleTokens(_tokenIds))
    condition(msg.value >= _valueOfBundleOffer(_tokenIds[0]))
    condition(_tokensInAnyActiveBundleOffer(_tokenIds)) payable {
        // Check if the bundleOffer is for special address or not
        uint256 _firstTokenId = _tokenIds[0];
        BundleOffer _bundleOffer = firstTokenIdToBundleOffer[_firstTokenId];
        uint256 _valueInWei = _bundleOffer.valueInWei;
        address _isSellTo = _bundleOffer.isSellTo;
        require(_isSellTo == address(0), "CF MarketPlace: This offer is not a public offer");

        // Pickup Escrow contract holds tokenId offer
        BundleEscrow _bundleEscrow = BundleEscrow(firstTokenIdToBundleEscrowAddress[_firstTokenId]);

        address _buyer = msg.sender;

        // Send buyer value to escrow contract
        address(uint160(firstTokenIdToBundleEscrowAddress[_firstTokenId])).send(msg.value);

        // Execute Purchase function
        _bundleEscrow.confirmPurchase(_buyer);

        // Emit successful Bundle Bought event
        emit BundleOfferBought(_firstTokenId, _valueInWei, _buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(_valueInWei);

        // Change token mapping bundle escrow to default
        firstTokenIdToBundleEscrowAddress[_firstTokenId] = address(0);

        // Change token mapping offer to default
        bundleTokensNoLongerForSale(_tokenIds);
    }

    /**
     * @dev Public function for purchasing bundle of tokens from existing special offer to special address
     * Reverts if the caller is the owner of the token and offer
     * Reverts if the offer is not a public offer
     * Reverts if msg.value is less than token value in wei
     * @param _tokenId Token ID
     */
    function purchaseSpecialBundleOffer(uint256[] _tokenIds) public
    whenNotPaused
    isBundleOfferedTo(_tokenIds[0])
    condition(_notOwnerOfBundleTokens(_tokenIds))
    condition(msg.value >= _valueOfBundleOffer(_tokenIds[0]))
    condition(_tokensInAnyActiveBundleOffer(_tokenIds)) payable {
        // Check if the bundleOffer is for special address or not
        uint256 _firstTokenId = _tokenIds[0];
        BundleOffer _bundleOffer = firstTokenIdToBundleOffer[_firstTokenId];
        uint256 _valueInWei = _bundleOffer.valueInWei;
        address _isSellTo = _bundleOffer.isSellTo;
        require(_isSellTo == address(0), "CF MarketPlace: This offer is not a public offer");

        // Pickup Escrow contract holds tokenId offer
        BundleEscrow _bundleEscrow = BundleEscrow(firstTokenIdToBundleEscrowAddress[_firstTokenId]);

        address _buyer = msg.sender;

        // Send buyer value to escrow contract
        address(uint160(firstTokenIdToBundleEscrowAddress[_firstTokenId])).send(msg.value);

        // Execute Purchase function
        _bundleEscrow.confirmPurchase(_buyer);

        // Emit successful Bundle Bought event
        emit BundleOfferBought(_firstTokenId, _valueInWei, _buyer);

        // Add the purchased value in wei
        totalPurchasedValueInWei.add(_valueInWei);

        // Change token mapping bundle escrow to default
        firstTokenIdToBundleEscrowAddress[_firstTokenId] = address(0);

        // Change token mapping offer to default
        bundleTokensNoLongerForSale(_tokenIds);
    }

    /**
    * @dev Public function for removing any offers on any token
    * Reverts if the caller is not owner nor approved
    * Reverts if the token not exits before, on other words not minted yet
    * @param _tokenId Token ID
    * @returns bool
    */
    function tokenNoLongerForSale(uint256 _tokenId) public
    onlyForOwnerOrApproved(msg.sender, _tokenId)
    onlyIfTokenIdExists(_tokenId)
    onlyIfTokenForSale(_tokenId)
    condition(_isInActiveOffer(_tokenId)) {
        // Deactivate the offer sale
        tokensOfferedForSale[_tokenId] = Offer(false, _tokenId, msg.sender, 0, address(0), address(0));

        // Change token status in offer
        TokenStatus _tokenStatus = tokenIdToTokenStatus[_tokenId];
        _tokenStatus.isInCurrentOffer = false;

        // Pickup Escrow contract from it's address
        Escrow escrowAddress = Escrow(tokenIdToEscrowAddress[_tokenId]);

        address _seller = msg.sender;

        // Execute Abort function
        escrowAddress.abort(_seller);

        // Emit Token no longer for sale event
        emit TokenNoLongerForSale(_tokenId);
    }

    function bundleTokensNoLongerForSale(uint256[] _tokenIds) public
    onlyForOwnerOrApprovedToBundleTokens(msg.sender, _tokenIds)
    onlyIfBundleTokenIdsExits(_tokenIds)
    onlyIfBundleTokensForSale(_tokenIds[0])
    condition(_tokensInAnyActiveBundleOffer(_tokenIds)) {
        uint256[] _emptyList;

        // Deactivate the Bundle offer sale
        uint256 _firstTokenId = _tokenIds[0];
        firstTokenIdToBundleOffer[_firstTokenId] = BundleOffer(false, _emptyList, address(0), 0, address(0));

        // Change token status in offer
        for(uint i; i <= _tokenIds.length; i++) {
            TokenStatus _tokenStatus = tokenIdToTokenStatus[_tokenIds[i]];
            _tokenStatus.isInCurrentBundleOffer = false;
        }

        // Pickup Escrow contract from it's address
        BundleEscrow _bundleEscrow = BundleEscrow(firstTokenIdToBundleEscrowAddress[_firstTokenId]);

        address _seller = msg.sender;

        // Execute Abort function
        _bundleEscrow.abort(_seller);

        // Emit Token no longer for sale event
        emit BundleNoLongerForSale(_firstTokenId);
    }

    /**********************
     * Token Offers Query *
     **********************/
    /**
      * @dev Private Function for check if token is in current offer
      * @return bool
      */
    function _isInActiveOffer(uint256 _tokenId) private returns (bool) {
        TokenStatus _tokenStatus = tokenIdToTokenStatus[_tokenId];
        bool _isInCurrentOffer = _tokenStatus.isInCurrentOffer;
        return _isInCurrentOffer;
    }

    /**
      * @dev Private Function for check if token is in current Bundle offer
      * @return bool
      */
    function _isInActiveBundleOffer(uint256 _tokenId) private returns (bool) {
        TokenStatus _tokenStatus = tokenIdToTokenStatus[_tokenId];
        bool _isInCurrentBundleOffer = _tokenStatus.isInCurrentBundleOffer;
        return _isInCurrentBundleOffer;
    }

    /**
     * @dev Private Function for check if token is in not active in any offer
     */
    function _notInAnyActiveOffer(uint256 _tokenId) private {
        require(
            !(_isInActiveOffer(_tokenId)) &&
            !(_isInActiveBundleOffer(_tokenId))
        );
    }

    /**
     * @dev Private Function for check if tokens are not in any Bundle Offer
     */
    function _tokensNotInAnyActiveOffer(uint256[] _tokenIds) private {
        for(uint i; i<= _tokenIds.length; i++) {
            require(_notInAnyActiveOffer(_tokenIds[i]));
        }
    }

    /**
     * @dev Private Function for check if tokens are in any Bundle Offer
     */
    function _tokensInAnyActiveBundleOffer(uint256[] _tokenIds) private {
        for(uint i; i <= _tokenIds[i]; i++) {
            require(_isInActiveBundleOffer(_tokenIds[i]));
        }
    }

    function _notOwnerOfToken(uint256 _tokenId) private {
        require(CFContract.ownerOf(_tokenId) != msg.sender);
        _;
    }

    function _notOwnerOfBundleTokens(uint256[] _tokenIds) private {
        for(uint i; i <= _tokenIds[i]; i++) {
            require(_notOwnerOfToken(_tokenIds[i]));
        }
    }

    function _valueOfBundleOffer(uint256 _firstTokenId) private returns (uint256) {
        BundleOffer _bundleOffer = firstTokenIdToBundleOffer[_firstTokenId];
        return _bundleOffer.valueInWei;
    }

    /*function enterBidForToken(uint256 _tokenId) public
    onlyIfTokenIdExists(_tokenId) {
        require(msg.value != 0, 'CF: Current address has no sufficient value');
    }*/

    //function tokensExchange(uint);
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
    constructor(CryptoFaces _CFContract, address _seller,address _buyer, uint256 _tokenId, uint256 _tokenValue) public {
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
        uint256 paymentValue = address(this).balance;

        // Add 1% from the payment to CF Owner
        uint256 ownerValue = paymentValue.mul(0.1);

        // Add the rest to token owner (seller)
        uint256 sellerValue = paymentValue.sub(ownerValue);

        // Transfer 1% of payment value to CF Owner
        CFOwner.transfer(ownerValue);

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
        require(buyer != address(0) && buyer == _buyer, 'Escrow: This offer is not for this address');

        // Complete transferring the ownership of the token from the seller to the buyer (new owner)
        CFContract.transferFromDirectly(seller, _buyer, tokenId);

        // Convert buyer address to Payable address
        buyer = address(uint160(_buyer));

        // Payment value stored within the contract, sent from the Market Place
        uint256 paymentValue = address(this).balance;

        // Add 1% from the payment to CF Owner
        uint256 ownerValue = paymentValue.mul(0.1);

        // Add the rest to token owner (seller)
        uint256 sellerValue = paymentValue.sub(ownerValue);

        // Transfer 1% of payment value to CF Owner
        CFOwner.transfer(ownerValue);

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
    constructor(CryptoFaces _CFContract, address _seller, address _buyer, int256[] memory _tokenIds, uint256 _tokensValue) public {
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
        uint256 ownerValue = paymentValue.mul(0.1);

        // Add the rest to token owner (seller)
        uint256 sellerValue = paymentValue.sub(ownerValue);

        // Transfer 1% of payment value to CF Owner
        CFOwner.transfer(ownerValue);

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
        uint256 ownerValue = paymentValue.mul(0.1);

        // Add the rest to token owner (seller)
        uint256 sellerValue = paymentValue.sub(ownerValue);

        // Transfer 1% of payment value to CF Owner
        CFOwner.transfer(ownerValue);

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
