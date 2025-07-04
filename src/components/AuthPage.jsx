import { useState } from "react"
import Login from "./Login"
import Signup from "./Singup" // Make sure the file name is correct!

export default function AuthPage() {
  const [currentForm, setCurrentForm] = useState("login")

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        

        {/* Toggle Login/Signup */}
        <div className="border-2 border-black rounded-2xl overflow-hidden">
          {currentForm === "login" ? (
            <Login onSwitchToSignup={() => setCurrentForm("signup")} />
          ) : (
            <Signup onSwitchToLogin={() => setCurrentForm("login")} />
          )}
        </div>
      </div>
    </div>
  )
}
