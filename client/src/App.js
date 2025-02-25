import "./App.css";
import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';
import PatientForm from "./pages/patientProfile/index";
import Chatbot from "./pages/chatbot/index";
import SignIn from "./pages/auth";
import BatchJobTable from "./pages/batch-job";

const App = () => {
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<PatientForm />}/>
          <Route path = "/signin" element = {<SignIn />}/>
          <Route path = "/chatbot" element = {<Chatbot />}/>
          <Route path = "/batches" element = {<BatchJobTable />}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
