import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import * as userAnalyticsService from '../../services/UserAnalyticsService'

const Dashboard = () => {
    // Access the user object from UserContext
    const { user } = useContext(UserContext)

    // Create state to store the dashboard analytics we'll receive from the backend
    const [analytics, setAnalytics] = useState(null) // store entire backend response
    const [kpis, setKpis] = useState(null) // stores response.kpis
    const [charts, setCharts] = useState(null) // stores response.charts
    const [loading, setLoading] = useState(true) // better UX
    const [error, setError] = useState('') // to prevent crashing

    // useEffect runs after the component renders
    // This is where we perform side effects like API calls
    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user) return 
            try {
                setLoading(true)
                setError('')
                // Make an authenticated API call to the backend userAna endpoint. The JWT token is automatically sent in the request headers inside the service function
                const data = await userAnalyticsService.analytics()
                // after data is fetched, it is set into the relevant state
                setAnalytics(data)
                setKpis(data.kpis)
                setCharts(data.charts)
            } catch (err) {
                console.log(err)
                setError(err?.response?.data?.message || err.message || 'Failed to load analytics')
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()

    }, [user]) // only fetch if after context loads the user from localStorage

    if (!user) return null
    if (loading) return <p>Loading dashboard...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h2>You currently have {kpis?.totalActiveApplications ?? 0} active applications </h2>
            <h2>Avg response time: {kpis?.avgResponseDays ?? 0} days</h2>
            <h2>Upcoming tasks: {kpis?.upcomingNextActions ?? 0}</h2>

            {/* Charts will use charts?.activeByStage, charts?.bySourcePie, etc */}
        </div>
    )
}

export default Dashboard

