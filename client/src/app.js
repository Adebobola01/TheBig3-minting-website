"use strict";

import Big3NFT from "./contracts/Big3NFT.json" assert { type: "json" };

const backdrop = document.querySelector(".backdrop");
const connectBtn = document.querySelector(".connect--button");
const walletsContainer = document.querySelector(".wallet__container");
const MMwallet = document.querySelector(".metamask__btn");
const WCwallet = document.querySelector(".walletConnect__btn");
const connectBtnContainer = document.querySelector(".connect__btn--container");
const mainBody = document.querySelector(".main");
const mintForm = document.querySelector(".mint-form");
const baseURI = document.querySelector(".baseURI-input");
const addBtn = document.querySelector("#add-btn");
const subBtn = document.querySelector("#sub-btn");
const nftQty = document.querySelector(".nft-qty");
const mintNFT = document.querySelector(".form__btn");
const setPause = document.querySelector(".setPause");
const setPauseInput = document.querySelector(".setPause-input");
const getPause = document.querySelector(".getPause");
const devMint = document.querySelector(".devMint");
const devMintAddr = document.querySelector(".devMint-address");
const devMintURI = document.querySelector(".devMint-baseURI");
const devMintQty = document.querySelector(".devMint-qty");
const setPrice = document.querySelector(".setPrice");
const setPriceInput = document.querySelector(".setPrice-input");
const ownerContainer = document.querySelector(".owner__container");

const state = {};

let web3 = new Web3(Web3.givenProvider);
const message = "You are about to sign into the big3Minting website";

///////////////////////////////
///////////////////////////
//display Wallets

const connectWallet = () => {
    backdrop.classList.toggle("hidden");
    walletsContainer.classList.toggle("hidden");
};

const displayAddr = () => {
    const addr = `${state.userAccount.slice(0, 3)}...${state.userAccount.slice(
        -4
    )}`;
    connectBtnContainer.innerHTML = addr;
};

//////////////////////////////////////////
/////////////////////////////////////////////
//VERIFY USER

const signMessage = async () => {
    state.signature = await web3.eth.personal.sign(message, state.userAccount);
    console.log(state.signature);
};

const confirmSignature = async () => {
    const recoveredAddr = await web3.eth.personal.ecRecover(
        message,
        state.signature
    );
    if (
        recoveredAddr === state.userAccount &&
        state.userAccount === "0x3427bfe887eec6e1c1e0f2b485800b5a9a7c633f"
    ) {
        ownerContainer.classList.remove("hidden");
    }
};

/////////////////////////////////////
/////////////////////////////
//GET CONTRACT

const getContract = async () => {
    try {
        let web3 = new Web3(Web3.givenProvider);
        state.networkId = await web3.eth.net.getId();
        state.contractAddress = Big3NFT.networks[state.networkId].address;
        state.big3NFTInstance = await new web3.eth.Contract(
            Big3NFT.abi,
            Big3NFT.networks[state.networkId] &&
                Big3NFT.networks[state.networkId].address
        );
        console.log(state.networkId);
    } catch (error) {
        console.error(error);
    }
};

//////////////////////////////////////////////
/////////////////////////////////////////
//WALLETS

const getMMAccounts = async () => {
    try {
        state.accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        state.userAccount = state.accounts[0];
        console.log(state.userAccount);
    } catch (error) {
        console.error(error);
    }
};

const connectHandler = async () => {
    await signMessage();
    console.log("messaage signed");
    connectWallet();
    displayAddr();
    confirmSignature();
    await getContract();
};

const init = async () => {
    nftQty.value = 0;
};

init();

////////////////////////////////
///////////////////////////////
//OWNER FUNCTIONS

getPause.addEventListener("click", async () => {
    try {
        const PauseTx = await state.big3NFTInstance.methods.paused().call();
        console.log(PauseTx);
    } catch (error) {
        console.error(error);
    }
});

//SETPAUSE
setPause.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();
        state.setPauseInput = setPauseInput.value;
        console.log(Boolean(state.setPauseInput));
        const setPauseTx = await state.big3NFTInstance.methods
            .setPause(state.setPauseInput)
            .send({ from: state.userAccount });
        console.log(setPauseTx);
    } catch (error) {
        console.error(error);
    }
});

//DEVMINT

devMint.addEventListener("submit", async (e) => {
    e.preventDefault();
    const devTx = await state.big3NFTInstance.methods
        .devMint(devMintAddr.value, devMintURI.value, Number(devMintQty.value))
        .send({ from: state.userAccount });
    console.log(
        typeof devMintAddr.value,
        typeof devMintQty.value,
        typeof Number(devMintURI.value)
    );
});

//SET PRICE
setPrice.addEventListener("submit", async (e) => {
    e.preventDefault();
    const setPriceTx = await state.big3NFTInstance.methods
        .setPrice(web3.utils.toWei(setPriceInput.value, "ether"))
        .send({ from: state.userAccount });
    console.log(setPriceTx);
    const getPriceTx = await state.big3NFTInstance.methods._price().call();
    console.log(getPriceTx);
});

////////////////////////////////////////////
////////////////////////////////////////////
//MINT

const mintHandler = async () => {
    try {
        const price = (Number(state.NFTQty) * 0.01).toString();
        console.log(price);
        const mintTx = await state.big3NFTInstance.methods
            .mint(state.baseURI, state.NFTQty)
            .send({
                from: state.userAccount,
                value: web3.utils.toWei(price, "ether"),
            });
    } catch (error) {
        console.error(error);
    }
};

////////////////////////////////
////////////////////////////////
////EVENTLISTENERS

mintForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

mintNFT.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!baseURI.value || parseInt(nftQty.value) === 0) {
        console.log("Not allowed");
        return;
    }
    state.baseURI = baseURI.value;
    state.NFTQty = nftQty.value;
    console.log(state.baseURI);
    await mintHandler();
});
connectBtn.addEventListener("click", connectWallet);

backdrop.addEventListener("click", () => {
    connectWallet();
});

MMwallet.addEventListener("click", async () => {
    await getMMAccounts();
    await connectHandler();
});
WCwallet.addEventListener("click", async () => {
    await connectWC();
    connectHandler();
});

addBtn.addEventListener("click", () => {
    nftQty.value = parseInt(nftQty.value) + 1;
    if (baseURI.value && nftQty.value > 0) {
        mintNFT.classList.remove("disabled");
    } else {
        mintNFT.classList.add("disabled");
    }
});

subBtn.addEventListener("click", () => {
    if (parseInt(nftQty.value) === 0) return;
    nftQty.value = parseInt(nftQty.value) - 1;
    if (baseURI.value && nftQty.value > 0) {
        mintNFT.classList.remove("disabled");
    } else {
        mintNFT.classList.add("disabled");
    }
});

baseURI.addEventListener("keyup", (e) => {
    if (e.target.value && nftQty.value > 0) {
        mintNFT.classList.remove("disabled");
    } else {
        mintNFT.classList.add("disabled");
    }
});
