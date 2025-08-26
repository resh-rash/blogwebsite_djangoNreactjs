import {Routes, Route } from "react-router-dom";

import BlogList from '../pages/blogs/bloglist';
import BlogDetail from '../pages/blogs/blogdetail';
import { Home } from "../pages/home/home";


function Project() {
  return(
        <Routes>
            <Route path="/" element={<Home />} />            
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
    
  );
}



export default Project;