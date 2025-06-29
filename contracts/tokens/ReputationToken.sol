// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ReputationToken
 * @dev Non-transferable ERC721 token for reputation on the Web3 Skill Platform
 */
contract ReputationToken is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    // Mapping from token ID to skill ID
    mapping(uint256 => uint256) private _tokenSkills;

    // Mapping from token ID to score (0-100)
    mapping(uint256 => uint256) private _tokenScores;

    // Mapping from user address to their token IDs
    mapping(address => uint256[]) private _userTokens;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Constructor that sets up the token and roles
     * @param admin Address of the admin who will have all roles
     */
    constructor(address admin) ERC721("Skill Reputation", "SREP") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /**
     * @dev Mints a new reputation token
     * @param to Address to mint the token to
     * @param skillId ID of the skill this token represents
     * @param score Score for this skill (0-100)
     * @param uri URI for token metadata
     * @return tokenId The ID of the minted token
     */
    function mint(
        address to,
        uint256 skillId,
        uint256 score,
        string memory uri
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(score <= 100, "ReputationToken: score must be between 0-100");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        
        _tokenSkills[tokenId] = skillId;
        _tokenScores[tokenId] = score;
        _userTokens[to].push(tokenId);
        
        return tokenId;
    }

    /**
     * @dev Updates the score for a token
     * @param tokenId ID of the token
     * @param newScore New score for the token (0-100)
     */
    function updateScore(uint256 tokenId, uint256 newScore) external onlyRole(MINTER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "ReputationToken: token does not exist");
        require(newScore <= 100, "ReputationToken: score must be between 0-100");
        
        _tokenScores[tokenId] = newScore;
    }

    /**
     * @dev Gets the skill ID for a token
     * @param tokenId ID of the token
     * @return uint256 Skill ID
     */
    function getTokenSkill(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "ReputationToken: token does not exist");
        return _tokenSkills[tokenId];
    }

    /**
     * @dev Gets the score for a token
     * @param tokenId ID of the token
     * @return uint256 Score
     */
    function getTokenScore(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "ReputationToken: token does not exist");
        return _tokenScores[tokenId];
    }

    /**
     * @dev Gets all token IDs for a user
     * @param user Address of the user
     * @return uint256[] Array of token IDs
     */
    function getUserTokens(address user) external view returns (uint256[] memory) {
        return _userTokens[user];
    }

    /**
     * @dev Prevents tokens from being transferred
     * @param to Address to transfer to
     * @param tokenId ID of the token
     * @param auth The authorized address for this operation
     * @return from The address that owned the token before the transfer
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Only allow minting, not transfers between addresses
        require(from == address(0) || to == address(0), "ReputationToken: non-transferable");
        return super._update(to, tokenId, auth);
    }

    // The following functions are overrides required by Solidity

    // Custom burn implementation since _burn is not virtual in ERC721
    function burn(uint256 tokenId) public {
        address owner = _ownerOf(tokenId);
        require(owner != address(0), "ReputationToken: token does not exist");
        require(_isAuthorized(owner, _msgSender(), tokenId), "ReputationToken: caller is not owner nor approved");
        
        // Clear token URI mapping before burning
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
        
        // Call the internal _burn function
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ReputationToken: token does not exist");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via string.concat).
        if (bytes(_tokenURI).length > 0) {
            return string.concat(base, _tokenURI);
        }

        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return interfaceId == 0x49064906 || super.supportsInterface(interfaceId);
    }
}