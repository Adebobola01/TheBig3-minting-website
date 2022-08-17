// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"
import "@openzeppelin/access/Ownable.sol"

contract Big3NFT is ERC721, Ownable {
  constructor() ERC721("Big3NFT", "B3N")
  
}
