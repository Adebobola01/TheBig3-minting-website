const connectWC = async () => {
    //  Enable session (triggers QR Code modal)

    try {
        await provider.enable();

        let web3 = new Web3(provider);

        state.accounts = await web3.eth.getAccounts();
        state.userAccount = state.accounts[0];
        if (
            state.userAccount === "0x3427bfe887eEc6E1C1e0F2b485800B5A9A7c633F"
        ) {
            ownerContainer.classList.remove("hidden");
        }
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
