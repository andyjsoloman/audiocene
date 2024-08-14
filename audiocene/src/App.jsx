import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import About from "./pages/About";

import RecordingsList from "./components/RecordingsList";
import Recording from "./components/RecordingDetail";

import Form from "./components/Form";
import { AuthProvider } from "./contexts/AuthContext";
import Explore from "./components/Explore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />}></Route>
            <Route path="app" element={<AppLayout />}>
              <Route index element={<RecordingsList />} />
              <Route path="explore" element={<Explore />} />
              <Route path="favourites/:id" element={<Recording />} />
              <Route path="add" element={<Form />} />
              <Route path="favourites" element={<RecordingsList />} />
            </Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="about" element={<About />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-black)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
