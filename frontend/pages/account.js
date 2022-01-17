import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { Web3Context } from "../components/web3Context";

function account() {
  const { setContract, setProvider, setAccount, provider, contract, account } =
    useContext(Web3Context);
  const [ethBalance, setEthBalance] = useState(0);

  async function connectWallet() {
    try {
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const [account] = await ethereum.request({
          method: "eth_requestAccounts",
        });
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
        contract = new ethers.Contract(
          contractAddress,
          Marketplace.abi,
          signer
        );

        setProvider(provider);
        setContract(contract);
        setAccount(account);
        const balance = await provider.getBalance("ethers.eth");
        setEthBalance(ethers.utils.formatEther(balance));
      } else if (window.web3) {
        console.log("Please update your MetaMask");
      } else {
        console.log("Please enable the MetaMask extension");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);
  return (
    <>
      <div className="container p-4">
        <h1 className="text-2xl">Welcome {account} !</h1>
        <h2 className="text-xl">
          Your ETH balance is: {parseFloat(ethBalance).toFixed(4)}
        </h2>
      </div>
    </>
  );
}

export default account;
