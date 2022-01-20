import { ethers } from "ethers";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import styles from "../styles/Home.module.css";
import {
  nftMarketplaceAddress,
  singleEditionNFTAddress,
  multipleEditionNFTAddress,
} from "../../config";
import ERC721NFT from "../../artifacts/contracts/SingleEditionNFT.sol/SingleEditionNFT.json";
import ERC1155NFT from "../../artifacts/contracts/MultipleEditionNFT.sol/MultipleEditionNFT.json";
import Market from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import Link from "next/link";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketContract = new ethers.Contract(
      nftMarketplaceAddress,
      Market.abi,
      provider
    );
    const erc721TokenContract = new ethers.Contract(
      singleEditionNFTAddress,
      ERC721NFT.abi,
      provider
    );
    const erc1155TokenContract = new ethers.Contract(
      multipleEditionNFTAddress,
      ERC1155NFT.abi,
      provider
    );
    try {
      const data = await marketContract.fetchMarketItems();
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
            meta = await axios.get(tokenUri);
          } catch (err) {
            meta = "";
          }

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta?.data?.image,
            name: meta?.data?.name,
            description: meta?.data?.description,
            isERC721: i.isERC721,
          };
          return item;
        })
      );
      setNfts(items);
    } catch (error) {
      //no items available
      console.log("No items yet");
    }
  }
  async function buyNft(nft) {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //connect to wallet if not connected yet
    await ethereum.request({
      method: "eth_requestAccounts",
    });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      Market.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nft.isERC721 ? singleEditionNFTAddress : multipleEditionNFTAddress,
      nft.itemId,
      nft.isERC721,
      {
        value: price,
      }
    );
    await transaction.wait();
    setLoading(false);
    loadNFTs();
  }

  return (
    <>
      <div className="container mx-auto">
        <main className="flex flex-col space-y-4 min-h-screen p-12 items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-center">
            Discover, collect, mint and sell extraordinary NFTs
          </h1>

          <p className="text-gray-400 text-center">
            MintIt is one of the world&#39;s simplest NFT marketplace
          </p>

          <div className="flex flex-col justify-center items-center space-x-4 space-y-4 p-4">
            {!nfts.length && (
              <h3 className="text-purple-500 text-2xl font-semibold mb-12">
                No items available in the marketplace at the moment
              </h3>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {nfts &&
                nfts.map((nft, i) => (
                  <div
                    key={i}
                    className="border shadow rounded-xl overflow-hidden w-80 sm:w-60 md:w-52">
                    <div className="aspect-square w-76 h-76 grid place-items-center">
                      <img src={nft.image} className="w-full mx-auto" />
                    </div>

                    <div className="p-4 space-y-4">
                      <p className="text-2xl font-semibold truncate">
                        {nft.name}
                      </p>
                      <div>
                        <p
                          className="text-gray-500 overflow-hidden text-ellipsis"
                          style={{ height: "70px" }}>
                          {nft.description}
                        </p>
                      </div>

                      <p className="text-xl font-semibold">{nft.price} ETH</p>
                      <button
                        className="w-full text-lg font-semibold p-2 text-purple-400 hover:text-white hover:bg-purple-500 rounded-full border border-purple-400"
                        onClick={() => buyNft(nft)}>
                        {loading ? (
                          <svg
                            className="animate-spin mx-auto h-6 w-6 text-white"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          "Buy"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles.grid}>
            <Link href="/create">
              <a className={styles.card}>
                <h2>Create &rarr;</h2>
                <p>
                  Mint your amazing NFT with either ERC721 or ERC1155 token
                  standard!
                </p>
              </a>
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
