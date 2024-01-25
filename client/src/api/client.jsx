import axios from "axios";

const member = axios.create({
    baseURL: "http://localhost:5002/api",
});

export default member;  