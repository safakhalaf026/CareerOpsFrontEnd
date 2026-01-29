import { useContext, useState, useEffect, useMemo } from 'react'
import { UserContext } from '../../contexts/UserContext'
import * as userAnalyticsService from '../../services/UserAnalyticsService'
import { Bar, Pie, Line } from 'react-chartjs-2'
import styles from './Dashboard.module.css'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler)

const palette = ['#2D3A8C', '#1B998B', '#7C3AED', '#F97316', '#E11D48', '#0EA5E9',
    '#A3E635', '#F59E0B', '#14B8A6', '#64748B', '#8B5CF6', '#22C55E']

const hexToRgba = (hex, alpha = 0.25) => { // converting hexadecimal colors to RGBA
    const clean = hex.replace('#', '')
    const bigint = parseInt(clean, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const pickColors = (count) => Array.from({ length: count }, (_, i) => palette[i % palette.length]) // build array of colors 

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

    const themedCharts = useMemo(() => {
        if (!charts) return null

        // Active applications by stage (vertical bar) defining look
        const activeByStage = charts.activeByStage
            ? {
                ...charts.activeByStage,
                datasets: charts.activeByStage.datasets.map((dataset) => {
                    const barColors = pickColors(charts.activeByStage.labels?.length || 0)
                    return {
                        ...dataset,
                        backgroundColor: barColors.map((color) => hexToRgba(color, 0.55)),
                        borderColor: barColors,
                        borderWidth: 1,
                        borderRadius: 10,
                    }
                }),
            }
            : null

        // Applications by source (pie) defining look
        const bySourcePie = charts.bySourcePie
            ? {
                ...charts.bySourcePie,
                datasets: charts.bySourcePie.datasets.map((dataset) => {
                    const sliceColors = pickColors(charts.bySourcePie.labels?.length || 0)
                    return {
                        ...dataset,
                        backgroundColor: sliceColors.map((color) => hexToRgba(color, 0.65)),
                        borderColor: sliceColors,
                        borderWidth: 1,
                    }
                }),
            }
            : null

        // Rejection reasons (horizontal bar) defining look
        const rejectionReasonsHorizontal = charts.rejectionReasonsHorizontal
            ? {
                ...charts.rejectionReasonsHorizontal,
                datasets: charts.rejectionReasonsHorizontal.datasets.map((dataset) => {
                    const reasonColors = pickColors(charts.rejectionReasonsHorizontal.labels?.length || 0)
                    return {
                        ...dataset,
                        backgroundColor: reasonColors.map((color) => hexToRgba(color, 0.55)),
                        borderColor: reasonColors,
                        borderWidth: 1,
                        borderRadius: 10,
                    }
                }),
            }
            : null

        // Stage vs Source (stacked area line) defining look
        const stageVsSourceStackedArea = charts.stageVsSourceStackedArea
            ? {
                ...charts.stageVsSourceStackedArea,
                datasets: charts.stageVsSourceStackedArea.datasets.map((dataset, idx) => {
                    const color = palette[idx % palette.length]
                    return {
                        ...dataset,
                        borderColor: color,
                        backgroundColor: hexToRgba(color, 0.20),
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        fill: true,
                        tension: 0.35,
                    }
                }),
            }
            : null
        return { activeByStage, bySourcePie, rejectionReasonsHorizontal, stageVsSourceStackedArea }
    }, [charts])

    if (!user) return null
    if (loading) return <p className={styles.stateText}>Loading dashboard...</p>
    if (error) return <p className={styles.stateText}>{error}</p>

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.welcomeTitle}>Welcome {user?.displayName || user?.username}</h1>
                <h2 className={styles.activeCountTitle}>You currently have{' '}
                    <span className={styles.highlight}>{kpis?.totalActiveApplications ?? 0}</span>{' '}
                    active applications </h2>
            </header>
            <section className={styles.grid}>

{/* ===================== Active applications (by stage) in vertical bar chart =====================  */}
                <div className={`${styles.card} ${styles.stageBar}`}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Applications by stage</h3>
                        <p className={styles.cardSub}>Active applications only</p>
                    </div>

                    {themedCharts?.activeByStage && (
                        <div className={styles.chartWrap}>
                            <Bar data={themedCharts.activeByStage}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { enabled: true },
                                    },
                                    scales: {
                                        x: {
                                            grid: { display: false },
                                            ticks: { maxRotation: 0 },
                                        },
                                        y: {
                                            beginAtZero: true,
                                            grid: { color: 'rgba(0,0,0,0.06)' },
                                        },
                                    },
                                }} />
                        </div>
                    )}
                </div>

{/*  ====================================== Source of all applications in pie chart ======================================  */}
                <div className={`${styles.card} ${styles.sourcePie}`}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Applications by source</h3>
                        <p className={styles.cardSub}>All applications</p>
                    </div>

                    {themedCharts?.bySourcePie && (
                        <div className={`${styles.chartWrap} ${styles.pieWrap}`}>
                            <Pie data={themedCharts.bySourcePie}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 10,
                                                boxHeight: 10,
                                                padding: 10,
                                                font: { size: 10 },
                                            },
                                        },
                                    },
                                }} />
                        </div>
                    )}
                </div>

{/*  ====================================== KPI: Average response time ====================================== */}
                <div className={`${styles.card} ${styles.kpiRowCard}`}>
                    <div className={styles.kpiMini}>
                        <div className={styles.kpiTop}>Avg response</div>
                        <div className={styles.kpiValueSm}>{kpis?.avgResponseDays ?? 0}</div>
                        <div className={styles.kpiBottom}>days</div>
                    </div>

                    <div className={styles.kpiDivider} />
{/* ====================================== KPI: upcoming tasks ====================================== */}
                    <div className={styles.kpiMini}>
                        <div className={styles.kpiTop}>Upcoming tasks</div>
                        <div className={styles.kpiValueSm}>{kpis?.upcomingNextActions ?? 0}</div>
                        <div className={styles.kpiBottom}>due</div>
                    </div>
                </div>

{/* ===================== Comparison of stage VS source of all applications in stacked area line chart =====================  */}
                <div className={`${styles.card} ${styles.stageSource}`}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Stage vs Source</h3>
                        <p className={styles.cardSub}>How each source performs across stages</p>
                    </div>

                    {themedCharts?.stageVsSourceStackedArea && (
                        <div className={styles.chartWrap}>
                            <Line data={themedCharts.stageVsSourceStackedArea}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 10,
                                                boxHeight: 10,
                                                padding: 8,
                                                font: { size: 10 },
                                            }
                                        },
                                        tooltip: { enabled: true }
                                    },
                                    scales: {
                                        x: {
                                            stacked: true,
                                            grid: { display: false },
                                        },
                                        y: {
                                            stacked: true,
                                            beginAtZero: true,
                                            grid: { color: 'rgba(0,0,0,0.06)' },
                                        },
                                    },
                                }} />
                        </div>
                    )}
                </div>

{/* ===================== Rejected applications and reasons in horizontal bar chart =====================  */}
                <div className={`${styles.card} ${styles.rejection}`}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Rejection reasons</h3>
                        <p className={styles.cardMeta}>
                            Total rejections: {kpis?.totalRejectedApplications ?? 0}
                        </p>
                    </div>


                    {themedCharts?.rejectionReasonsHorizontal && (
                        <div className={styles.chartWrap}>
                            <Bar data={themedCharts.rejectionReasonsHorizontal}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    indexAxis: 'y',
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { enabled: true },
                                    },
                                    scales: {
                                        x: {
                                            beginAtZero: true,
                                            grid: { color: 'rgba(0,0,0,0.06)' },
                                        },
                                        y: { grid: { display: false } },
                                    },
                                }} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Dashboard
