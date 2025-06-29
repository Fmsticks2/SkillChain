// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ISkillPlatform.sol";
import "../interfaces/IUserRegistry.sol";
import "../interfaces/ISkillVerification.sol";
import "../interfaces/IProjectEscrow.sol";
import "../tokens/SkillToken.sol";
import "../tokens/ReputationToken.sol";

/**
 * @title SkillPlatform
 * @dev Main contract for the Web3 Skill Platform
 */
contract SkillPlatform is ISkillPlatform, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    // Counter for project IDs
    uint256 private _projectIdCounter;

    // Mapping from project ID to project
    mapping(uint256 => Project) private _projects;

    // Mapping from client address to array of project IDs
    mapping(address => uint256[]) private _clientProjects;

    // Mapping from freelancer address to array of project IDs
    mapping(address => uint256[]) private _freelancerProjects;

    // References to other contracts
    IUserRegistry private _userRegistry;
    ISkillVerification private _skillVerification;
    IProjectEscrow private _projectEscrow;
    SkillToken private _skillToken;
    ReputationToken private _reputationToken;

    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeRate;

    /**
     * @dev Constructor that sets up roles and references
     * @param admin Address of the admin
     * @param userRegistry Address of the UserRegistry contract
     * @param skillVerification Address of the SkillVerification contract
     * @param projectEscrow Address of the ProjectEscrow contract
     * @param skillToken Address of the SkillToken contract
     * @param reputationToken Address of the ReputationToken contract
     */
    constructor(
        address admin,
        address userRegistry,
        address skillVerification,
        address projectEscrow,
        address skillToken,
        address reputationToken
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(MODERATOR_ROLE, admin);

        _userRegistry = IUserRegistry(userRegistry);
        _skillVerification = ISkillVerification(skillVerification);
        _projectEscrow = IProjectEscrow(projectEscrow);
        _skillToken = SkillToken(skillToken);
        _reputationToken = ReputationToken(reputationToken);

        platformFeeRate = 250; // 2.5% default fee
    }

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
    ) external payable override nonReentrant returns (uint256 projectId) {
        require(_userRegistry.isUserRegistered(msg.sender), "SkillPlatform: client not registered");
        require(_userRegistry.isUserRegistered(_freelancer), "SkillPlatform: freelancer not registered");
        require(_amount > 0, "SkillPlatform: amount must be greater than 0");
        require(_deadline > block.timestamp, "SkillPlatform: deadline must be in the future");
        require(msg.value == _amount, "SkillPlatform: sent value does not match amount");

        projectId = _projectIdCounter++;

        Project memory project = Project({
            id: projectId,
            client: msg.sender,
            freelancer: _freelancer,
            amount: _amount,
            deadline: _deadline,
            status: ProjectStatus.Created,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            metadata: _metadata
        });

        _projects[projectId] = project;
        _clientProjects[msg.sender].push(projectId);
        _freelancerProjects[_freelancer].push(projectId);

        // Create escrow for the project
        uint256 escrowId = _projectEscrow.createEscrow(projectId, msg.sender, _freelancer, _amount);
        
        // Fund the escrow
        _projectEscrow.fundEscrow{value: _amount}(escrowId);

        emit ProjectCreated(projectId, msg.sender, _freelancer, _amount, _deadline);
        return projectId;
    }

    /**
     * @dev Updates the status of a project
     * @param _projectId ID of the project
     * @param _status New status of the project
     */
    function updateProjectStatus(uint256 _projectId, ProjectStatus _status) external override {
        Project storage project = _projects[_projectId];
        require(project.id == _projectId, "SkillPlatform: project does not exist");
        require(
            msg.sender == project.client || msg.sender == project.freelancer || hasRole(MODERATOR_ROLE, msg.sender),
            "SkillPlatform: not authorized"
        );

        // Validate status transitions
        if (msg.sender == project.client) {
            require(
                (_status == ProjectStatus.Cancelled && project.status == ProjectStatus.Created) ||
                (_status == ProjectStatus.Completed && project.status == ProjectStatus.InProgress) ||
                (_status == ProjectStatus.Disputed),
                "SkillPlatform: invalid status transition for client"
            );
        } else if (msg.sender == project.freelancer) {
            require(
                (_status == ProjectStatus.InProgress && project.status == ProjectStatus.Created) ||
                (_status == ProjectStatus.Disputed),
                "SkillPlatform: invalid status transition for freelancer"
            );
        }

        project.status = _status;
        project.updatedAt = block.timestamp;

        emit ProjectStatusUpdated(_projectId, _status, block.timestamp);

        // Handle escrow based on status
        if (_status == ProjectStatus.Completed) {
            // Get all escrows for the project and release them
            IProjectEscrow.Escrow[] memory escrows = _projectEscrow.getProjectEscrows(_projectId);
            for (uint256 i = 0; i < escrows.length; i++) {
                if (escrows[i].status == IProjectEscrow.EscrowStatus.Funded) {
                    _projectEscrow.releaseEscrow(escrows[i].id);
                }
            }

            // Reward tokens to both parties
            _rewardTokens(project.client, project.freelancer, project.amount);
        } else if (_status == ProjectStatus.Cancelled) {
            // Get all escrows for the project and refund them
            IProjectEscrow.Escrow[] memory escrows = _projectEscrow.getProjectEscrows(_projectId);
            for (uint256 i = 0; i < escrows.length; i++) {
                if (escrows[i].status == IProjectEscrow.EscrowStatus.Funded) {
                    _projectEscrow.refundEscrow(escrows[i].id);
                }
            }
        }
    }

    /**
     * @dev Releases payment for a project
     * @param _projectId ID of the project
     */
    function releasePayment(uint256 _projectId) external override {
        Project storage project = _projects[_projectId];
        require(project.id == _projectId, "SkillPlatform: project does not exist");
        require(
            msg.sender == project.client || hasRole(MODERATOR_ROLE, msg.sender),
            "SkillPlatform: not authorized"
        );
        require(project.status == ProjectStatus.InProgress, "SkillPlatform: project not in progress");

        // Get all escrows for the project and release them
        IProjectEscrow.Escrow[] memory escrows = _projectEscrow.getProjectEscrows(_projectId);
        for (uint256 i = 0; i < escrows.length; i++) {
            if (escrows[i].status == IProjectEscrow.EscrowStatus.Funded) {
                _projectEscrow.releaseEscrow(escrows[i].id);
            }
        }

        project.status = ProjectStatus.Completed;
        project.updatedAt = block.timestamp;

        emit ProjectStatusUpdated(_projectId, ProjectStatus.Completed, block.timestamp);
        emit PaymentReleased(_projectId, project.freelancer, project.amount, block.timestamp);

        // Reward tokens to both parties
        _rewardTokens(project.client, project.freelancer, project.amount);
    }

    /**
     * @dev Creates a dispute for a project
     * @param _projectId ID of the project
     * @param _reason Reason for the dispute
     */
    function createDispute(uint256 _projectId, string calldata _reason) external override {
        Project storage project = _projects[_projectId];
        require(project.id == _projectId, "SkillPlatform: project does not exist");
        require(
            msg.sender == project.client || msg.sender == project.freelancer,
            "SkillPlatform: not authorized"
        );
        require(
            project.status == ProjectStatus.Created || project.status == ProjectStatus.InProgress,
            "SkillPlatform: project cannot be disputed"
        );

        project.status = ProjectStatus.Disputed;
        project.updatedAt = block.timestamp;

        emit ProjectStatusUpdated(_projectId, ProjectStatus.Disputed, block.timestamp);
        emit DisputeCreated(_projectId, msg.sender, _reason, block.timestamp);

        // Get all escrows for the project and mark them as disputed
        IProjectEscrow.Escrow[] memory escrows = _projectEscrow.getProjectEscrows(_projectId);
        for (uint256 i = 0; i < escrows.length; i++) {
            if (escrows[i].status == IProjectEscrow.EscrowStatus.Funded) {
                _projectEscrow.disputeEscrow(escrows[i].id, _reason);
            }
        }
    }

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
    ) external override onlyRole(MODERATOR_ROLE) {
        Project storage project = _projects[_projectId];
        require(project.id == _projectId, "SkillPlatform: project does not exist");
        require(project.status == ProjectStatus.Disputed, "SkillPlatform: project not disputed");
        require(_clientShare + _freelancerShare <= 100, "SkillPlatform: shares must sum to 100 or less");

        // Get all escrows for the project and resolve them
        IProjectEscrow.Escrow[] memory escrows = _projectEscrow.getProjectEscrows(_projectId);
        for (uint256 i = 0; i < escrows.length; i++) {
            if (escrows[i].status == IProjectEscrow.EscrowStatus.Disputed) {
                _projectEscrow.resolveDispute(escrows[i].id, _clientShare, _freelancerShare);
            }
        }

        project.status = ProjectStatus.Completed;
        project.updatedAt = block.timestamp;

        emit ProjectStatusUpdated(_projectId, ProjectStatus.Completed, block.timestamp);

        // Reward tokens based on the resolution
        if (_freelancerShare > 0) {
            uint256 freelancerAmount = (project.amount * _freelancerShare) / 100;
            _rewardTokens(project.client, project.freelancer, freelancerAmount);
        }
    }

    /**
     * @dev Gets a project by ID
     * @param _projectId ID of the project
     * @return Project struct
     */
    function getProject(uint256 _projectId) external view override returns (Project memory) {
        require(_projects[_projectId].id == _projectId, "SkillPlatform: project does not exist");
        return _projects[_projectId];
    }

    /**
     * @dev Gets all projects for a client
     * @param _client Address of the client
     * @return Array of Project structs
     */
    function getClientProjects(address _client) external view override returns (Project[] memory) {
        uint256[] memory projectIds = _clientProjects[_client];
        Project[] memory clientProjects = new Project[](projectIds.length);

        for (uint256 i = 0; i < projectIds.length; i++) {
            clientProjects[i] = _projects[projectIds[i]];
        }

        return clientProjects;
    }

    /**
     * @dev Gets all projects for a freelancer
     * @param _freelancer Address of the freelancer
     * @return Array of Project structs
     */
    function getFreelancerProjects(address _freelancer) external view override returns (Project[] memory) {
        uint256[] memory projectIds = _freelancerProjects[_freelancer];
        Project[] memory freelancerProjects = new Project[](projectIds.length);

        for (uint256 i = 0; i < projectIds.length; i++) {
            freelancerProjects[i] = _projects[projectIds[i]];
        }

        return freelancerProjects;
    }

    /**
     * @dev Sets the platform fee rate
     * @param _feeRate New fee rate in basis points (e.g., 250 = 2.5%)
     */
    function setPlatformFeeRate(uint256 _feeRate) external onlyRole(ADMIN_ROLE) {
        require(_feeRate <= 1000, "SkillPlatform: fee rate cannot exceed 10%");
        platformFeeRate = _feeRate;
    }

    /**
     * @dev Rewards tokens to client and freelancer after successful project completion
     * @param _client Address of the client
     * @param _freelancer Address of the freelancer
     * @param _amount Amount of the project
     */
    function _rewardTokens(address _client, address _freelancer, uint256 _amount) internal {
        // Reward SKILL tokens to both parties
        // Client gets 1% of project value in tokens
        uint256 clientTokens = (_amount * 100) / 10000; // 1% of project value
        // Freelancer gets 2% of project value in tokens
        uint256 freelancerTokens = (_amount * 200) / 10000; // 2% of project value

        _skillToken.mint(_client, clientTokens);
        _skillToken.mint(_freelancer, freelancerTokens);

        // Update reputation for freelancer
        IUserRegistry.UserProfile memory freelancerProfile = _userRegistry.getUserProfile(_freelancer);
        uint256 newReputation = freelancerProfile.reputation + 10; // Increment by 10 points
        _userRegistry.updateReputation(_freelancer, newReputation);

        // Mint reputation token for freelancer if they don't have one for this skill category
        // This is a simplified example - in a real implementation, you would determine the skill category from the project metadata
        string memory tokenURI = string(abi.encodePacked("ipfs://", _projects[_projectIdCounter - 1].metadata));
        _reputationToken.mint(_freelancer, 1, 80, tokenURI); // Skill ID 1, score 80
    }
}