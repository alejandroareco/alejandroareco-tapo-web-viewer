import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      const session = await fetchAuthSession();
      console.log("ID TOKEN:", session.tokens?.idToken?.toString());
      console.log("ACCESS TOKEN:", session.tokens?.accessToken?.toString());

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
