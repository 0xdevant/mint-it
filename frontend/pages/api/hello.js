// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const pinataSDK = require("@pinata/sdk");

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

const pinata = pinataSDK(
  "9df6b34b0b51531437ee",
  "b5a7f7d76c3ff5283bb861f15e790d1edc467ed6c6f58f97375c14e92461363c"
);
pinata
  .testAuthentication()
  .then((result) => {
    //handle successful authentication here
    console.log(result);
  })
  .catch((err) => {
    //handle error here
    console.log(err);
  });
