import "./App.css";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import Header from "./components/Header.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import axios from "axios";
import { UserContextProvider } from "./UserContext.jsx";
import Account from "./pages/Account.jsx";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/:subpage" element={<Account />} />
          <Route path="/account/:subpage/:action" element={<Account />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
