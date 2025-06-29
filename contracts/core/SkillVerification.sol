// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/ISkillVerification.sol";
import "../interfaces/IUserRegistry.sol";

/**
 * @title SkillVerification
 * @dev Contract for verifying skills on the Web3 Skill Platform
 */
contract SkillVerification is ISkillVerification, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PLATFORM_ROLE = keccak256("PLATFORM_ROLE");

    // Counter for skill IDs
    uint256 private _skillIdCounter;

    // Counter for attestation IDs
    uint256 private _attestationIdCounter;

    // Mapping from skill ID to skill
    mapping(uint256 => Skill) private _skills;

    // Mapping from attestation ID to attestation
    mapping(uint256 => SkillAttestation) private _attestations;

    // Mapping from user address to array of attestation IDs
    mapping(address => uint256[]) private _userAttestations;

    // Mapping from skill ID to array of attestation IDs
    mapping(uint256 => uint256[]) private _skillAttestations;

    // Mapping from category to array of skill IDs
    mapping(string => uint256[]) private _categorySkills;

    // Reference to the UserRegistry contract
    IUserRegistry private _userRegistry;

    /**
     * @dev Constructor that sets up roles and references
     * @param admin Address of the admin
     * @param userRegistry Address of the UserRegistry contract
     */
    constructor(address admin, address userRegistry) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
        _userRegistry = IUserRegistry(userRegistry);
    }

    /**
     * @dev Adds a new skill
     * @param _name Name of the skill
     * @param _category Category of the skill
     * @param _metadata IPFS hash or other metadata reference
     * @return skillId The ID of the added skill
     */
    function addSkill(
        string calldata _name,
        string calldata _category,
        string calldata _metadata
    ) external override onlyRole(ADMIN_ROLE) returns (uint256 skillId) {
        skillId = _skillIdCounter++;

        Skill memory skill = Skill({
            id: skillId,
            name: _name,
            category: _category,
            metadata: _metadata
        });

        _skills[skillId] = skill;
        _categorySkills[_category].push(skillId);

        emit SkillAdded(skillId, _name, _category, block.timestamp);
        return skillId;
    }

    /**
     * @dev Creates a skill attestation
     * @param _skillId ID of the skill
     * @param _evidence IPFS hash or other evidence reference
     * @return attestationId The ID of the created attestation
     */
    function createSkillAttestation(
        uint256 _skillId,
        string calldata _evidence
    ) external override returns (uint256 attestationId) {
        require(_userRegistry.isUserRegistered(msg.sender), "SkillVerification: user not registered");
        require(_skills[_skillId].id == _skillId, "SkillVerification: skill does not exist");

        attestationId = _attestationIdCounter++;

        address[] memory attesters = new address[](0);

        SkillAttestation memory attestation = SkillAttestation({
            id: attestationId,
            skillId: _skillId,
            owner: msg.sender,
            attesters: attesters,
            score: 0,
            status: SkillVerificationStatus.Pending,
            evidence: _evidence,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _attestations[attestationId] = attestation;
        _userAttestations[msg.sender].push(attestationId);
        _skillAttestations[_skillId].push(attestationId);

        emit SkillAttestationCreated(attestationId, _skillId, msg.sender, block.timestamp);
        return attestationId;
    }

    /**
     * @dev Verifies a skill attestation
     * @param _attestationId ID of the attestation
     * @param _score Score for the attestation (0-100)
     */
    function verifySkillAttestation(uint256 _attestationId, uint256 _score) external override onlyRole(VERIFIER_ROLE) {
        require(_attestations[_attestationId].id == _attestationId, "SkillVerification: attestation does not exist");
        require(_score <= 100, "SkillVerification: score must be between 0-100");

        SkillAttestation storage attestation = _attestations[_attestationId];
        
        // Add the verifier to the attesters array if not already present
        bool verifierExists = false;
        for (uint256 i = 0; i < attestation.attesters.length; i++) {
            if (attestation.attesters[i] == msg.sender) {
                verifierExists = true;
                break;
            }
        }
        
        if (!verifierExists) {
            attestation.attesters.push(msg.sender);
        }
        
        attestation.score = _score;
        attestation.status = SkillVerificationStatus.Verified;
        attestation.updatedAt = block.timestamp;

        emit SkillAttestationVerified(_attestationId, msg.sender, _score, block.timestamp);
    }

    /**
     * @dev Updates the status of a skill attestation
     * @param _attestationId ID of the attestation
     * @param _status New status of the attestation
     */
    function updateAttestationStatus(
        uint256 _attestationId,
        SkillVerificationStatus _status
    ) external override onlyRole(VERIFIER_ROLE) {
        require(_attestations[_attestationId].id == _attestationId, "SkillVerification: attestation does not exist");

        SkillAttestation storage attestation = _attestations[_attestationId];
        attestation.status = _status;
        attestation.updatedAt = block.timestamp;

        emit SkillAttestationStatusUpdated(_attestationId, _status, block.timestamp);
    }

    /**
     * @dev Gets a skill by ID
     * @param _skillId ID of the skill
     * @return Skill struct
     */
    function getSkill(uint256 _skillId) external view override returns (Skill memory) {
        require(_skills[_skillId].id == _skillId, "SkillVerification: skill does not exist");
        return _skills[_skillId];
    }

    /**
     * @dev Gets a skill attestation by ID
     * @param _attestationId ID of the attestation
     * @return SkillAttestation struct
     */
    function getSkillAttestation(uint256 _attestationId) external view override returns (SkillAttestation memory) {
        require(_attestations[_attestationId].id == _attestationId, "SkillVerification: attestation does not exist");
        return _attestations[_attestationId];
    }

    /**
     * @dev Gets all skill attestations for a user
     * @param _owner Address of the user
     * @return Array of SkillAttestation structs
     */
    function getUserSkillAttestations(address _owner) external view override returns (SkillAttestation[] memory) {
        uint256[] memory attestationIds = _userAttestations[_owner];
        SkillAttestation[] memory userAttestations = new SkillAttestation[](attestationIds.length);

        for (uint256 i = 0; i < attestationIds.length; i++) {
            userAttestations[i] = _attestations[attestationIds[i]];
        }

        return userAttestations;
    }

    /**
     * @dev Gets all skills in a category
     * @param _category Category of the skills
     * @return Array of Skill structs
     */
    function getSkillsByCategory(string calldata _category) external view override returns (Skill[] memory) {
        uint256[] memory skillIds = _categorySkills[_category];
        Skill[] memory categorySkills = new Skill[](skillIds.length);

        for (uint256 i = 0; i < skillIds.length; i++) {
            categorySkills[i] = _skills[skillIds[i]];
        }

        return categorySkills;
    }

    /**
     * @dev Checks if a user has a verified skill
     * @param _owner Address of the user
     * @param _skillId ID of the skill
     * @return bool indicating if the user has the verified skill
     */
    function hasVerifiedSkill(address _owner, uint256 _skillId) external view override returns (bool) {
        uint256[] memory attestationIds = _userAttestations[_owner];

        for (uint256 i = 0; i < attestationIds.length; i++) {
            SkillAttestation memory attestation = _attestations[attestationIds[i]];
            if (attestation.skillId == _skillId && attestation.status == SkillVerificationStatus.Verified) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Gets all attestations for a skill
     * @param _skillId ID of the skill
     * @return Array of SkillAttestation structs
     */
    function getSkillAttestations(uint256 _skillId) external view returns (SkillAttestation[] memory) {
        require(_skills[_skillId].id == _skillId, "SkillVerification: skill does not exist");

        uint256[] memory attestationIds = _skillAttestations[_skillId];
        SkillAttestation[] memory skillAttestations = new SkillAttestation[](attestationIds.length);

        for (uint256 i = 0; i < attestationIds.length; i++) {
            skillAttestations[i] = _attestations[attestationIds[i]];
        }

        return skillAttestations;
    }
}