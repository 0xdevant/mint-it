import { useContext } from "react";
import { Web3Context } from "./Web3Context";

// prettier-ignore
async function connectEth() {
  const { setContract, setProvider, setAccount, ethers } =
		useContext(Web3Context);

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
      console.log("Update MetaMask");
    } else {
      console.log("Enable MetaMask");
    }
  } catch (e) {
    console.log(e);
  }
}
export default connectEth;
