// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IProjectEscrow.sol";

/**
 * @title ProjectEscrow
 * @dev Contract for managing escrow payments for projects on the Web3 Skill Platform
 */
contract ProjectEscrow is IProjectEscrow, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PLATFORM_ROLE = keccak256("PLATFORM_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");

    // Counter for escrow IDs
    uint256 private _escrowIdCounter;

    // Mapping from escrow ID to escrow
    mapping(uint256 => Escrow) private _escrows;

    // Mapping from project ID to array of escrow IDs
    mapping(uint256 => uint256[]) private _projectEscrows;

    // Mapping from client address to array of escrow IDs
    mapping(address => uint256[]) private _clientEscrows;

    // Mapping from freelancer address to array of escrow IDs
    mapping(address => uint256[]) private _freelancerEscrows;

    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeRate;

    // Address where platform fees are sent
    address public feeRecipient;

    /**
     * @dev Constructor that sets up roles and fee configuration
     * @param admin Address of the admin
     */
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ARBITRATOR_ROLE, admin);
        
        platformFeeRate = 250; // 2.5% default fee
        feeRecipient = admin; // Admin receives fees by default
    }

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
    ) external override onlyRole(PLATFORM_ROLE) returns (uint256 escrowId) {
        require(_client != address(0), "ProjectEscrow: invalid client address");
        require(_freelancer != address(0), "ProjectEscrow: invalid freelancer address");
        require(_amount > 0, "ProjectEscrow: amount must be greater than 0");

        escrowId = _escrowIdCounter++;

        Escrow memory escrow = Escrow({
            id: escrowId,
            projectId: _projectId,
            client: _client,
            freelancer: _freelancer,
            amount: _amount,
            status: EscrowStatus.Created,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _escrows[escrowId] = escrow;
        _projectEscrows[_projectId].push(escrowId);
        _clientEscrows[_client].push(escrowId);
        _freelancerEscrows[_freelancer].push(escrowId);

        emit EscrowCreated(escrowId, _projectId, _client, _freelancer, _amount, block.timestamp);
        return escrowId;
    }

    /**
     * @dev Funds an escrow
     * @param _escrowId ID of the escrow
     */
    function fundEscrow(uint256 _escrowId) external payable override nonReentrant {
        Escrow storage escrow = _escrows[_escrowId];
        require(escrow.id == _escrowId, "ProjectEscrow: escrow does not exist");
        require(escrow.status == EscrowStatus.Created, "ProjectEscrow: escrow not in Created status");
        require(msg.sender == escrow.client, "ProjectEscrow: only client can fund escrow");
        require(msg.value == escrow.amount, "ProjectEscrow: incorrect funding amount");

        escrow.status = EscrowStatus.Funded;
        escrow.updatedAt = block.timestamp;

        emit EscrowFunded(_escrowId, msg.value, block.timestamp);
    }

    /**
     * @dev Releases an escrow to the freelancer
     * @param _escrowId ID of the escrow
     */
    function releaseEscrow(uint256 _escrowId) external override nonReentrant {
        Escrow storage escrow = _escrows[_escrowId];
        require(escrow.id == _escrowId, "ProjectEscrow: escrow does not exist");
        require(escrow.status == EscrowStatus.Funded, "ProjectEscrow: escrow not in Funded status");
        require(
            msg.sender == escrow.client || hasRole(PLATFORM_ROLE, msg.sender),
            "ProjectEscrow: only client or platform can release escrow"
        );

        escrow.status = EscrowStatus.Released;
        escrow.updatedAt = block.timestamp;

        // Calculate platform fee
        uint256 fee = (escrow.amount * platformFeeRate) / 10000;
        uint256 freelancerAmount = escrow.amount - fee;

        // Transfer funds
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "ProjectEscrow: fee transfer failed");

        (bool freelancerSuccess, ) = escrow.freelancer.call{value: freelancerAmount}("");
        require(freelancerSuccess, "ProjectEscrow: freelancer transfer failed");

        emit EscrowReleased(_escrowId, escrow.freelancer, freelancerAmount, block.timestamp);
    }

    /**
     * @dev Refunds an escrow to the client
     * @param _escrowId ID of the escrow
     */
    function refundEscrow(uint256 _escrowId) external override nonReentrant {
        Escrow storage escrow = _escrows[_escrowId];
        require(escrow.id == _escrowId, "ProjectEscrow: escrow does not exist");
        require(escrow.status == EscrowStatus.Funded, "ProjectEscrow: escrow not in Funded status");
        require(
            msg.sender == escrow.freelancer || hasRole(PLATFORM_ROLE, msg.sender) || hasRole(ARBITRATOR_ROLE, msg.sender),
            "ProjectEscrow: only freelancer, platform, or arbitrator can refund escrow"
        );

        escrow.status = EscrowStatus.Refunded;
        escrow.updatedAt = block.timestamp;

        // Transfer funds back to client
        (bool success, ) = escrow.client.call{value: escrow.amount}("");
        require(success, "ProjectEscrow: refund transfer failed");

        emit EscrowRefunded(_escrowId, escrow.client, escrow.amount, block.timestamp);
    }

    /**
     * @dev Creates a dispute for an escrow
     * @param _escrowId ID of the escrow
     * @param _reason Reason for the dispute
     */
    function disputeEscrow(uint256 _escrowId, string calldata _reason) external override {
        Escrow storage escrow = _escrows[_escrowId];
        require(escrow.id == _escrowId, "ProjectEscrow: escrow does not exist");
        require(escrow.status == EscrowStatus.Funded, "ProjectEscrow: escrow not in Funded status");
        require(
            msg.sender == escrow.client || msg.sender == escrow.freelancer,
            "ProjectEscrow: only client or freelancer can dispute escrow"
        );

        escrow.status = EscrowStatus.Disputed;
        escrow.updatedAt = block.timestamp;

        emit EscrowDisputed(_escrowId, msg.sender, _reason, block.timestamp);
    }

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
    ) external override onlyRole(ARBITRATOR_ROLE) nonReentrant {
        Escrow storage escrow = _escrows[_escrowId];
        require(escrow.id == _escrowId, "ProjectEscrow: escrow does not exist");
        require(escrow.status == EscrowStatus.Disputed, "ProjectEscrow: escrow not in Disputed status");
        require(_clientShare + _freelancerShare <= 100, "ProjectEscrow: shares must sum to 100 or less");

        escrow.status = EscrowStatus.Released;
        escrow.updatedAt = block.timestamp;

        // Calculate amounts
        uint256 clientAmount = (escrow.amount * _clientShare) / 100;
        uint256 freelancerAmount = (escrow.amount * _freelancerShare) / 100;
        uint256 platformFee = escrow.amount - clientAmount - freelancerAmount;

        // Transfer funds
        if (clientAmount > 0) {
            (bool clientSuccess, ) = escrow.client.call{value: clientAmount}("");
            require(clientSuccess, "ProjectEscrow: client transfer failed");
            emit EscrowRefunded(_escrowId, escrow.client, clientAmount, block.timestamp);
        }

        if (freelancerAmount > 0) {
            (bool freelancerSuccess, ) = escrow.freelancer.call{value: freelancerAmount}("");
            require(freelancerSuccess, "ProjectEscrow: freelancer transfer failed");
            emit EscrowReleased(_escrowId, escrow.freelancer, freelancerAmount, block.timestamp);
        }

        if (platformFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: platformFee}("");
            require(feeSuccess, "ProjectEscrow: fee transfer failed");
        }
    }

    /**
     * @dev Gets an escrow by ID
     * @param _escrowId ID of the escrow
     * @return Escrow struct
     */
    function getEscrow(uint256 _escrowId) external view override returns (Escrow memory) {
        require(_escrows[_escrowId].id == _escrowId, "ProjectEscrow: escrow does not exist");
        return _escrows[_escrowId];
    }

    /**
     * @dev Gets all escrows for a project
     * @param _projectId ID of the project
     * @return Array of Escrow structs
     */
    function getProjectEscrows(uint256 _projectId) external view override returns (Escrow[] memory) {
        uint256[] memory escrowIds = _projectEscrows[_projectId];
        Escrow[] memory projectEscrows = new Escrow[](escrowIds.length);

        for (uint256 i = 0; i < escrowIds.length; i++) {
            projectEscrows[i] = _escrows[escrowIds[i]];
        }

        return projectEscrows;
    }

    /**
     * @dev Gets all escrows for a client
     * @param _client Address of the client
     * @return Array of Escrow structs
     */
    function getClientEscrows(address _client) external view override returns (Escrow[] memory) {
        uint256[] memory escrowIds = _clientEscrows[_client];
        Escrow[] memory clientEscrows = new Escrow[](escrowIds.length);

        for (uint256 i = 0; i < escrowIds.length; i++) {
            clientEscrows[i] = _escrows[escrowIds[i]];
        }

        return clientEscrows;
    }

    /**
     * @dev Gets all escrows for a freelancer
     * @param _freelancer Address of the freelancer
     * @return Array of Escrow structs
     */
    function getFreelancerEscrows(address _freelancer) external view override returns (Escrow[] memory) {
        uint256[] memory escrowIds = _freelancerEscrows[_freelancer];
        Escrow[] memory freelancerEscrows = new Escrow[](escrowIds.length);

        for (uint256 i = 0; i < escrowIds.length; i++) {
            freelancerEscrows[i] = _escrows[escrowIds[i]];
        }

        return freelancerEscrows;
    }

    /**
     * @dev Sets the platform fee rate
     * @param _feeRate New fee rate in basis points (e.g., 250 = 2.5%)
     */
    function setPlatformFeeRate(uint256 _feeRate) external onlyRole(ADMIN_ROLE) {
        require(_feeRate <= 1000, "ProjectEscrow: fee rate cannot exceed 10%");
        platformFeeRate = _feeRate;
    }

    /**
     * @dev Sets the fee recipient address
     * @param _feeRecipient New fee recipient address
     */
    function setFeeRecipient(address _feeRecipient) external onlyRole(ADMIN_ROLE) {
        require(_feeRecipient != address(0), "ProjectEscrow: invalid fee recipient address");
        feeRecipient = _feeRecipient;
    }
}