import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PartnerModalProvider } from "./context/PartnerModalContext";
import { Home } from "./pages/Home";

const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const Refund = lazy(() => import("./pages/Refund").then((m) => ({ default: m.Refund })));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount").then((m) => ({ default: m.DeleteAccount })));

function PageLoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <PartnerModalProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Privacy />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Terms />
              </Suspense>
            }
          />
          <Route
            path="/refund"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Refund />
              </Suspense>
            }
          />
          <Route
            path="/delete-account"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <DeleteAccount />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </PartnerModalProvider>
  );
}

export default App;

