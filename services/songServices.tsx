import axios from "axios";
const SERVER_URL = "http://localhost:9000";

// @desc Get All Songs
// @route GET http://localhost:9000/songs
export const getAllSongs = () => {
    const url = `${SERVER_URL}/songs`;
    return axios.get(url);
};

