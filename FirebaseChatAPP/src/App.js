import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/Navbar";
import ChatBox from "./components/Chatbox";
import Welcome from "./components/Welcome";

function App() {
  const [user] = useAuthState(auth);
  if (user)
    auth.currentUser.getIdToken().then((idToken) => localStorage.setItem('idToken', idToken));
  return (
    <div className="App">
      <NavBar />
      {!user ? (
        <Welcome />
      ) : (
        <>
          <ChatBox />
        </>
      )}
    </div>
  );
}

export default App;