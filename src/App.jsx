import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Body from "./components/Body"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import AuthPage from "./components/AuthPage" // ✅ corrected name
import { Provider } from "react-redux"
import appStore from "./utils/appStore"

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
