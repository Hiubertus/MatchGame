import "./Navbar.scss";
import { Link } from "react-router-dom";
import { Gamepad2, Clock } from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/">
                        <Gamepad2 size={24} />
                    </Link>
                </li>
                <li>
                    <Link to="/history">
                        <Clock size={24} />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};