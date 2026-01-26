import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/useranalytics`
const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

// retrieve user analytics
const analytics = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/summary`, authConfig())
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export {analytics}