
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import { Navbar } from './components/Navbar';
import { UploadXML } from './pages/UploadXML';
import { AllReports } from './pages/AllReports';
import { ReportDetails } from './pages/ReportDetails';

function App() {


  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<AllReports />} />
          <Route path="/upload" element={<UploadXML />} />
          <Route path="/report/:id" element={<ReportDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
  }

export default App
