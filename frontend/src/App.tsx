import React from "react"
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import TopPage from './pages/TopPage.tsx';
import SelectQuizPage from './pages/SelectQuizPage.tsx';
import AddQuizPage from "./pages/AddQuizPage.tsx";
import EditQuizPage from "./pages/EditQuizPage.tsx";
import SearchQuizPage from "./pages/SearchQuizPage.tsx";
import DeleteQuizPage from "./pages/DeleteQuizPage.tsx";
import AccuracyRateGraphPage from "./pages/AccuracyRateGraphPage.tsx";
import ImageUploadPage from "./pages/ImageUploadPage.tsx";

import EnglishBotTopPage from "./pages/english_bot/pages/EnglishBotTopPage.tsx";
import EnglishBotAddWordPage from "./pages/english_bot/pages/EnglishBotAddWordPage.tsx";
import EnglishBotDictionaryPage from "./pages/english_bot/pages/EnglishBotDictinoaryPage.tsx";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/top" element={<TopPage />} />

          <Route path="/selectquiz" element={<SelectQuizPage />} />

          <Route path="/addquiz" element={<AddQuizPage />} />

          <Route path="/editquiz" element={<EditQuizPage />} />

          <Route path="/searchquiz" element={<SearchQuizPage />} />

          <Route path="/deletequiz" element={<DeleteQuizPage />} />

          <Route path="/accuracyrategraph" element={<AccuracyRateGraphPage />} />

          <Route path="/imageupload" element={<ImageUploadPage />} />

          <Route path="/english/top" element={<EnglishBotTopPage />} />

          <Route path="/english/add" element={<EnglishBotAddWordPage />} />

          <Route path="/english/dictionary" element={<EnglishBotDictionaryPage />} />

          <Route path="/" element={
            <TopPage />
          } />
        </Routes>
      </BrowserRouter>
    );
  }
}
