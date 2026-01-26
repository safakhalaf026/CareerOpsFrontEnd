import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/applications`
const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

// retrieve all applications
const index = async () => {
    try {
        const response = await axios.get(BASE_URL, authConfig())
        return response.data.applications
    } catch (err) {
        console.log(err)
    }
}

// retrieve ONE application
const show = async (applicationId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${applicationId}`, authConfig())
        return response.data.application
    } catch (error) {
        console.log(error)
    }
}

// create new application
const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, authConfig())

        return response.data.application
    } catch (error) {
        console.log(error)
    }
}

// edit application
const update = async (applicationId, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${applicationId}`, formData, authConfig())

        return response.data.application
    } catch (error) {
        console.log(error)
    }
}

// delete service
const remove = async (applicationId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${applicationId}`, authConfig())

        return response.data.application
    } catch (error) {
        console.log(error)
    }
}
export {
    index,
    show,
    create,
    update,
    remove
}