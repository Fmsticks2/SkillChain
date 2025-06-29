// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SkillToken
 * @dev ERC20 token for the Web3 Skill Platform
 */
contract SkillToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 private _totalMinted;

    /**
     * @dev Constructor that sets up the token and roles
     * @param admin Address of the admin who will have all roles
     */
    constructor(address admin) ERC20("Skill Token", "SKILL") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(BURNER_ROLE, admin);
    }

    /**
     * @dev Mints new tokens
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(_totalMinted + amount <= MAX_SUPPLY, "SkillToken: max supply exceeded");
        _totalMinted += amount;
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from a specific address
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) public override onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    /**
     * @dev Returns the total amount of tokens minted
     * @return uint256 Total minted tokens
     */
    function totalMinted() external view returns (uint256) {
        return _totalMinted;
    }

    /**
     * @dev Returns the remaining tokens that can be minted
     * @return uint256 Remaining mintable tokens
     */
    function remainingMintableSupply() external view returns (uint256) {
        return MAX_SUPPLY - _totalMinted;
    }
}