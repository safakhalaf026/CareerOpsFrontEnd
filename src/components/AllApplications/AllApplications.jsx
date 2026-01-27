import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import styles from "./AllApplications.module.css"


function AllApplications({ applications }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState("all") 
  const [stage, setStage] = useState("all")
  const [source, setSource] = useState("all")

  const activeStages = useMemo(() => ["Applied", "HR Screen", "HR Interview", "Technical Interview", "Job Offer"], [])
  const completedStages = useMemo(() => ["Accepted", "Rejected"], [])

  const stageOptions = useMemo(() => {
    const stage = new Set(applications.map(application => application.stage).filter(Boolean))
    return ["all", ...Array.from(stage)]
  }, [applications])

  const sourceOptions = useMemo(() => {
    const source = new Set(applications.map(application => application.jobSource).filter(Boolean))
    return ["all", ...Array.from(source)]
  }, [applications])

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      // status filter
      if (status === "active" && !activeStages.includes(app.stage)) return false
      if (status === "completed" && !completedStages.includes(app.stage)) return false

      // stage filter
      if (stage !== "all" && app.stage !== stage) return false

      // source filter
      if (source !== "all" && app.jobSource !== source) return false

      return true
    })
  }, [applications, status, stage, source, activeStages, completedStages])

  const formatDate = (getDate) => {
    if (!getDate) return "—"
    const date = new Date(getDate)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString()
  }

  const resetFilters = () => {
    setStatus("all")
    setStage("all")
    setSource("all")
  }

  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <h1>All Applications</h1>
        <div className={styles.countPill}>
          Showing <strong>{filtered.length}</strong> / {applications.length}
        </div>
      </div>

      <section className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.select}
            value={status}
            onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Stage</label>
          <select
            className={styles.select}
            value={stage}
            onChange={(event) => setStage(event.target.value)}>
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage === "all" ? "All stages" : stage}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Source</label>
          <select
            className={styles.select}
            value={source}
            onChange={(event) => setSource(event.target.value)}>
            {sourceOptions.map((src) => (
              <option key={src} value={src}>
                {src === "all" ? "All sources" : src}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className={styles.button} onClick={resetFilters} disabled={status === "all" && stage === "all" && source === "all"}>Reset</button>
      </section>

      {!filtered.length ? (
        <div className={styles.empty}>No applications found.</div>
      ) : (
        <section className={styles.grid}>
          {filtered.map((app) => (
            <div
              key={app._id}
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/application/${app._id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" ||event.key === " ") navigate(`/application/${app._id}`)
              }}>

              <div className={styles.cardTop}>
                <div className={styles.company}>{app.companyName}</div>
                <div className={styles.badge}>{app.stage}</div>
              </div>

              <div className={styles.role}>{app.roleTitle}</div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Source:</span>
                <span className={styles.metaValue}>{app.jobSource || "—"}</span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Applied:</span>
                <span className={styles.metaValue}>{formatDate(app.appliedDate)}</span>
              </div>

              {app.nextActionDate ? (
                <div className={styles.nextAction}>
                  <span className={styles.nextActionTitle}>Next action</span>
                  <span className={styles.nextActionValue}>
                    {formatDate(app.nextActionDate)}
                    {app.nextActionType ? ` • ${app.nextActionType}` : ""}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default AllApplications