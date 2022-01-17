// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const nftMarketplace = await Marketplace.deploy();
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  const SingleEditionNFT = await hre.ethers.getContractFactory(
    "SingleEditionNFT"
  );
  const singleEditionNFT = await SingleEditionNFT.deploy(
    nftMarketplace.address
  );
  await singleEditionNFT.deployed();
  console.log("singleEditionNFT deployed to:", singleEditionNFT.address);

  const MultipleEditionNFT = await hre.ethers.getContractFactory(
    "MultipleEditionNFT"
  );
  const multipleEditionNFT = await MultipleEditionNFT.deploy(
    nftMarketplace.address
  );
  await multipleEditionNFT.deployed();
  console.log("multipleEditionNFT deployed to:", multipleEditionNFT.address);

  let config = `
  export const nftMarketplaceAddress = "${nftMarketplace.address}"
  export const singleEditionNFTAddress = "${singleEditionNFT.address}"
  export const multipleEditionNFTAddress = "${multipleEditionNFT.address}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
