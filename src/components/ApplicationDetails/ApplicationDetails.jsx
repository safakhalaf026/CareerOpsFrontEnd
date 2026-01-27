import { useState, useEffect } from "react"
import * as applicationService from '../../services/applicationService'
import { Link, useParams, useNavigate } from "react-router"
import styles from "./ApplicationDetails.module.css"

function ApplicationDetails({ findApplicationsToUpdate, deleteApplication }) {
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const { applicationId } = useParams()

  useEffect(() => {
    const getOneApplication = async (applicationId) => {
      const application = await applicationService.show(applicationId)
      setApplication(application)
    }

    if (applicationId) getOneApplication(applicationId)
  }, [applicationId])

  const formatDate = (getDate) => {
    if (!getDate) return "—"
    const date = new Date(getDate)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString()
  }

  const handleDelete = async () => {
    await applicationService.remove(applicationId)
    deleteApplication(applicationId)
    navigate('/application/all')
  }
  if (!applicationId) return <h1>Loading ...</h1>
  if (!application) return <h1>Loading ...</h1>
  return (
<main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.company}>{application.companyName}</h1>
          <p className={styles.role}>{application.roleTitle}</p>
        </div>

        <div className={styles.badge}>{application.stage}</div>
      </header>

      <section className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>Source</span>
          <span className={styles.value}>{application.jobSource || "—"}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Applied Date</span>
          <span className={styles.value}>{formatDate(application.appliedDate)}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Last Stage Change</span>
          <span className={styles.value}>{formatDate(application.lastStageChangeAt)}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>HR Screen Date</span>
          <span className={styles.value}>{formatDate(application.hrScreenDate)}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.sectionTitle}>Next Action</div>

        <div className={styles.row}>
          <span className={styles.label}>Type</span>
          <span className={styles.value}>{application.nextActionType || "—"}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>{formatDate(application.nextActionDate)}</span>
        </div>

        {application.nextActionNote ? (
          <div className={styles.noteBox}>
            <div className={styles.noteTitle}>Note</div>
            <div className={styles.noteText}>{application.nextActionNote}</div>
          </div>
        ) : null}

        {application.stage === "Rejected" ? (
          <>
            <div className={styles.divider} />
            <div className={styles.sectionTitle}>Rejection</div>

            <div className={styles.row}>
              <span className={styles.label}>Reason</span>
              <span className={styles.value}>{application.rejectedReason || "—"}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Rejected At Stage</span>
              <span className={styles.value}>{application.rejectedStage || "—"}</span>
            </div>
          </>
        ) : null}

        {application.notes ? (
          <>
            <div className={styles.divider} />
            <div className={styles.sectionTitle}>Notes</div>
            <div className={styles.longText}>{application.notes}</div>
          </>
        ) : null}
      </section>

      <section className={styles.actions}>
        <Link
          className={styles.linkButton}
          onClick={() => findApplicationsToUpdate(applicationId)}
          to={`/application/${applicationId}/update`}
        >
          Edit Application
        </Link>

        <button className={styles.dangerButton} onClick={handleDelete}>
          Delete Application
        </button>
      </section>
    </main>
  )
}
export default ApplicationDetails