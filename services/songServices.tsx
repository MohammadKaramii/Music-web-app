import { Song } from "@/types";
import axios from "axios";
const SERVER_URL = "http://localhost:9000";

// @desc Get All Songs
// @route GET http://localhost:9000/songs
export const getAllSongs = () => {
    const url = `${SERVER_URL}/songs`;
    return axios.get(url);
};

// @desc Get All Artists
// @route GET http://localhost:9000/artists
export const getAllArtists = () => {
    const url = `${SERVER_URL}/artists`;
    return axios.get(url);
};


// @desc Get Song With Song ID
// @route GET http://localhost:9000/songs/:songId
export const getSongbyId = (songId:string) => {
    const url = `${SERVER_URL}/songs/${songId}`;
    return axios.get(url);
};

// @desc Get Liked Songs
// @route GET http://localhost:9000/songs?isLiked=true
export const getLikedSongs = () => {
    const url = `${SERVER_URL}/songs?isLiked=true`;
    return axios.get(url);
};

// @desc Get Songs waith Artist Name
// @route GET http://localhost:9000/songs?artist=${artistname}`
export const getSongsbyArtist = (artistName: string) => {
    const url = `${SERVER_URL}/songs?artist=${artistName}`;
    return axios.get(url);
};

// @desc Update Liked Songs
// @route Put http://localhost:9000/songs/:songId
export const updateIsLikeSong = (songId: string, updatedSong: Song) => {
    const url = `${SERVER_URL}/songs/${songId}`;
    return axios.put(url, updatedSong);
};

// @desc Upload new Song
// @route Post http://localhost:9000/songs
export const uploadNewSong = (newSongData: Song) => {
    const url = `${SERVER_URL}/songs`;
    return axios.post(url, newSongData);
};

