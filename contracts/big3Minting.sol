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
  string private _baseTokenURI;


  constructor() ERC721("Big3NFT", "B3N"){
    maxSupply = 10000;
    _price = 0.01 ether;
    paused = true;
    maxPerWallet = 20;
  }

  function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) public{
      _baseTokenURI = baseURI;
    }
  
  // Mint for dev
  function devMint(address _to, string calldata _tokensBaseURI, uint256 _qty) external onlyOwner{
    require(paused = true, "Minting must be paused");

    setBaseURI(_tokensBaseURI);
    for(uint256 i = 0; i < _qty; i++){
      _tokenIdCounter.increment();
      _safeMint(_to, _tokenIdCounter.current());
    }
    _tokenIdCounter.reset();
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
  function mint(string calldata _tokensBaseURI, uint256 _qty) public payable {
    require(paused = false, "Minting is currently paused");
    require(walletMints[msg.sender] + _qty <= maxPerWallet, "You have exceeded the max mints per wallet");
    require(msg.value >= _qty * _price);

    setBaseURI(_tokensBaseURI);
    for(uint256 i = 0; i < _qty; i++){
      _tokenIdCounter.increment();
      _safeMint(msg.sender, _tokenIdCounter.current());
    }
    _tokenIdCounter.reset();
  }

  function withdraw(address payable _to) public onlyOwner{
    require(address(this).balance > 0, "the contract's balance is empty, zeroooo");
    _to.transfer(address(this).balance);
  }
}
