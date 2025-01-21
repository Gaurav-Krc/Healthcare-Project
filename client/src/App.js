import "./App.css";
import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';
import PatientForm from "./pages/patientProfile/index";
import Chatbot from "./pages/chatbot/index";


const App = () => {
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<PatientForm />}/>
          <Route path = "/chatbot" element = {<Chatbot />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
