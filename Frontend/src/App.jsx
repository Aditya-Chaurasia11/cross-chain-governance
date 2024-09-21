import "@rainbow-me/rainbowkit/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProposalPage from "./pages/ProposalPage";
import { ToastContainer, toast } from "react-toastify";


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProposalPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
