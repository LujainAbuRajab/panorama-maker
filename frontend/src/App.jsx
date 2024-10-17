import React from 'react';
import ImageUploader from './components/ImageUploader'; // Make sure the path is correct
import {BrowserRouter, Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomePage" 
import EdgeDetection from "./pages/EdgeDetection" 
import AIBasedH from "./pages/AIBasedH" 

const App = () =>{
  return (
    <>
      {/* <h1>Upload Images</h1>
      <ImageUploader /> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/edge-detection' element={<EdgeDetection />} />
          <Route path='/ai-based-h' element={<AIBasedH />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
