// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISkillVerification
 * @dev Interface for the SkillVerification contract
 */
interface ISkillVerification {
    /**
     * @dev Enum representing the verification status of a skill
     */
    enum SkillVerificationStatus {
        Unverified,
        Pending,
        Verified,
        Rejected
    }

    /**
     * @dev Struct representing a skill
     */
    struct Skill {
        uint256 id;
        string name;
        string category;
        string metadata; // IPFS hash or other metadata reference
    }

    /**
     * @dev Struct representing a skill attestation
     */
    struct SkillAttestation {
        uint256 id;
        uint256 skillId;
        address owner;
        address[] attesters;
        uint256 score; // 0-100
        SkillVerificationStatus status;
        string evidence; // IPFS hash or other evidence reference
        uint256 createdAt;
        uint256 updatedAt;
    }

    /**
     * @dev Event emitted when a new skill is added
     */
    event SkillAdded(
        uint256 indexed skillId,
        string name,
        string category,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a skill attestation is created
     */
    event SkillAttestationCreated(
        uint256 indexed attestationId,
        uint256 indexed skillId,
        address indexed owner,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a skill attestation is verified
     */
    event SkillAttestationVerified(
        uint256 indexed attestationId,
        address indexed attester,
        uint256 score,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when a skill attestation status is updated
     */
    event SkillAttestationStatusUpdated(
        uint256 indexed attestationId,
        SkillVerificationStatus status,
        uint256 timestamp
    );

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
    ) external returns (uint256 skillId);

    /**
     * @dev Creates a skill attestation
     * @param _skillId ID of the skill
     * @param _evidence IPFS hash or other evidence reference
     * @return attestationId The ID of the created attestation
     */
    function createSkillAttestation(
        uint256 _skillId,
        string calldata _evidence
    ) external returns (uint256 attestationId);

    /**
     * @dev Verifies a skill attestation
     * @param _attestationId ID of the attestation
     * @param _score Score for the attestation (0-100)
     */
    function verifySkillAttestation(uint256 _attestationId, uint256 _score) external;

    /**
     * @dev Updates the status of a skill attestation
     * @param _attestationId ID of the attestation
     * @param _status New status of the attestation
     */
    function updateAttestationStatus(
        uint256 _attestationId,
        SkillVerificationStatus _status
    ) external;

    /**
     * @dev Gets a skill by ID
     * @param _skillId ID of the skill
     * @return Skill struct
     */
    function getSkill(uint256 _skillId) external view returns (Skill memory);

    /**
     * @dev Gets a skill attestation by ID
     * @param _attestationId ID of the attestation
     * @return SkillAttestation struct
     */
    function getSkillAttestation(uint256 _attestationId) external view returns (SkillAttestation memory);

    /**
     * @dev Gets all skill attestations for a user
     * @param _owner Address of the user
     * @return Array of SkillAttestation structs
     */
    function getUserSkillAttestations(address _owner) external view returns (SkillAttestation[] memory);

    /**
     * @dev Gets all skills in a category
     * @param _category Category of the skills
     * @return Array of Skill structs
     */
    function getSkillsByCategory(string calldata _category) external view returns (Skill[] memory);

    /**
     * @dev Checks if a user has a verified skill
     * @param _owner Address of the user
     * @param _skillId ID of the skill
     * @return bool indicating if the user has the verified skill
     */
    function hasVerifiedSkill(address _owner, uint256 _skillId) external view returns (bool);
}