import "./App.css";
import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';
import PatientForm from "./pages/patientProfile/index";
import Chatbot from "./pages/chatbot/index";
import SignIn from "./pages/auth";
import BatchJob from "./pages/batch-job";
import BatchJobTable from "./pages/batch-job";
import NewBatchJob from "./pages/batch-job/new";
import UpdateBatchJob from "./pages/batch-job/update";

const App = () => {
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<PatientForm />}/>
          <Route path = "/signin" element = {<SignIn />}/>
          <Route path = "/chatbot" element = {<Chatbot />}/>
          <Route path = "/batches" element = {<BatchJobTable />}/>
          <Route path = "/batch/new" element = {<NewBatchJob />}/>
          <Route path = "/batch/update" element = {<UpdateBatchJob />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
