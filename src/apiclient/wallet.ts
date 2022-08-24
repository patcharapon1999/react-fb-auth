import axios from "axios"

const createWallet = async (tokenId: String) => {
  axios
    .post("http://localhost:8089/v1/wallet/create", null, {
      headers: { Authorization: `Bearer ${tokenId}` },
    })
    .catch((error) => console.error(error))
}

export default createWallet
