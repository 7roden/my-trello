import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CardEdit from './pages/Board/components/CardEdit/CardEdit';
import LoginPage from './pages/User/LoginPage';
import RegisterPage from './pages/User/RegisterPage';

function App() {
  return (
    <div className="App">
      
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/board" element={<Board />}></Route>
            <Route path="/board/:boardID" element={<Board />}></Route>
            <Route path="/board/:boardID/card/:cardID" element={<Board />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>


          </Routes>
        </Router>
      
    </div>
  );
}

export default App;
