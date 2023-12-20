import axios from "axios";
const SERVER_URL = "http://localhost:9000";

// @desc Get All Songs
// @route GET http://localhost:9000/songs
export const getAllSongs = () => {
    const url = `${SERVER_URL}/songs`;
    return axios.get(url);
};


// @desc Get Contact With Song ID
// @route GET http://localhost:9000/blogs/:blogId
export const getSongbyId = (id:string) => {
    const url = `${SERVER_URL}/songs/${id}`;
    return axios.get(url);
};

