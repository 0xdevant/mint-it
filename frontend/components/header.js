import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { Web3Context } from "./web3Context";

import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

function Header() {
  const { setProvider, setContract, setAccount, ethers, account } =
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
          contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

          // Ropsten
        } else if (chainId === "0x3") {
          contractAddress = "0x63e5D46D9e5eaE82561ae22Ee7dd05Aa052A207c";
        }

        //connect to read-only marketplace contract
        const contract = new ethers.Contract(
          contractAddress,
          Marketplace.abi,
          provider
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
          <Image src="/mintIt.png" alt="MintIt Logo" width={92} height={24} />
        </a>
      </Link>

      <ul className="nav flex w-full">
        <div className="text-gray-500 flex items-center space-x-8 ml-auto">
          <li className="nav-item hover:text-gray-700">
            <Link href="/create">Create</Link>
          </li>
          <li className="nav-item hover:text-gray-700">
            <Link href="/account">Account</Link>
          </li>
          <li className="nav-item hover:text-gray-700">
            <Link href="/faq">FAQ</Link>
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

export default Header;
