import Link from "next/link";
import React from "react";

function faq() {
  return (
    <>
      <div className="container p-12 space-y-4">
        <ul className="flex flex-col p-4 space-y-8 faq-lists">
          <li>
            <h3>What is MintIt?</h3>
            <p>
              MintIt is one of the world&#39;s simplest NFT marketplace where
              you can discover, collect, mint, and sell extraordinary NFTs.
            </p>
          </li>

          <li>
            <h3>How should I get started?</h3>
            <div className="space-y-4">
              <div>
                <p>
                  If you are a creator, start off by going to{" "}
                  <Link href="/create" passHref>
                    <span className="text-purple-500 cursor-pointer">
                      Create
                    </span>
                  </Link>{" "}
                  and list your valuable NFTs and earn ETH from selling them!
                </p>

                <div className="space-y-2">
                  <div className="p-4 space-y-2">
                    <p>
                      There are two token standards that you could choose from,
                      the <b>ERC-721</b> and the <b>ERC-1155</b>, in short,
                      ERC-721 represents a single edition of a NFT, while
                      ERC-1155 represents multiple editions of a NFT which means
                      it can have more than one copy, technical-wise below are
                      the differences they have:
                    </p>
                    <ul className="list-disc px-8">
                      <li>
                        ERC-1155 permits the creation of both semi-fungible
                        tokens and non-fungible tokens, whereas ERC-721 permits
                        only the latter.
                      </li>
                      <li>
                        In ERC-1155, smart contracts are linked to multiple URIs
                        and do not store additional metadata (such as file
                        names). In comparison, ERC-721 only supports static
                        metadata stored directly on the smart contract for each
                        token ID,, increasing deployment costs and limiting
                        flexibility.
                      </li>
                      <li>
                        ERC-1155’s smart contracts support an infinite number of
                        tokens, whereas ERC-721 needs a new smart contract for
                        each type of token.
                      </li>
                      <li>
                        ERC-1155 also allows batch transfers of tokens, which
                        can reduce transaction costs and times. With ERC-721, if
                        you want to send multiple tokens, they happen
                        individually.
                      </li>
                    </ul>
                    <p>
                      With that being said, the ERC-721 token standard kicked
                      off the NFT craze. It was the first of its kind, and
                      consequently, the most popular standard for creating these
                      unique tokens.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <p>
                If you are a collector, feel free to explore any NFTs you feel
                interested in{" "}
                <Link href="/" passHref>
                  <span className="text-purple-500 cursor-pointer">
                    homepage
                  </span>
                </Link>{" "}
                and add them to your collections by purchasing them!
              </p>
            </div>
          </li>
          <li>
            <h3>What is the listing fee?</h3>
            <p>
              There is a <b>0.025 ETH</b> listing fee everytime you are minting
              and listing on our marketplace.
            </p>
          </li>

          <li>
            <h3>What are gas fees on Ethereum?</h3>
            <p>
              Gas fees are transaction fees on Ethereum. MintIt does not receive
              these fees and is not able to refund them.
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}

export default faq;
