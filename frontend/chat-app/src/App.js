import './App.css';
import LogIn from './components/LogIn'
import jwtDecode from 'jwt-decode';
import {Route,Routes,Link,NavLink} from 'react-router-dom'
import Home from './pages/Home';
import Messages from './pages/Messages';
import UserInbox from './pages/UserInbox'
// import UserInbox from './pages/UserInbox';

function App() {
//   const instance = axios.create({
//     withCredentials: true,
//     baseURL: "http://localhost:3000/"
//  })

 function getUser(){
  const token = localStorage.getItem("token")
  const getUser = jwtDecode(token)
  return getUser
}
/* <LogIn></LogIn>
<Message></Message>
<UserInbox></UserInbox> */

  return (
    <>
      <nav>
        <a href='/'>Home  </a>
        <a href='/messages'>messages  </a>
        <a href='/login'>  login</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/messages" element={<Messages/>}></Route>
        <Route path="/login" element={<LogIn/>}></Route>
      </Routes>
    </>
  );
}

export default App;
