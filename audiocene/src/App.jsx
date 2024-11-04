import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import RecordingsList from "./components/RecordingsList";
import RecordingDetail from "./components/RecordingDetail";

import Form from "./components/Form";
import Explore from "./components/Explore";
import ProtectedRoute from "./components/ProtectedRoute";

import { CurrentlyPlayingProvider } from "./contexts/CurrentlyPlayingContext";
import FavoritesList from "./components/FavoritesList";
import { CurrentBoundsProvider } from "./contexts/RecordingsByBoundsContext";

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
      <CurrentlyPlayingProvider>
        <CurrentBoundsProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Homepage />}></Route>
              <Route path="app" element={<AppLayout />}>
                <Route index element={<RecordingsList />} />
                <Route path="explore" element={<Explore />} />
                <Route path="favourites/:id" element={<RecordingDetail />} />
                <Route path="explore/:id" element={<RecordingDetail />} />
                <Route
                  path="add"
                  element={
                    <ProtectedRoute type="guide">
                      <Form />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="favourites"
                  element={<FavoritesList renderedBy="map" />}
                />
              </Route>
              <Route path="login" element={<Login />}></Route>
              <Route path="about" element={<About />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="profile/:id" element={<Profile />}></Route>
            </Routes>
          </BrowserRouter>
        </CurrentBoundsProvider>
      </CurrentlyPlayingProvider>
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
