import React from "react"
import logo from './logo.svg';
import './App.css';

import {BrowserRouter, Routes, Route} from "react-router-dom"
import TopPage from './pages/TopPage';
import SelectQuizPage from './pages/SelectQuizPage';
import AddQuizPage from "./pages/AddQuizPage";
import EditQuizPage from "./pages/EditQuizPage";

class App extends React.Component {
  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/top" element={<TopPage />} />

          <Route path="/selectquiz" element={<SelectQuizPage />} />

          <Route path="/addquiz" element={<AddQuizPage />} />

          <Route path="/editquiz" element={<EditQuizPage />} />

          <Route path="/" element={
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
                <a href="/top">My Top</a>
              </header>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
