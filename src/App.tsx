import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PartnerModalProvider } from "./context/PartnerModalContext";
import { DeleteAccount } from "./pages/DeleteAccount";
import { Home } from "./pages/Home";
import { Privacy } from "./pages/Privacy";
import { Refund } from "./pages/Refund";
import { Terms } from "./pages/Terms";

function App() {
  return (
    <PartnerModalProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
        </Route>
      </Routes>
    </PartnerModalProvider>
  );
}

export default App;
