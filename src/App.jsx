import {Routes,Route} from 'react-router'
import { useContext, useEffect, useState } from 'react';
import './App.css'
import NavBar from './components/NavBar/NavBar'
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import ApplicationForm from './components/ApplicationForm/ApplicationForm';
import ApplicationDetails from './components/ApplicationDetails/ApplicationDetails'
import AllApplications from './components/AllApplications/AllApplications'
import * as applicationService from './services/applicationService'
import { UserContext } from './contexts/UserContext';


const App = () => {
  const {user} = useContext(UserContext)

  const [applications, setApplications]= useState([])
  const [applicationToUpdate, setApplicationToUpdate]= useState(null)

  useEffect(()=>{
    const getAllApplications = async()=>{
      try {
        const data = await applicationService.index()
        setApplications(data)
      } catch (err) {
      }
    }
    if (user) getAllApplications()
  },[user])


  const updateApplication = (application) =>{
    setApplications([...applications,application])
  }

  const findApplicationsToUpdate = (applicationId)=>{
    const foundApplication = applications.find(application=>application._id===applicationId)
    setApplicationToUpdate(foundApplication)
  }
  
  const deleteApplication = (applicationId)=>{
    const newApplicationList = applications.filter(application=>application._id !==applicationId)
    setApplications(newApplicationList)
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/application/all' element={<AllApplications applications={applications} />} />
        <Route path='/application/new' element={<ApplicationForm updateApplication={updateApplication} />} />
        <Route path='/application/:applicationId' element={<ApplicationDetails deleteApplication={deleteApplication} findApplicationsToUpdate={findApplicationsToUpdate} />} />
        <Route path='/application/:applicationId/update' element={<ApplicationForm  applicationToUpdate={applicationToUpdate} updateApplication={updateApplication} />} />
      </Routes>
    </>
  );
};

export default App;

