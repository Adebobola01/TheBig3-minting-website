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

const state = {};

const message = "You are about to sign into the big3Minting website";

///////////////////////////////
///////////////////////////
//display Wallets

// connectBtn.addEventListener("click");

const connectWallet = () => {
    backdrop.classList.toggle("hidden");
    walletsContainer.classList.toggle("hidden");
};
const removeWalletContainer = () => {
    backdrop.classList.add("hidden");
    walletsContainer.classList.add("hidden");
};

const displayAddr = () => {
    const addr = `${state.userAccount.slice(0, 3)}...${state.userAccount.slice(
        -4
    )}`;
    connectBtnContainer.innerHTML = addr;
};

const confirmSignature = async () => {
    recoveredAddr = await web3.eth.personal.ecRecover(message, state.signature);
    if (state.userAccount !== state.recoveredAddr) {
        mainBody.innerHTML = "<h1>You are not authorised</h1>";
    }
    mainBody.innerHTML = `<h1>You address: ${recoveredAddr}, has been verified</h1>`;
};

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

const mintHandler = async () => {
    try {
        await state.big3NFTInstance.methods.mint(state.baseURI).send({
            from: state.userAccount,
            to: state.contractAddress,
            value: "0.01 ether",
        });
    } catch (error) {
        console.error(error);
    }
};

const connectHandler = async () => {
    await signMessage();
    removeWalletContainer();
    displayAddr();
    confirmSignature();
    await getContract();
};
const init = async () => {
    nftQty.value = 0;
    await (() => {
        if (baseURI.value) {
            mintNFT.classList.remove("disabled");
        }
    });
};

init();

////////////////////////////////
////////////////////////////////
////eventListeners
mintForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

mintNFT.addEventListener("click", (e) => {
    e.preventDefault();
    if (!baseURI.value || parseInt(nftQty.value) === 0) {
        console.log("Not allowed");
        return;
    }
    state.baseURI = baseURI.value;
    console.log(state.baseURI);
    mintHandler();
});
connectBtn.addEventListener("click", connectWallet);
MMwallet.addEventListener("click", async () => {
    await getMMAccounts();
    connectHandler();
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
