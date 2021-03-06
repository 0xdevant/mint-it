import React, { useState, useEffect, useMemo, useContext } from "react";
import Link from "next/link";
import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { Web3Context } from "../../components/web3Context";

import {
  nftMarketplaceAddress,
  singleEditionNFTAddress,
} from "../../../config";

import ERC721NFT from "../../../artifacts/contracts/SingleEditionNFT.sol/SingleEditionNFT.json";
import Market from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";

const client = create({
  host: "ipfs.infura.io",
  protocol: "https",
  port: "5001",
});

function Single() {
  const { ethers } = useContext(Web3Context);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
    fileUrl: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* Dropzone settings */
  const [files, setFiles] = useState([]);
  const {
    isFocused,
    isDragAccept,
    isDragReject,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: "image/jpg, image/jpeg, image/png, image/gif, image/svg+xml",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      acceptedFiles.map((file) => {
        setupIPFS(file);
      });
    },
  });
  const fileRejectionItems = fileRejections.map(({ file }, index) => (
    <div key={index} className="my-2">
      {file.path} - Please upload only JPG, JPEG, PNG, GIF, SVG.
    </div>
  ));
  const focusedStyle = {
    borderColor: "#2196f3",
  };
  const acceptStyle = {
    borderColor: "#00e676",
  };
  const rejectStyle = {
    borderColor: "#ff1744",
  };
  const style = useMemo(
    () => ({
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  async function setupIPFS(file) {
    const data = {
      path: `erc721/images/${file.name}`,
      content: file,
    };
    try {
      const result = await client.add(data, {
        progress: (prog) => console.log(`File Received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${result.cid}/images/${file.name}`;
      setFormInput({ ...formInput, fileUrl: url });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function createMarket() {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    /* fetch the token id using MultipleEditionNFT Contract */
    let contract = new ethers.Contract(
      singleEditionNFTAddress,
      ERC721NFT.abi,
      provider
    );
    const currentTokenId = await contract._getCurrentTokenID();
    //convert tokenId from hex to decimal
    currentTokenId = parseInt(currentTokenId, 16);
    const { name, description, price, fileUrl } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload metadata json to IPFS */
    const data = {
      path: `/erc721/json/${currentTokenId + 1}.json`,
      content: JSON.stringify({
        name,
        description,
        image: fileUrl,
      }),
    };
    try {
      const result = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${result.cid}/json/${
        currentTokenId + 1
      }.json`;
      /* after file is uploaded to IPFS, pass the URL to save it on Ethereum */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //connect to wallet if not connected yet
    await ethereum.request({
      method: "eth_requestAccounts",
    });
    const signer = provider.getSigner();

    /* First mint the item using SingleEditionNFT Contract */
    let contract = new ethers.Contract(
      singleEditionNFTAddress,
      ERC721NFT.abi,
      signer
    );
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace using Marketplace contract */
    contract = new ethers.Contract(nftMarketplaceAddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(
      singleEditionNFTAddress,
      tokenId,
      price,
      true, //for ERC721 token
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    setLoading(false);
    router.push("/");
  }

  function validateInput(e) {
    e.preventDefault();
    const requiredInputs = document.querySelectorAll("input:required");
    requiredInputs.forEach((input) => {
      if (input.value == "") {
        setFormError("Please fill in all the fields.");
        return false;
      }
    });
    return true;
  }

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <>
      <div className="container mx-auto p-4 space-y-8">
        <Link href="/create">
          <div className="flex space-x-2 cursor-pointer mb-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <b>Back</b>
          </div>
        </Link>
        <p className="text-4xl pb-10">Create single collectible</p>
        <div className="flex flex-col md:flex-row space-y-4">
          <div className="flex-1">
            <form
              action=""
              method="post"
              className="flex flex-col space-y-8"
              onSubmit={validateInput}>
              <div className="sm:flex flex-col space-y-2">
                <div className="font-medium text-md">Upload files</div>

                <div
                  className="flex items-center justify-center w-full border-2 border-gray-200 border-dashed h-44"
                  {...getRootProps({ style })}>
                  <div
                    className="flex items-center justify-center w-full h-full cursor-pointer"
                    tabIndex="0">
                    <input required {...getInputProps()} />
                    {formInput.fileUrl ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                        <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" />
                      </svg>
                    ) : (
                      <svg
                        width="35"
                        height="35"
                        viewBox="0 0 35 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width="35" height="35" fill="black"></rect>
                        <path
                          d="M23.0002 16.5305L17.9093 11.4396L12.8184 16.5305L13.6934 17.4055L17.2843 13.8033L17.2843 23.1328L18.5343 23.1328L18.5343 13.8033L22.1365 17.4055L23.0002 16.5305Z"
                          fill="white"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="text-red-500">{fileRejectionItems}</div>

                <div className="flex flex-col space-y-2">
                  <div className="text-gray-500">
                    Drag and drop a file or upload a file from your device.
                  </div>
                  <div className="text-gray-500">
                    JPG, JPEG, PNG, GIF, SVG. Max 500MB.
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">Name</div>
                <input
                  required
                  type="text"
                  className="upload-input bg-transparent truncate flex-auto outline-none"
                  placeholder='e.g. "MintIt Quackers"'
                  onChange={(e) =>
                    setFormInput({ ...formInput, name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">Description</div>
                <input
                  required
                  type="text"
                  className="upload-input bg-transparent truncate flex-auto outline-none"
                  placeholder='e.g. "6,666 algorithmically generated ducks.'
                  onChange={(e) =>
                    setFormInput({
                      ...formInput,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">Price</div>
                <div className="flex items-center w-32">
                  <input
                    required
                    className="flex-1 upload-input bg-transparent truncate outline-none"
                    placeholder='e.g. "5'
                    onChange={(e) =>
                      setFormInput({ ...formInput, price: e.target.value })
                    }
                  />
                  <span className="flex-1 font-bold">ETH</span>
                </div>
              </div>

              <div
                className={`text-red-500 ${!formError ? "hidden" : "block"}`}>
                {formError}
              </div>

              <button
                onClick={createMarket}
                className="p-4 bg-purple-400 text-white rounded-md text-lg cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={
                  !formInput.name ||
                  !formInput.description ||
                  !formInput.price ||
                  !formInput.fileUrl ||
                  isNaN(parseFloat(formInput.price))
                }>
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
                  "Mint and List"
                )}
              </button>
            </form>
          </div>

          <div className="flex-1">
            <div
              className={`space-y-4 w-1/2 mx-auto ${
                files.length > 0 ? "block" : "hidden"
              }`}>
              <div className="text-md font-medium">File Preview</div>
              <img
                src={files[0]?.preview}
                alt="Preview of the uploaded image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Single;
