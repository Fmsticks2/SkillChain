// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IUserRegistry
 * @dev Interface for the UserRegistry contract
 */
interface IUserRegistry {
    /**
     * @dev Enum representing the role of a user
     */
    enum UserRole {
        Client,
        Freelancer,
        Admin
    }

    /**
     * @dev Enum representing the verification status of a user
     */
    enum VerificationStatus {
        Unverified,
        Pending,
        Verified,
        Rejected
    }

    /**
     * @dev Struct representing a user profile
     */
    struct UserProfile {
        address userAddress;
        UserRole role;
        VerificationStatus verificationStatus;
        string metadata; // IPFS hash or other metadata reference
        uint256 reputation;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /**
     * @dev Event emitted when a new user is registered
     */
    event UserRegistered(
        address indexed userAddress,
        UserRole role,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a user's verification status is updated
     */
    event VerificationStatusUpdated(
        address indexed userAddress,
        VerificationStatus status,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a user's reputation is updated
     */
    event ReputationUpdated(
        address indexed userAddress,
        uint256 oldReputation,
        uint256 newReputation,
        uint256 timestamp
    );

    /**
     * @dev Registers a new user
     * @param _role Role of the user
     * @param _metadata IPFS hash or other metadata reference
     */
    function registerUser(UserRole _role, string calldata _metadata) external;

    /**
     * @dev Updates a user's profile
     * @param _metadata IPFS hash or other metadata reference
     */
    function updateProfile(string calldata _metadata) external;

    /**
     * @dev Updates a user's verification status
     * @param _userAddress Address of the user
     * @param _status New verification status
     */
    function updateVerificationStatus(address _userAddress, VerificationStatus _status) external;

    /**
     * @dev Updates a user's reputation
     * @param _userAddress Address of the user
     * @param _reputation New reputation score
     */
    function updateReputation(address _userAddress, uint256 _reputation) external;

    /**
     * @dev Gets a user's profile
     * @param _userAddress Address of the user
     * @return UserProfile struct
     */
    function getUserProfile(address _userAddress) external view returns (UserProfile memory);

    /**
     * @dev Checks if a user is registered
     * @param _userAddress Address of the user
     * @return bool indicating if the user is registered
     */
    function isUserRegistered(address _userAddress) external view returns (bool);

    /**
     * @dev Checks if a user is verified
     * @param _userAddress Address of the user
     * @return bool indicating if the user is verified
     */
    function isUserVerified(address _userAddress) external view returns (bool);

    /**
     * @dev Gets all users with a specific role
     * @param _role Role of the users to get
     * @return Array of user addresses
     */
    function getUsersByRole(UserRole _role) external view returns (address[] memory);
}