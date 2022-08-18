// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"
import "@openzeppelin/contracts/access/Ownable.sol"
import "@openzeppelin/contracts/utils/Counters.sol"

contract Big3NFT is ERC721, Ownable, ReentrancyGuard {
  using Counters for Counters.counter;
  
  Counters.counter private _tokenIdCounter;
  uint256 public maxSupply;
  bool public paused;
  uint256 public _price;
  uint256 public maxPerWallet;
  mapping(address => uint256) public walletMints;


  constructor() ERC721("Big3NFT", "B3N"){
    maxSupply = 10000;
    _price = 0.01 ether;
    paused = true;
  }
  
  // Mint for dev
  function devMint(address to, uint _qty) external onlyOwner{
    require(paused = true, "Minting must be paused")
    _tokenIdCounter.increment();
    _safeMint(msg.sender, _tokenIdCounter.current())
  }

  // Set Mint Price
  function setPrice(uint newPrice) external onlyOwner{
    _price = newPrice;
  }

  //set pause
  function setPause(bool _pause) external onlyOwner{
    pause = _pause;
  }

  //Mint
  function mint(uint256 _quantity) public payable {
    require()
  }

}
