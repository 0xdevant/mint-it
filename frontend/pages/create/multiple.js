import Link from "next/link";
import React, { useRef, useState } from "react";

function multiple() {
  const [uploadedFile, setUploadedFile] = useState(false);
  const uploadFileRef = useRef(null);
  const previewFileRef = useRef(null);
  const previewUploadFile = () => {
    setUploadedFile(true);
    const [file] = uploadFileRef.current.files;
    if (file) {
      previewFileRef.current.src = URL.createObjectURL(file);
      // console.log(previewFileRef);
    }
  };
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
        <p className="text-4xl pb-10">Create multiple editions</p>
        <div className="flex">
          <div className="flex-1">
            <form action="" method="post" className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">Upload files*</div>
                <div className="flex items-center justify-center w-full border border-black border-dashed h-44">
                  <div
                    className="flex items-center justify-center w-full h-full cursor-pointer"
                    tabIndex="0"
                    onClick={() => uploadFileRef.current.click()}>
                    <input
                      required
                      accept=".jpg,.jpeg,.png,.gif,.svg"
                      type="file"
                      autoComplete="off"
                      tabIndex="-1"
                      className="hidden"
                      ref={uploadFileRef}
                      onChange={previewUploadFile}
                    />
                    {uploadedFile ? (
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
                        {" "}
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
                <div className="font-medium text-md">Title*</div>
                <input
                  required
                  type="text"
                  className="upload-input bg-transparent truncate flex-auto outline-none"
                  placeholder='e.g. "MintIt Quackers"'
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">Description*</div>
                <input
                  required
                  type="text"
                  className="upload-input bg-transparent truncate flex-auto outline-none"
                  placeholder='e.g. "The MintIt Quackers are "Non-Fungible Tokens” on the Ethereum blockchain that powers digital art and collectibles.'
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">Number of editions*</div>
                <input
                  required
                  required
                  type="text"
                  className="upload-input bg-transparent truncate flex-auto outline-none"
                  placeholder='e.g. "10" or "50"'
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-md">External URL</div>
                <input
                  type="text"
                  className="upload-input bg-transparent truncate flex-auto outline-none"
                  placeholder='e.g. "https://boredapeyachtclub.com/"'
                />
              </div>
            </form>
          </div>

          <div className="flex-1">
            <div
              className={`space-y-4 w-1/2 mx-auto ${
                uploadedFile ? "block" : "hidden"
              }`}>
              <div className="text-md font-medium">File Preview</div>
              <img
                ref={previewFileRef}
                src="#"
                alt="Preview of the uploaded image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default multiple;
