import './App.css';
import Message from './components/Message';
import axios from 'axios'
import UserInbox from './components/UserInbox'

function App() {
  const instance = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3000/"
 })

  return (
    <div className="App">
     <Message></Message>
     <UserInbox></UserInbox>
    </div>
  );
}

export default App;
