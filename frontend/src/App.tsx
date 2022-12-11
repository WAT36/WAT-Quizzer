import React from "react"
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import TopPage from './pages/quizzer/TopPage';
import SelectQuizPage from './pages/quizzer/SelectQuizPage';
import AddQuizPage from "./pages/quizzer/AddQuizPage";
import EditQuizPage from "./pages/quizzer/EditQuizPage";
import SearchQuizPage from "./pages/quizzer/SearchQuizPage";
import DeleteQuizPage from "./pages/quizzer/DeleteQuizPage";
import AccuracyRateGraphPage from "./pages/quizzer/AccuracyRateGraphPage";
import ImageUploadPage from "./pages/quizzer/ImageUploadPage";

import EnglishBotTopPage from "./pages/english_bot/pages/EnglishBotTopPage";
import EnglishBotAddWordPage from "./pages/english_bot/pages/EnglishBotAddWordPage";
import EnglishBotDictionaryPage from "./pages/english_bot/pages/EnglishBotDictinoaryPage";
import EnglishBotWordDetailPage from "./pages/english_bot/pages/EnglishBotWordDetailPage";

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

          <Route path="/english/word/:name" element={<EnglishBotWordDetailPage />} />

          <Route path="/" element={
            <TopPage />
          } />
        </Routes>
      </BrowserRouter>
    );
  }
}
