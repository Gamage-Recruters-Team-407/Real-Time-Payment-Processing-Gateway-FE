import { BrowserRouter, Routes, Route } from "react-router-dom";
import Payment from "./pages/Payment.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Developer 3 - Payment Processing */}
        <Route path="/payment" element={<Payment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;