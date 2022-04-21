import { Route, Routes as Switch } from "react-router-dom";
import { CalendarDashboard } from "./page/Calendar";
import { Login } from "./page/Login";
import { SignUp } from "./page/Signup";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<CalendarDashboard />} />
      </Switch>
    </div>
  );
}

export default App;
