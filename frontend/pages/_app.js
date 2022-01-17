import "../styles/globals.css";
import Header from "../components/header";
import Web3Provider from "../components/web3Context";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Head>
        <title>MintIt</title>
        <meta
          name="description"
          content="About
MintIt is a NFT marketplace where users can create, sell their NFTs with the ERC721 & ERC1155 token standard, and also to explore NFTs from other creators."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
