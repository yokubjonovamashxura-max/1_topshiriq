// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MashxuraNFT
 * @dev ERC721 standartidagi NFT yaratish (Mint) kontrakt kodi
 */
contract MashxuraNFT {
    string public name = "Mashxura NFT";
    string public symbol = "MNFT";
    uint256 private _tokenIds;
    address public owner;

    struct NFTMetadata {
        uint256 id;
        string name;
        string description;
        string imageURI;
        address creator;
    }

    mapping(uint256 => NFTMetadata) private _nftDetails;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    event Minted(uint256 indexed tokenId, address indexed creator, string imageURI);

    modifier onlyOwner() {
        require(msg.sender == owner, "Faqat egasi uchun");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Yangi NFT yaratish (Mint)
     */
    function mint(string memory nftName, string memory description, string memory imageURI) public returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _owners[newItemId] = msg.sender;
        _balances[msg.sender] += 1;
        
        _nftDetails[newItemId] = NFTMetadata({
            id: newItemId,
            name: nftName,
            description: description,
            imageURI: imageURI,
            creator: msg.sender
        });

        emit Minted(newItemId, msg.sender, imageURI);
        return newItemId;
    }

    function getNFTDetails(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_owners[tokenId] != address(0), "NFT mavjud emas");
        return _nftDetails[tokenId];
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
}
