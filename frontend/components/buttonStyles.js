import Link from "next/link";
import React from "react";

function buttonStyles({ text, url }) {
  return (
    <>
      <Link href={url}>
        <button className="p-2 bg-purple-400 rounded-md text-white hover:text-gray-200 focus:outline-1">
          {text}
        </button>
      </Link>
    </>
  );
}

export default buttonStyles;
