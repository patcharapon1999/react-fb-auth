import { FormEvent, useState } from "react"
import { auth } from "./firebase"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth"
import axios from "axios"
import createWallet from "./apiclient/wallet"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [emailSignUp, setEmailSignUp] = useState("")
  const [passwordSignUp, setPasswordSignUp] = useState("")

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await signInWithEmailAndPassword(auth, email, password)
  }

  const onSubmitSignUp = async (e: FormEvent) => {
    e.preventDefault()

    const res = await createUserWithEmailAndPassword(
      auth,
      emailSignUp,
      passwordSignUp
    )

    if (res) {
      const tokenId = await res.user.getIdToken()

      // await sendEmailVerification(res.user)
      await createWallet(tokenId)
    }
  }

  const callAPI = async () => {
    const tokenId = await auth.currentUser?.getIdToken()

    const publicAddress = await axios.get(
      "http://localhost:8089/v1/wallet/public",
      {
        headers: { Authorization: `Bearer ${tokenId}` },
      }
    )
    const balance = await axios.get("http://localhost:8089/v1/wallet/balance", {
      headers: { Authorization: `Bearer ${tokenId}` },
    })
    const privateAddress = await axios.get(
      "http://localhost:8089/v1/wallet/private",
      {
        headers: { Authorization: `Bearer ${tokenId}` },
      }
    )

    console.log(publicAddress, balance, privateAddress)
  }
  return (
    <div className="App">
      <p>Sign Up</p>
      <form onSubmit={onSubmitSignUp}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmailSignUp(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPasswordSignUp(e.target.value)}
          />
        </div>

        <div>
          <div>
            <button>Submit</button>
          </div>
        </div>
      </form>

      <p>Sign In</p>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <div>
            <button>Submit</button>
          </div>
        </div>
      </form>
      <button onClick={callAPI}>Call API</button>
    </div>
  )
}

export default App
