const backdrop = document.querySelector(".backdrop");
const connectBtn = document.querySelector(".connect--button");
const walletsContainer = document.querySelector(".wallet__container");
const MMwallet = document.querySelector(".metamask__btn");
const WCwallet = document.querySelector(".walletConnect__btn");
const connectBtnContainer = document.querySelector(".connect__btn--container");
const mainBody = document.querySelector(".main");

const state = {};
let web3 = new Web3(Web3.givenProvider);
const message = "You are about to sign into the big3Minting website";

///////////////////////////////
///////////////////////////
//display Wallets

// connectBtn.addEventListener("click");

const connectWallet = () => {
    backdrop.classList.remove("hidden");
    walletsContainer.classList.remove("hidden");
};
const removeWalletContainer = () => {
    backdrop.classList.add("hidden");
    walletsContainer.classList.add("hidden");
};

const getMMAccounts = async () => {
    state.accounts = await ethereum.request({ method: "eth_requestAccounts" });
    state.userAccount = state.accounts[0];
};

const displayAddr = () => {
    const addr = `${state.userAccount.slice(0, 3)}...${state.userAccount.slice(
        -4
    )}`;
    connectBtnContainer.innerHTML = addr;
};

const signMessage = async () => {
    state.signature = await web3.eth.personal.sign(message, state.userAccount);
    console.log(state.signature);
};

const confirmSignature = async () => {
    recoveredAddr = await web3.eth.personal.ecRecover(message, state.signature);
    if (state.userAccount !== state.recoveredAddr) {
        mainBody.innerHTML = "<h1>You are not authorised</h1>";
    }
    mainBody.innerHTML = `<h1>You address: ${recoveredAddr}, has been verified</h1>`;
};

const connectHandler = async () => {
    await signMessage();
    removeWalletContainer();
    displayAddr();
    confirmSignature();
};

///////////////////////////////
//////////////////////
//WalletConnect

const provider = new WalletConnectProvider.default({
    rpc: {
        1: "https://cloudflare-eth.com/",
        // 3: "https://ropsten.mycustomnode.com",
        // 100: "https://dai.poa.network",
        // ...
    },
});

const connectWC = async () => {
    //  Enable session (triggers QR Code modal)

    try {
        await provider.enable();

        web3 = new Web3(provider);

        state.accounts = await web3.eth.getAccounts();
        state.userAccount = state.accounts[0];
    } catch (error) {
        console.error(error);
    }
};

connectBtn.addEventListener("click", connectWallet);
MMwallet.addEventListener("click", async () => {
    await getMMAccounts();
    connectHandler();
});
WCwallet.addEventListener("click", async () => {
    await connectWC();
    connectHandler();
});
