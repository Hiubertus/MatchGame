import './App.scss'
import {
    Game, Navbar
} from "./components";
import {Route, Routes} from "react-router-dom";
import {GameHistory} from "./components/GameHistory";

export const App = () => {
    return (
        <div>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Game />} />
                <Route path="/history" element={<GameHistory />} />
            </Routes>
        </div>
    );
}

