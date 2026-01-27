import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as applicationService from '../../services/applicationService'
import styles from './ApplicationForm.module.css'

function ApplicationForm({ updateApplication, applicationToUpdate }) {
    const navigate = useNavigate()
    const { applicationId } = useParams()
    const isEdit = Boolean(applicationId) // to define wether certain fields show based on create or update
    const [formState, setFormState] = useState(applicationToUpdate ? applicationToUpdate : {
        companyName: '',
        roleTitle: '',
        jobSource: '',
        jobUrl: '',
        stage: 'Applied',
        appliedDate: '',
        nextActionDate: '',
        nextActionType: '',
        nextActionNote: '',
        rejectedReason: '',
        notes: '',
    })

    useEffect(() => {
        const loadApplicationForEdit = async () => {
            if (!applicationId) return
            const latest = await applicationService.show(applicationId)
            if (!latest) return
            // format date input
            setFormState((prev) => ({
                ...prev,
                ...latest,
                appliedDate: latest.appliedDate ? latest.appliedDate.slice(0, 10) : '',
                nextActionDate: latest.nextActionDate ? latest.nextActionDate.slice(0, 10) : '',
            }))
        }
        loadApplicationForEdit()
    }, [applicationId])

    const {
        companyName, roleTitle, jobSource, jobUrl,
        stage, appliedDate, nextActionDate,
        nextActionType, nextActionNote, rejectedReason, notes
    } = formState

    // rules from schema to reflect shown fields
    const showNextActionFields = stage !== 'Applied' && stage !== 'Rejected'
    const showRejectedFields = stage === 'Rejected'

    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === 'stage') {
            const newStage = value
            setFormState((prev) => ({
                ...prev,
                stage: newStage,
                rejectedReason: newStage === 'Rejected' ? prev.rejectedReason : '',
                ...(newStage === 'Applied' || newStage === 'Rejected'
                    ? { nextActionDate: '', nextActionType: '', nextActionNote: '' }
                    : {}),
            }))
            return
        }
        setFormState((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            // build payload without backend computed fields
            const payload = {companyName, roleTitle, jobSource, jobUrl, stage, appliedDate, notes}

            // only include nextAction fields when showNextActionFields is truthy
            if (showNextActionFields) {
                payload.nextActionDate = nextActionDate
                payload.nextActionType = nextActionType
                payload.nextActionNote = nextActionNote
            }

            // only include rejectedReason when showRejectedFields is truthy
            if (showRejectedFields) {payload.rejectedReason = rejectedReason}

            if (isEdit) {
                const updated = await applicationService.update(applicationId, payload)
                if (!updated) throw new Error('Update failed')

                // optional: update parent state if you keep a list
                updateApplication?.(updated)

                navigate(`/application/${applicationId}`)
            } else {
                const created = await applicationService.create(payload)
                if (!created) throw new Error('Create failed')

                updateApplication?.(created)
                navigate(`/application/${created._id}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <main className={styles.main}>
            <h1>{isEdit ? 'Update Application' : 'Create Application'}</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label className={styles.label} htmlFor="companyName">Company Name:</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={companyName}
                        onChange={handleChange}
                        required/>
                </div>

                <div>
                    <label className={styles.label} htmlFor="roleTitle">Role Title:</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="roleTitle"
                        name="roleTitle"
                        value={roleTitle}
                        onChange={handleChange}
                        required/>
                </div>

                <div>
                    <label className={styles.label} htmlFor="jobSource">Job Source:</label>
                    <select
                        className={styles.select}
                        id="jobSource"
                        name="jobSource"
                        value={jobSource}
                        onChange={handleChange}
                        required>
                            <option value="">Select Source</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Job Board">Job Board</option>
                            <option value="Company Website">Company Website</option>
                            <option value="Referral">Referral</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Recruitment Agency">Recruitment Agency</option>
                            <option value="Career Fair">Career Fair</option>
                            <option value="Cold Application">Cold Application</option>
                    </select>
                </div>

                <div>
                    <label className={styles.label} htmlFor="jobUrl"> Job URL (optional):</label>
                    <input
                        className={styles.input}
                        type="url"
                        id="jobUrl"
                        name="jobUrl"
                        value={jobUrl}
                        onChange={handleChange}
                        placeholder="https://..."/>
                </div>

                <div>
                    <label className={styles.label} htmlFor="appliedDate">Applied Date:</label>
                    <input
                        className={styles.input}
                        type="date"
                        id="appliedDate"
                        name="appliedDate"
                        value={appliedDate}
                        onChange={handleChange}
                        required/>
                </div>

                <div>
                    <label className={styles.label} htmlFor="stage">Stage:</label>
                    <select
                        className={styles.select}
                        id="stage"
                        name="stage"
                        value={stage}
                        onChange={handleChange}>
                            {/* <option value="">Select Stage ('Applied' by default)</option> */}
                            <option value="Applied">Applied</option>
                            <option value="HR Screen">HR Screen</option>
                            <option value="HR Interview">HR Interview</option>
                            <option value="Technical Interview">Technical Interview</option>
                            <option value="Job Offer">Job Offer</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {showNextActionFields && (
                    <>
                        <div>
                            <label className={styles.label} htmlFor="nextActionDate">Next Action Date:</label>
                            <input
                                className={styles.input}
                                type="date"
                                id="nextActionDate"
                                name="nextActionDate"
                                value={nextActionDate}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div>
                            <label className={styles.label} htmlFor="nextActionType">Next Action Type:</label>
                            <select
                                className={styles.select}
                                id="nextActionType"
                                name="nextActionType"
                                value={nextActionType}
                                onChange={handleChange}
                                required>
                                <option value="">Select Type</option>
                                <option value="Follow-up Email">Follow-up Email</option>
                                <option value="Follow-up Call">Follow-up Call</option>
                                <option value="Scheduele Meeting">Scheduele Meeting</option>
                                <option value="Upcoming Interview">Upcoming Interview</option>
                                <option value="Upcoming Assessment">Upcoming Assessment</option>
                                <option value="Document Submission">Document Submission</option>
                                <option value="Thank-You Note">Thank-You Note</option>
                                <option value="Waiting Response">Waiting Response</option>
                                <option value="Micellaneous Reminder">Micellaneous Reminder</option>
                            </select>
                        </div>

                        <div>
                            <label className={styles.label} htmlFor="nextActionNote">Next Action Note (optional):</label>
                            <textarea
                                className={styles.input}
                                id="nextActionNote"
                                name="nextActionNote"
                                value={nextActionNote}
                                onChange={handleChange}/>
                        </div>
                    </>
                )}

                {showRejectedFields && (
                    <div>
                        <label className={styles.label} htmlFor="rejectedReason">Rejection Reason:</label>
                        <select
                            className={styles.select}
                            id="rejectedReason"
                            name="rejectedReason"
                            value={rejectedReason}
                            onChange={handleChange}
                            required>
                                <option value="">Select Reason</option>
                                <option value="Role Filled">Role Filled</option>
                                <option value="Lack of Experience">Lack of Experience</option>
                                <option value="Skill Mismatch">Skill Mismatch</option>
                                <option value="Failed Assesment">Failed Assesment</option>
                                <option value="Failed Interview">Failed Interview</option>
                                <option value="Salary Mismatch">Salary Mismatch</option>
                                <option value="Culture Fit">Culture Fit</option>
                                <option value="Overqualified">Overqualified</option>
                                <option value="Internal Candidate">Internal Candidate</option>
                                <option value="No Response">No Response</option>
                                <option value="Other">Other</option>
                        </select>
                    </div>
                )}

                <div>
                    <label className={styles.label} htmlFor="notes">Notes (optional):</label>
                    <textarea
                        className={styles.input}
                        id="notes"
                        name="notes"
                        value={notes}
                        onChange={handleChange}/>
                </div>
                <div>
                    <button className={styles.button} type="submit">
                        {isEdit ? 'Update Application' : 'Create Application'}
                    </button>
                    <button className={styles.button} type="button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    )
}

export default ApplicationForm