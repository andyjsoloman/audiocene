import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import About from "./pages/About";

import RecordingsList from "./components/RecordingsList";
import Recording from "./components/Recording";
import { RecordingsProvider } from "./contexts/RecordingsContext";
import Form from "./components/Form";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RecordingsProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />}></Route>
            <Route path="app" element={<AppLayout />}>
              <Route index element={<RecordingsList />} />
              <Route
                path="explore"
                element={<p>Find a recording on the map...</p>}
              />
              <Route path="favourites/:id" element={<Recording />} />
              <Route path="add" element={<Form />} />
              <Route path="favourites" element={<RecordingsList />} />
            </Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="about" element={<About />}></Route>
          </Routes>
        </BrowserRouter>
      </RecordingsProvider>
    </AuthProvider>
  );
}

export default App;
