// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IProjectEscrow
 * @dev Interface for the ProjectEscrow contract
 */
interface IProjectEscrow {
    /**
     * @dev Enum representing the status of an escrow
     */
    enum EscrowStatus {
        Created,
        Funded,
        Released,
        Refunded,
        Disputed
    }

    /**
     * @dev Struct representing an escrow
     */
    struct Escrow {
        uint256 id;
        uint256 projectId;
        address client;
        address freelancer;
        uint256 amount;
        EscrowStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /**
     * @dev Event emitted when a new escrow is created
     */
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed projectId,
        address indexed client,
        address freelancer,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when an escrow is funded
     */
    event EscrowFunded(
        uint256 indexed escrowId,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when an escrow is released
     */
    event EscrowReleased(
        uint256 indexed escrowId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when an escrow is refunded
     */
    event EscrowRefunded(
        uint256 indexed escrowId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when an escrow is disputed
     */
    event EscrowDisputed(
        uint256 indexed escrowId,
        address indexed initiator,
        string reason,
        uint256 timestamp
    );

    /**
     * @dev Creates a new escrow
     * @param _projectId ID of the project
     * @param _client Address of the client
     * @param _freelancer Address of the freelancer
     * @param _amount Amount to be escrowed
     * @return escrowId The ID of the created escrow
     */
    function createEscrow(
        uint256 _projectId,
        address _client,
        address _freelancer,
        uint256 _amount
    ) external returns (uint256 escrowId);

    /**
     * @dev Funds an escrow
     * @param _escrowId ID of the escrow
     */
    function fundEscrow(uint256 _escrowId) external payable;

    /**
     * @dev Releases an escrow to the freelancer
     * @param _escrowId ID of the escrow
     */
    function releaseEscrow(uint256 _escrowId) external;

    /**
     * @dev Refunds an escrow to the client
     * @param _escrowId ID of the escrow
     */
    function refundEscrow(uint256 _escrowId) external;

    /**
     * @dev Creates a dispute for an escrow
     * @param _escrowId ID of the escrow
     * @param _reason Reason for the dispute
     */
    function disputeEscrow(uint256 _escrowId, string calldata _reason) external;

    /**
     * @dev Resolves a dispute for an escrow
     * @param _escrowId ID of the escrow
     * @param _clientShare Percentage of the payment to be released to the client (0-100)
     * @param _freelancerShare Percentage of the payment to be released to the freelancer (0-100)
     */
    function resolveDispute(
        uint256 _escrowId,
        uint8 _clientShare,
        uint8 _freelancerShare
    ) external;

    /**
     * @dev Gets an escrow by ID
     * @param _escrowId ID of the escrow
     * @return Escrow struct
     */
    function getEscrow(uint256 _escrowId) external view returns (Escrow memory);

    /**
     * @dev Gets all escrows for a project
     * @param _projectId ID of the project
     * @return Array of Escrow structs
     */
    function getProjectEscrows(uint256 _projectId) external view returns (Escrow[] memory);

    /**
     * @dev Gets all escrows for a client
     * @param _client Address of the client
     * @return Array of Escrow structs
     */
    function getClientEscrows(address _client) external view returns (Escrow[] memory);

    /**
     * @dev Gets all escrows for a freelancer
     * @param _freelancer Address of the freelancer
     * @return Array of Escrow structs
     */
    function getFreelancerEscrows(address _freelancer) external view returns (Escrow[] memory);
}