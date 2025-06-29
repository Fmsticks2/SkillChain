// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IUserRegistry.sol";

/**
 * @title UserRegistry
 * @dev Contract for managing user profiles on the Web3 Skill Platform
 */
contract UserRegistry is IUserRegistry, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PLATFORM_ROLE = keccak256("PLATFORM_ROLE");

    // Mapping from user address to user profile
    mapping(address => UserProfile) private _userProfiles;

    // Mapping from role to array of user addresses
    mapping(UserRole => address[]) private _usersByRole;

    // Array of all registered users
    address[] private _allUsers;

    /**
     * @dev Constructor that sets up roles
     * @param admin Address of the admin
     */
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
    }

    /**
     * @dev Registers a new user
     * @param _role Role of the user
     * @param _metadata IPFS hash or other metadata reference
     */
    function registerUser(UserRole _role, string calldata _metadata) external override {
        require(!isUserRegistered(msg.sender), "UserRegistry: user already registered");

        UserProfile memory profile = UserProfile({
            userAddress: msg.sender,
            role: _role,
            verificationStatus: VerificationStatus.Unverified,
            metadata: _metadata,
            reputation: 0,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _userProfiles[msg.sender] = profile;
        _usersByRole[_role].push(msg.sender);
        _allUsers.push(msg.sender);

        emit UserRegistered(msg.sender, _role, block.timestamp);
    }

    /**
     * @dev Updates a user's profile
     * @param _metadata IPFS hash or other metadata reference
     */
    function updateProfile(string calldata _metadata) external override {
        require(isUserRegistered(msg.sender), "UserRegistry: user not registered");

        UserProfile storage profile = _userProfiles[msg.sender];
        profile.metadata = _metadata;
        profile.updatedAt = block.timestamp;
    }

    /**
     * @dev Updates a user's verification status
     * @param _userAddress Address of the user
     * @param _status New verification status
     */
    function updateVerificationStatus(address _userAddress, VerificationStatus _status) external override onlyRole(VERIFIER_ROLE) {
        require(isUserRegistered(_userAddress), "UserRegistry: user not registered");

        UserProfile storage profile = _userProfiles[_userAddress];
        profile.verificationStatus = _status;
        profile.updatedAt = block.timestamp;

        emit VerificationStatusUpdated(_userAddress, _status, block.timestamp);
    }

    /**
     * @dev Updates a user's reputation
     * @param _userAddress Address of the user
     * @param _reputation New reputation score
     */
    function updateReputation(address _userAddress, uint256 _reputation) external override onlyRole(PLATFORM_ROLE) {
        require(isUserRegistered(_userAddress), "UserRegistry: user not registered");

        UserProfile storage profile = _userProfiles[_userAddress];
        uint256 oldReputation = profile.reputation;
        profile.reputation = _reputation;
        profile.updatedAt = block.timestamp;

        emit ReputationUpdated(_userAddress, oldReputation, _reputation, block.timestamp);
    }

    /**
     * @dev Gets a user's profile
     * @param _userAddress Address of the user
     * @return UserProfile struct
     */
    function getUserProfile(address _userAddress) external view override returns (UserProfile memory) {
        require(isUserRegistered(_userAddress), "UserRegistry: user not registered");
        return _userProfiles[_userAddress];
    }

    /**
     * @dev Checks if a user is registered
     * @param _userAddress Address of the user
     * @return bool indicating if the user is registered
     */
    function isUserRegistered(address _userAddress) public view override returns (bool) {
        return _userProfiles[_userAddress].userAddress != address(0);
    }

    /**
     * @dev Checks if a user is verified
     * @param _userAddress Address of the user
     * @return bool indicating if the user is verified
     */
    function isUserVerified(address _userAddress) external view override returns (bool) {
        require(isUserRegistered(_userAddress), "UserRegistry: user not registered");
        return _userProfiles[_userAddress].verificationStatus == VerificationStatus.Verified;
    }

    /**
     * @dev Gets all users with a specific role
     * @param _role Role of the users to get
     * @return Array of user addresses
     */
    function getUsersByRole(UserRole _role) external view override returns (address[] memory) {
        return _usersByRole[_role];
    }

    /**
     * @dev Gets all registered users
     * @return Array of user addresses
     */
    function getAllUsers() external view returns (address[] memory) {
        return _allUsers;
    }

    /**
     * @dev Gets the total number of registered users
     * @return uint256 Total number of users
     */
    function getTotalUsers() external view returns (uint256) {
        return _allUsers.length;
    }
}