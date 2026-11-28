import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PartnerApplicationModal } from "./components/PartnerApplicationModal";
import { PartnerModalProvider } from "./context/PartnerModalContext";
import { Home } from "./pages/Home";

const ServicesPage = lazy(() =>
  import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage }))
);
const ForSalonsPage = lazy(() =>
  import("./pages/ForSalonsPage").then((m) => ({ default: m.ForSalonsPage }))
);
const FaqPage = lazy(() =>
  import("./pages/FaqPage").then((m) => ({ default: m.FaqPage }))
);
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const Refund = lazy(() => import("./pages/Refund").then((m) => ({ default: m.Refund })));
const DeleteAccount = lazy(() =>
  import("./pages/DeleteAccount").then((m) => ({ default: m.DeleteAccount }))
);

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
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route
            path="/services"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ServicesPage />
              </Suspense>
            }
          />
          <Route
            path="/for-salons"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ForSalonsPage />
              </Suspense>
            }
          />
          <Route
            path="/faq"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <FaqPage />
              </Suspense>
            }
          />
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
      <PartnerApplicationModal />
    </PartnerModalProvider>
  );
}

export default App;
