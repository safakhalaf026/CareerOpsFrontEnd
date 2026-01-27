import { useState, useEffect } from "react"
import * as applicationService from '../../services/applicationService'
import { Link, useParams,useNavigate } from "react-router"
import styles from "./ApplicationDetails.module.css"

function ApplicationDetails({findApplicationsToUpdate, deleteApplication}) {
      const navigate = useNavigate()
    const [application, setApplication]= useState(null)
    const {applicationId}= useParams()
   
    useEffect(()=>{
        const getOneApplication = async (applicationId)=>{
            const application = await applicationService.show(applicationId)
            setApplication(application)
        }
        
        if(applicationId) getOneApplication(applicationId)
    },[applicationId])

    const handleDelete = async ()=>{
      const deleteApplication = await applicationService.remove(applicationId)
      deleteApplication(applicationId)
      navigate('/')
    }
    if(!applicationId) return <h1>Loading ...</h1>
    if(!application) return <h1>Loading ...</h1>
  return (
    <div>
      <Link onClick={() => findApplicationsToUpdate(applicationId)} to={`/application/${applicationId}/update`}>Edit Application</Link> <br />
      <button onClick={handleDelete}>Delete Application</button>
    </div>
  )
}
export default ApplicationDetails