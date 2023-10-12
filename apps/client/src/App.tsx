import { Link } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <>
      <h1>NutriShare</h1>

      <div>
        <Link to="/auth/login">
          <button type="button">Login</button>
        </Link>
        <Link to="/auth/register">
          <button type="button">Register</button>
        </Link>
      </div>
    </>
  );
};

export default App;
