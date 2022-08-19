const getMMAccounts = async () => {
    state.accounts = await ethereum.request({ method: "eth_requestAccounts" });
    state.userAccount = state.accounts[0];
};

const signMessage = async () => {
    state.signature = await web3.eth.personal.sign(message, state.userAccount);
    console.log(state.signature);
};

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
