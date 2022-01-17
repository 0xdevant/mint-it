import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

export const Web3Context = createContext();
const oneEther = ethers.BigNumber.from("1000000000000000000");

const Web3Provider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");

  // Listens for a change in account and updates state
  useEffect(() => {
    ethereum.on("accountsChanged", newAccount);
    return () => ethereum.removeListener("accountsChanged", newAccount);
  });

  function newAccount(accounts) {
    setContract(contract.connect(provider.getSigner(accounts[0])));
    setAccount(accounts[0]);
  }

  async function connectEth() {
    try {
      //detect metamask provider
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const chainId = await ethereum.request({ method: "eth_chainId" });
        let contractAddress;

        // Hardhat Local
        if (chainId === "0x7a69") {
          contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

          // Rinkeby
        } else if (chainId === "0x4") {
          contractAddress = "";

          // Mainnet
        } else if (chainId === "0x1") {
          contractAddress = "";

          // Ropsten
        } else if (chainId === "0x3") {
          contractAddress = "";
        }

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          Marketplace.abi,
          signer.address
        );

        setProvider(provider);
        setContract(contract);
        setAccount(signer.address);
      } else if (window.web3) {
        console.log("Please update your MetaMask");
      } else {
        console.log("Please enable the MetaMask extension");
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Init ETH, and listens network changes to reload the page
  useEffect(() => {
    connectEth();
    ethereum.on("chainChanged", (chainId) => window.location.reload());
    return () =>
      ethereum.removeListener("chainChanged", (chainId) =>
        window.location.reload()
      );
  }, []);

  return (
    <Web3Context.Provider
      value={{
        ethers,
        provider,
        setProvider,
        contract,
        setContract,
        account,
        setAccount,
        oneEther,
      }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
