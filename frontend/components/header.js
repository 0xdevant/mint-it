import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { Web3Context } from "./web3Context";

import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

function header() {
  const { setContract, setProvider, ethers, setAccount, account } =
    useContext(Web3Context);

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
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
        const contract = new ethers.Contract(
          contractAddress,
          Marketplace.abi,
          signer
        );

        setProvider(provider);
        setContract(contract);
        setAccount(account);
      } else if (window.web3) {
        console.log("Please update your MetaMask");
      } else {
        console.log("Please enable the MetaMask extension");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="w-full p-5 flex align-middle shadow-md">
      <Link href="/">
        <a className="flex items-center">
          <Image src="/vercel.svg" alt="MintIt Logo" width={80} height={24} />
        </a>
      </Link>

      <ul className="nav flex w-full">
        <div className="text-gray-500 flex items-center space-x-8 ml-auto">
          <li className="nav-item hover:text-gray-700">
            <Link href="/explore">Explore</Link>
          </li>
          <li className="nav-item hover:text-gray-700">
            <Link href="/create">Create</Link>
          </li>
          <li className="nav-item hover:text-gray-700">
            <Link href="/account">Account</Link>
          </li>
          <li className="nav-item w-40">
            {account ? (
              <div className="px-4 py-2 rounded-full border">
                <p className="text-gray-500 truncate">{account}</p>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 text-purple-400 hover:text-white hover:bg-purple-500 rounded-full border border-purple-400">
                Connect Wallet
              </button>
            )}
          </li>
        </div>
      </ul>
    </div>
  );
}

export default header;
