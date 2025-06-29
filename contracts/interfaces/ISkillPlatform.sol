// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISkillPlatform
 * @dev Interface for the main SkillPlatform contract
 */
interface ISkillPlatform {
    /**
     * @dev Enum representing the status of a project
     */
    enum ProjectStatus {
        Created,
        InProgress,
        Completed,
        Cancelled,
        Disputed
    }

    /**
     * @dev Struct representing a project
     */
    struct Project {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        uint256 deadline;
        ProjectStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        string metadata; // IPFS hash or other metadata reference
    }

    /**
     * @dev Event emitted when a new project is created
     */
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed client,
        address indexed freelancer,
        uint256 amount,
        uint256 deadline
    );

    /**
     * @dev Event emitted when a project status is updated
     */
    event ProjectStatusUpdated(
        uint256 indexed projectId,
        ProjectStatus status,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a payment is released
     */
    event PaymentReleased(
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a dispute is created
     */
    event DisputeCreated(
        uint256 indexed projectId,
        address indexed initiator,
        string reason,
        uint256 timestamp
    );

    /**
     * @dev Creates a new project
     * @param _freelancer Address of the freelancer
     * @param _amount Amount to be paid for the project
     * @param _deadline Deadline for the project completion
     * @param _metadata IPFS hash or other metadata reference
     * @return projectId The ID of the created project
     */
    function createProject(
        address _freelancer,
        uint256 _amount,
        uint256 _deadline,
        string calldata _metadata
    ) external payable returns (uint256 projectId);

    /**
     * @dev Updates the status of a project
     * @param _projectId ID of the project
     * @param _status New status of the project
     */
    function updateProjectStatus(uint256 _projectId, ProjectStatus _status) external;

    /**
     * @dev Releases payment for a project
     * @param _projectId ID of the project
     */
    function releasePayment(uint256 _projectId) external;

    /**
     * @dev Creates a dispute for a project
     * @param _projectId ID of the project
     * @param _reason Reason for the dispute
     */
    function createDispute(uint256 _projectId, string calldata _reason) external;

    /**
     * @dev Resolves a dispute for a project
     * @param _projectId ID of the project
     * @param _clientShare Percentage of the payment to be released to the client (0-100)
     * @param _freelancerShare Percentage of the payment to be released to the freelancer (0-100)
     */
    function resolveDispute(
        uint256 _projectId,
        uint8 _clientShare,
        uint8 _freelancerShare
    ) external;

    /**
     * @dev Gets a project by ID
     * @param _projectId ID of the project
     * @return Project struct
     */
    function getProject(uint256 _projectId) external view returns (Project memory);

    /**
     * @dev Gets all projects for a client
     * @param _client Address of the client
     * @return Array of Project structs
     */
    function getClientProjects(address _client) external view returns (Project[] memory);

    /**
     * @dev Gets all projects for a freelancer
     * @param _freelancer Address of the freelancer
     * @return Array of Project structs
     */
    function getFreelancerProjects(address _freelancer) external view returns (Project[] memory);
}