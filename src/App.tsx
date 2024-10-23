import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./pages"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    <main>
      <Home />
    </main>
    </QueryClientProvider>

  )
}

export default App
