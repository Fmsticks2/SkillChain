// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IProjectEscrow.sol";

/**
 * @title CitreaPaymentManager
 * @dev Enhanced payment manager for Citrea network with direct wallet withdrawals
 */
contract CitreaPaymentManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PLATFORM_ROLE = keccak256("PLATFORM_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");

    // Payment status enum
    enum PaymentStatus {
        Pending,
        Completed,
        Failed,
        Refunded,
        Disputed
    }

    // Withdrawal status enum
    enum WithdrawalStatus {
        Pending,
        Processing,
        Completed,
        Failed
    }

    // Payment structure
    struct Payment {
        uint256 id;
        address payer;
        address payee;
        uint256 amount;
        address token; // address(0) for native BTC
        PaymentStatus status;
        uint256 createdAt;
        uint256 completedAt;
        string metadata;
    }

    // Withdrawal structure
    struct Withdrawal {
        uint256 id;
        address user;
        uint256 amount;
        address token;
        WithdrawalStatus status;
        uint256 requestedAt;
        uint256 processedAt;
        string destinationAddress; // Bitcoin address for withdrawals
    }

    // Escrow structure for milestone payments
    struct MilestoneEscrow {
        uint256 id;
        uint256 projectId;
        address client;
        address freelancer;
        uint256 totalAmount;
        uint256 releasedAmount;
        address token;
        uint256[] milestoneAmounts;
        bool[] milestoneCompleted;
        uint256 createdAt;
        bool isActive;
    }

    // Counters
    uint256 private _paymentIdCounter;
    uint256 private _withdrawalIdCounter;
    uint256 private _escrowIdCounter;

    // Mappings
    mapping(uint256 => Payment) public payments;
    mapping(uint256 => Withdrawal) public withdrawals;
    mapping(uint256 => MilestoneEscrow) public milestoneEscrows;
    mapping(address => uint256[]) public userPayments;
    mapping(address => uint256[]) public userWithdrawals;
    mapping(address => uint256[]) public userEscrows;
    mapping(address => mapping(address => uint256)) public userBalances; // user => token => balance

    // Platform configuration
    uint256 public platformFeeRate; // in basis points (e.g., 250 = 2.5%)
    address public feeRecipient;
    uint256 public minimumWithdrawalAmount;
    mapping(address => bool) public supportedTokens;

    // Events
    event PaymentCreated(uint256 indexed paymentId, address indexed payer, address indexed payee, uint256 amount, address token);
    event PaymentCompleted(uint256 indexed paymentId, uint256 completedAt);
    event PaymentRefunded(uint256 indexed paymentId, uint256 refundedAt);
    event WithdrawalRequested(uint256 indexed withdrawalId, address indexed user, uint256 amount, address token, string destinationAddress);
    event WithdrawalProcessed(uint256 indexed withdrawalId, uint256 processedAt);
    event WithdrawalCompleted(uint256 indexed withdrawalId, uint256 completedAt);
    event MilestoneEscrowCreated(uint256 indexed escrowId, uint256 indexed projectId, address indexed client, address freelancer, uint256 totalAmount);
    event MilestoneReleased(uint256 indexed escrowId, uint256 milestoneIndex, uint256 amount);
    event BalanceDeposited(address indexed user, uint256 amount, address token);
    event BalanceWithdrawn(address indexed user, uint256 amount, address token);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ARBITRATOR_ROLE, admin);
        
        platformFeeRate = 250; // 2.5% default fee
        feeRecipient = admin;
        minimumWithdrawalAmount = 0.001 ether; // Minimum withdrawal amount
        
        // Support native BTC by default
        supportedTokens[address(0)] = true;
    }

    /**
     * @dev Create a direct payment between users
     */
    function createPayment(
        address payee,
        uint256 amount,
        address token,
        string calldata metadata
    ) external payable nonReentrant returns (uint256 paymentId) {
        require(payee != address(0), "Invalid payee address");
        require(amount > 0, "Amount must be greater than 0");
        require(supportedTokens[token], "Token not supported");

        paymentId = _paymentIdCounter++;

        if (token == address(0)) {
            // Native BTC payment
            require(msg.value == amount, "Incorrect BTC amount sent");
        } else {
            // ERC20 token payment
            require(msg.value == 0, "No BTC should be sent for token payments");
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        payments[paymentId] = Payment({
            id: paymentId,
            payer: msg.sender,
            payee: payee,
            amount: amount,
            token: token,
            status: PaymentStatus.Pending,
            createdAt: block.timestamp,
            completedAt: 0,
            metadata: metadata
        });

        userPayments[msg.sender].push(paymentId);
        userPayments[payee].push(paymentId);

        emit PaymentCreated(paymentId, msg.sender, payee, amount, token);
        return paymentId;
    }

    /**
     * @dev Complete a payment and transfer funds to payee
     */
    function completePayment(uint256 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.id == paymentId, "Payment does not exist");
        require(payment.status == PaymentStatus.Pending, "Payment not pending");
        require(
            msg.sender == payment.payer || 
            msg.sender == payment.payee || 
            hasRole(ARBITRATOR_ROLE, msg.sender),
            "Not authorized"
        );

        uint256 platformFee = (payment.amount * platformFeeRate) / 10000;
        uint256 payeeAmount = payment.amount - platformFee;

        payment.status = PaymentStatus.Completed;
        payment.completedAt = block.timestamp;

        // Update user balances
        userBalances[payment.payee][payment.token] += payeeAmount;
        userBalances[feeRecipient][payment.token] += platformFee;

        emit PaymentCompleted(paymentId, block.timestamp);
        emit BalanceDeposited(payment.payee, payeeAmount, payment.token);
    }

    /**
     * @dev Request withdrawal to external wallet
     */
    function requestWithdrawal(
        uint256 amount,
        address token,
        string calldata destinationAddress
    ) external nonReentrant returns (uint256 withdrawalId) {
        require(amount >= minimumWithdrawalAmount, "Amount below minimum");
        require(supportedTokens[token], "Token not supported");
        require(userBalances[msg.sender][token] >= amount, "Insufficient balance");
        require(bytes(destinationAddress).length > 0, "Invalid destination address");

        withdrawalId = _withdrawalIdCounter++;

        userBalances[msg.sender][token] -= amount;

        withdrawals[withdrawalId] = Withdrawal({
            id: withdrawalId,
            user: msg.sender,
            amount: amount,
            token: token,
            status: WithdrawalStatus.Pending,
            requestedAt: block.timestamp,
            processedAt: 0,
            destinationAddress: destinationAddress
        });

        userWithdrawals[msg.sender].push(withdrawalId);

        emit WithdrawalRequested(withdrawalId, msg.sender, amount, token, destinationAddress);
        emit BalanceWithdrawn(msg.sender, amount, token);
        return withdrawalId;
    }

    /**
     * @dev Process withdrawal (admin only)
     */
    function processWithdrawal(uint256 withdrawalId) external onlyRole(ADMIN_ROLE) {
        Withdrawal storage withdrawal = withdrawals[withdrawalId];
        require(withdrawal.id == withdrawalId, "Withdrawal does not exist");
        require(withdrawal.status == WithdrawalStatus.Pending, "Withdrawal not pending");

        withdrawal.status = WithdrawalStatus.Processing;
        withdrawal.processedAt = block.timestamp;

        emit WithdrawalProcessed(withdrawalId, block.timestamp);
    }

    /**
     * @dev Complete withdrawal (admin only)
     */
    function completeWithdrawal(uint256 withdrawalId) external onlyRole(ADMIN_ROLE) {
        Withdrawal storage withdrawal = withdrawals[withdrawalId];
        require(withdrawal.id == withdrawalId, "Withdrawal does not exist");
        require(withdrawal.status == WithdrawalStatus.Processing, "Withdrawal not processing");

        withdrawal.status = WithdrawalStatus.Completed;

        emit WithdrawalCompleted(withdrawalId, block.timestamp);
    }

    /**
     * @dev Create milestone-based escrow
     */
    function createMilestoneEscrow(
        uint256 projectId,
        address freelancer,
        uint256[] calldata milestoneAmounts,
        address token
    ) external payable nonReentrant returns (uint256 escrowId) {
        require(freelancer != address(0), "Invalid freelancer address");
        require(milestoneAmounts.length > 0, "No milestones provided");
        require(supportedTokens[token], "Token not supported");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            require(milestoneAmounts[i] > 0, "Invalid milestone amount");
            totalAmount += milestoneAmounts[i];
        }

        if (token == address(0)) {
            require(msg.value == totalAmount, "Incorrect BTC amount sent");
        } else {
            require(msg.value == 0, "No BTC should be sent for token payments");
            IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);
        }

        escrowId = _escrowIdCounter++;

        bool[] memory milestoneCompleted = new bool[](milestoneAmounts.length);

        milestoneEscrows[escrowId] = MilestoneEscrow({
            id: escrowId,
            projectId: projectId,
            client: msg.sender,
            freelancer: freelancer,
            totalAmount: totalAmount,
            releasedAmount: 0,
            token: token,
            milestoneAmounts: milestoneAmounts,
            milestoneCompleted: milestoneCompleted,
            createdAt: block.timestamp,
            isActive: true
        });

        userEscrows[msg.sender].push(escrowId);
        userEscrows[freelancer].push(escrowId);

        emit MilestoneEscrowCreated(escrowId, projectId, msg.sender, freelancer, totalAmount);
        return escrowId;
    }

    /**
     * @dev Release milestone payment
     */
    function releaseMilestone(uint256 escrowId, uint256 milestoneIndex) external nonReentrant {
        MilestoneEscrow storage escrow = milestoneEscrows[escrowId];
        require(escrow.id == escrowId, "Escrow does not exist");
        require(escrow.isActive, "Escrow not active");
        require(
            msg.sender == escrow.client || hasRole(ARBITRATOR_ROLE, msg.sender),
            "Not authorized"
        );
        require(milestoneIndex < escrow.milestoneAmounts.length, "Invalid milestone index");
        require(!escrow.milestoneCompleted[milestoneIndex], "Milestone already completed");

        uint256 milestoneAmount = escrow.milestoneAmounts[milestoneIndex];
        uint256 platformFee = (milestoneAmount * platformFeeRate) / 10000;
        uint256 freelancerAmount = milestoneAmount - platformFee;

        escrow.milestoneCompleted[milestoneIndex] = true;
        escrow.releasedAmount += milestoneAmount;

        // Update balances
        userBalances[escrow.freelancer][escrow.token] += freelancerAmount;
        userBalances[feeRecipient][escrow.token] += platformFee;

        emit MilestoneReleased(escrowId, milestoneIndex, milestoneAmount);
        emit BalanceDeposited(escrow.freelancer, freelancerAmount, escrow.token);
    }

    /**
     * @dev Get user balance for a specific token
     */
    function getUserBalance(address user, address token) external view returns (uint256) {
        return userBalances[user][token];
    }

    /**
     * @dev Get user payments
     */
    function getUserPayments(address user) external view returns (uint256[] memory) {
        return userPayments[user];
    }

    /**
     * @dev Get user withdrawals
     */
    function getUserWithdrawals(address user) external view returns (uint256[] memory) {
        return userWithdrawals[user];
    }

    /**
     * @dev Get user escrows
     */
    function getUserEscrows(address user) external view returns (uint256[] memory) {
        return userEscrows[user];
    }

    /**
     * @dev Add supported token (admin only)
     */
    function addSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        supportedTokens[token] = true;
    }

    /**
     * @dev Remove supported token (admin only)
     */
    function removeSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        supportedTokens[token] = false;
    }

    /**
     * @dev Update platform fee rate (admin only)
     */
    function updatePlatformFeeRate(uint256 newFeeRate) external onlyRole(ADMIN_ROLE) {
        require(newFeeRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = newFeeRate;
    }

    /**
     * @dev Update minimum withdrawal amount (admin only)
     */
    function updateMinimumWithdrawalAmount(uint256 newAmount) external onlyRole(ADMIN_ROLE) {
        minimumWithdrawalAmount = newAmount;
    }

    /**
     * @dev Emergency withdrawal (admin only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyRole(ADMIN_ROLE) {
        if (token == address(0)) {
            payable(msg.sender).transfer(amount);
        } else {
            IERC20(token).safeTransfer(msg.sender, amount);
        }
    }
}