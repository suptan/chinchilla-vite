import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ReactQueryDevtools initialIsOpen={false} />
        <main>
          <Routes>
            <Route path="/:shop" element={<Home />} />
            <Route path="/" element={<Navigate to="/wisteria" />} />
          </Routes>
        </main>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
