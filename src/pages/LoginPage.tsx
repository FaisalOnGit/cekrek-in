import { LoginForm } from "../components/LoginForm";
import Log from "/log.png";

function Login() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <img src={Log} alt="Login" className="w-1/2 h-full object-cover" />
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
