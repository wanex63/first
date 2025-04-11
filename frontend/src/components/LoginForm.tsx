import { useState } from 'react'
import axios from 'axios'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/login', {
        username,
        password
      })
      localStorage.setItem('token', res.data.access_token)
    } catch (error) {
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
      >
        Login
      </button>
    </div>
  )
}