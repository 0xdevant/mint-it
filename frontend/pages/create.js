import Link from "next/link";
import React from "react";

function Create() {
  return (
    <>
      <div className="min-h-screen grid place-items-center container mx-auto p-4">
        <main className="space-y-12">
          <p className="text-4xl">Upload your work</p>
          <p>
            Choose <b>“Single”</b> if you want your collectible to be one of a
            kind or <b>“Multiple”</b> if you want to sell one collectible
            multiple times.
          </p>

          <div className="space-y-4">
            <p>Choose your type</p>
            <div className="flex space-x-8 align-middle">
              <div>
                <Link href="/create/single">
                  <img
                    src="upload_single.svg"
                    alt="Single Version"
                    className="cursor-pointer"
                  />
                </Link>
                Single edition (ERC721)
              </div>
              <div>
                <Link href="/create/multiple">
                  <img
                    src="upload_multiple.svg"
                    alt="Multiple Versions"
                    className="cursor-pointer"
                  />
                </Link>
                Multiple editions (ERC1155)
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Create;
