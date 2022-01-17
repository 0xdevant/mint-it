import { ethers } from "ethers";
import { useEffect, useContext, useState } from "react";
import { Web3Context } from "../components/web3Context";
import axios from "axios";
import Footer from "../components/footer";
import styles from "../styles/Home.module.css";
import { nftMarketplaceAddress, singleEditionNFTAddress } from "../../config";
import ERC721NFT from "../../artifacts/contracts/SingleEditionNFT.sol/SingleEditionNFT.json";
import Market from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

export default function Home() {
  //const { provider, account } = useContext(Web3Context);
  const [nfts, setNfts] = useState([]);

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
    const tokenContract = new ethers.Contract(
      singleEditionNFTAddress,
      ERC721NFT.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
  }
  async function buyNft(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      Market.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      singleEditionNFTAddress,
      nft.itemId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  return (
    <>
      <div className="container mx-auto">
        <main className="flex flex-col space-y-4 min-h-screen p-12 items-center justify-center">
          <h1 className="text-5xl">
            Discover, collect, and sell extraordinary NFTs
          </h1>

          <p className={`${styles.description} text-gray-400`}>
            MintIt is one of the world's simplest NFT marketplace
          </p>

          <div className="flex items-center space-x-4 space-y-4 p-4">
            {!nfts.length && (
              <h3 className="text-purple-500 text-2xl font-bold mb-12">
                No items available in the marketplace at the moment
              </h3>
            )}

            {nfts &&
              nfts.map((nft, i) => (
                <div
                  key={i}
                  className="border shadow rounded-xl overflow-hidden w-80">
                  <img src={nft.image} />
                  <div className="p-4">
                    <p className="text-2xl font-semibold">{nft.name}</p>
                    <div style={{ height: "70px", overflow: "hidden" }}>
                      <p className="text-gray-500">{nft.description}</p>
                    </div>

                    <p className="text-xl mb-4 font-semibold">
                      {nft.price} ETH
                    </p>
                    <button
                      className="w-full text-lg font-semibold p-2 text-purple-400 hover:text-white hover:bg-purple-500 rounded-full border border-purple-400"
                      onClick={() => buyNft(nft)}>
                      Buy
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.grid}>
            <a href="/explore" className={styles.card}>
              <h2>Explore &rarr;</h2>
              <p>Discover new and trending NFT projects faster than others.</p>
            </a>

            <a href="/create" className={styles.card}>
              <h2>Create &rarr;</h2>
              <p>
                Mint your NFT in the ERC721 and ERC1155 compatible token
                standard!
              </p>
            </a>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
