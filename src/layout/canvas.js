import { BrowserRouter, Route, Routes } from "react-router-dom";
import IdbTest from "../page/idbTest";

function Canvas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdbTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Canvas;
