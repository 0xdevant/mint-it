import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Web3Context } from "../components/web3Context";
import {
  nftMarketplaceAddress,
  singleEditionNFTAddress,
  multipleEditionNFTAddress,
} from "../../config";
import ERC721NFT from "../../artifacts/contracts/SingleEditionNFT.sol/SingleEditionNFT.json";
import ERC1155NFT from "../../artifacts/contracts/MultipleEditionNFT.sol/MultipleEditionNFT.json";
import Market from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import Link from "next/link";

function account() {
  const {
    setProvider,
    setContract,
    setAccount,
    provider,
    contract,
    account,
    ethers,
  } = useContext(Web3Context);
  //const [ethBalance, setEthBalance] = useState(0);
  const [createdNfts, setCreatedNfts] = useState([]);
  const [ownNfts, setOwnNfts] = useState([]);
  const [sold, setSold] = useState([]);

  useEffect(() => {
    connectWallet();
    loadCreatedNFTs();
    loadOwnNFTs();
  }, []);

    // Listens for a change in account and updates state
    useEffect(() => {
      ethereum.on("accountsChanged", (accounts) => {
        setCreatedNfts([])
        setOwnNfts([])
        setSold([])
        loadCreatedNFTs();
        loadOwnNFTs();
        /*if(!accounts.length) {
          setEthBalance(0)
          return;
        }
        console.log(accounts);
        const balance = provider.getBalance(accounts[0]); 
        console.log(balance);
        setEthBalance(ethers.utils.formatEther(balance))*/
      });
    });

  async function loadCreatedNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(
      nftMarketplaceAddress,
      Market.abi,
      signer
    );
    const erc721TokenContract = new ethers.Contract(
      singleEditionNFTAddress,
      ERC721NFT.abi,
      signer
    );
    const erc1155TokenContract = new ethers.Contract(
      multipleEditionNFTAddress,
      ERC1155NFT.abi,
      signer
    );
    try {
      const data = await marketContract.fetchItemsCreated();
      console.log(data);
      const items = await Promise.all(
        data.map(async (i) => {
          let tokenUri;
          if (i.isERC721) {
            tokenUri = await erc721TokenContract.tokenURI(i.tokenId);
          } else {
            tokenUri = await erc1155TokenContract.uri(i.tokenId);
          }
          let meta;
          try {
             meta = await axios.get(tokenUri)
          } catch(err) {
             meta = "";
          }
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta?.data?.image,
            name: meta?.data?.name,
            description: meta?.data?.description,
            isERC721: i.isERC721,
          };
          return item;
        })
      );
      /* create a filtered array of items that have been sold */
      const soldItems = items.filter((i) => i.sold);
      setSold(soldItems);
      setCreatedNfts(items);
    } catch (error) {
      //no items available
      console.log("No items yet");
    }
  }

  async function loadOwnNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(
      nftMarketplaceAddress,
      Market.abi,
      signer
    );
    const erc721TokenContract = new ethers.Contract(
      singleEditionNFTAddress,
      ERC721NFT.abi,
      signer
    );
    const erc1155TokenContract = new ethers.Contract(
      multipleEditionNFTAddress,
      ERC1155NFT.abi,
      signer
    );
    try {
      const data = await marketContract.fetchMyNFTs();
      console.log(data);
      const items = await Promise.all(
        data.map(async (i) => {
          let tokenUri;
          if (i.isERC721) {
            tokenUri = await erc721TokenContract.tokenURI(i.tokenId);
          } else {
            tokenUri = await erc1155TokenContract.uri(i.tokenId);
          }
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            isERC721: i.isERC721,
          };
          return item;
        })
      );
      setOwnNfts(items);
    } catch (error) {
      //no items available
      console.log("No items yet");
    }
  }

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
          contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

          // Rinkeby
        } else if (chainId === "0x4") {
          contractAddress = "";
        }

        const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, Market.abi, signer);

        setProvider(provider);
        setContract(contract);
        setAccount(account);
       // const balance = await provider.getBalance(account);
        //setEthBalance(ethers.utils.formatEther(balance));
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
    <>
      <div className="container p-12 space-y-4">
        <h1 className="text-2xl">Welcome! Your wallet address is <b>{account}</b></h1>
        {/*<h2 className="text-xl">
          Your ETH balance is: {parseFloat(ethBalance).toFixed(4)}
  </h2>*/}
        <div className="flex flex-col p-4 space-y-4">
          <h3 className="text-xl">NFTs you have:</h3>
          {!ownNfts.length && (
            <div className="container mx-auto text-2xl font-bold mb-12 p-4">
              None yet, go{" "}
              <Link href="/">
                <span className="text-purple-500 cursor-pointer">buy</span>
              </Link>{" "}
              some for yourself!
            </div>
          )}
        </div>

        <div className="flex justify-center items-center space-x-4 space-y-4 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ownNfts &&
            ownNfts.map((nft, i) => (
              <div
                key={i}
                className="border shadow rounded-xl overflow-hidden w-80">
                <img src={nft.image} className="w-full mx-auto aspect-square" />
                <div className="p-4">
                  <p className="text-2xl font-semibold">{nft.name}</p>
                  <div className="mb-4">
                    <p className="text-gray-500">{nft.description}</p>
                  </div>

                  <p className="text-xl mb-4 font-semibold">{nft.price} ETH</p>
                </div>
              </div>
            ))}
            </div>
        </div>

        <div className="flex flex-col p-4 space-y-4">
            {Boolean(sold.length) && (
              <div>
                <h3 className="text-xl pb-2">Items sold:</h3>
                <div className="flex justify-center items-center space-x-4 space-y-4 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sold.map((nft, i) => (
                      <div
                        key={i}
                        className="border shadow rounded-xl overflow-hidden w-80">
                        <img src={nft.image} className="w-full mx-auto aspect-square" />
                        <div className="p-4">
                          <p className="text-2xl font-semibold">{nft.name}</p>
                          <div className="mb-4">
                            <p className="text-gray-500">{nft.description}</p>
                          </div>

                          <p className="text-xl mb-4 font-semibold">{nft.price} ETH</p>
                        </div>
                      </div>
                    ))}
                    </div>
                </div>
              </div>
            )}
          
        </div>
        
        <div className="flex flex-col p-4 space-y-4">
          <h3 className="text-xl">NFTs you have created so far:</h3>
          {!createdNfts.length && (
            <div className="container mx-auto text-2xl font-bold mb-12 p-4">
              None yet, go{" "}
              <Link href="/create">
                <span className="text-purple-500 cursor-pointer">mint</span>
              </Link>{" "}
              some for yourself!
            </div>
          )}
          <div className="flex justify-center items-center space-x-4 space-y-4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {createdNfts &&
                createdNfts.map((nft, i) => (
                  <div
                    key={i}
                    className="border shadow rounded-xl overflow-hidden w-80">
                    <img src={nft.image} className="w-full mx-auto aspect-square" />
                    <div className="p-4">
                      <p className="text-2xl font-semibold">{nft.name}</p>
                      <div className="mb-4">
                        <p className="text-gray-500">{nft.description}</p>
                      </div>

                      <p className="text-xl mb-4 font-semibold">{nft.price} ETH</p>
                    </div>
                  </div>
                ))}
                </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default account;
