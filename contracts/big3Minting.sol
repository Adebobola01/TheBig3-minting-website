// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Big3NFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;
  
  Counters.Counter private _tokenIdCounter;
  uint256 public maxSupply;
  bool public paused;
  uint256 public _price;
  uint256 public maxPerWallet;
  mapping(address => uint256) public walletMints;


  constructor() ERC721("Big3NFT", "B3N"){
    maxSupply = 10000;
    _price = 0.01 ether;
    paused = true;
    maxPerWallet = 20;
  }
  
  // Mint for dev
  function devMint(address _to) external onlyOwner{
    require(paused = true, "Minting must be paused");
    _tokenIdCounter.increment();
    _safeMint(_to, _tokenIdCounter.current());
  }

  // Set Mint Price
  function setPrice(uint newPrice) external onlyOwner{
    _price = newPrice;
  }

  //set pause
  function setPause(bool _pause) external onlyOwner{
    paused = _pause;
  }

  //Mint multiple
  function mint(string memory _tokensBaseURI) public payable {
    require(paused = false, "Minting is currently paused");
    require(walletMints[msg.sender] + 1 <= maxPerWallet, "You have exceeded the max mints per wallet");
    require(msg.value >= _price, "Not enough ethers sent");

     _tokenIdCounter.increment();
    _safeMint(msg.sender, _tokenIdCounter.current());
    _setTokenURI(_tokenIdCounter.current(), _tokensBaseURI);
  }

  function withdraw(address payable _to) public onlyOwner{
    require(address(this).balance > 0, "the contract's balance is empty, zeroooo");
    _to.transfer(address(this).balance);
  }
}
