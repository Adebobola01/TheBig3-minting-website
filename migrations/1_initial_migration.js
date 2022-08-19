const Big3Minting = artifacts.require("Big3NFT");

module.exports = function (deployer) {
    deployer.deploy(Big3Minting);
};
