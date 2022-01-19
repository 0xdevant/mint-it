const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const MultipleEditionNFT = await ethers.getContractFactory("MultipleEditionNFT");
    const erc1155nft = await MultipleEditionNFT.deploy(marketAddress);
    await erc1155nft.deployed();
    const erc1155nftContractAddress = erc1155nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    await erc1155nft.createToken(10, "https://ipfs.infura.io/ipfs/QmW26XrnuYtSPkKhsZMtqan8QicAxNAAuQCqEPfeCGwNNt/json/1.json");
    await erc1155nft.createToken(15, "https://ipfs.infura.io/ipfs/QmW26XrnuYtSPkKhsZMtqan8QicAxNAAuQCqEPfeCGwNNt/json/1.json");

    await market.createMarketItem(erc1155nftContractAddress, 1, auctionPrice, false, {
      value: listingPrice,
    });
    await market.createMarketItem(erc1155nftContractAddress, 2, auctionPrice, false, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(erc1155nftContractAddress, 1, false, { value: auctionPrice });

    items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await erc1155nft.uri(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    //console.log("items: ", items);

    createdItems = await market.fetchItemsCreated()
    console.log("createdItems: ", createdItems);

    mynftItems = await market.fetchMyNFTs()
    console.log("my NFTs: ", mynftItems);
  });
});
