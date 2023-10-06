import * as TYPES from "./types";
import _ from "lodash";
import notice from "@/core/notice"

export const setPlaying = ({ commit }, isPlaying) => {
    commit(TYPES.SET_PLAYING, isPlaying);
}

export const playSong = ({ commit, getters }, song) => {
    setCurrentSong({ commit }, song);
    addSong({ commit, getters }, { song: song, isQueue: false });
}

export const playSongInQueue = ({ commit, getters }, song) => {
    const songs = getters.songs;
    const currentSong = getters.currentSong;
    // Remove current song and new current song
    const newSongs = songs.filter(e => e.songId !== currentSong.songId);
    commit(TYPES.SET_SONGS, newSongs);
    setCurrentSong({ commit }, song);
}

export const addSong = ({ commit, getters }, { song, isQueue }) => {
    const songs = getters.songs;
    const currentSong = getters.currentSong;
    const newSongs = songs.filter(s => s.songId !== song.songId);
    if (isQueue) {
        newSongs.push(song);
    } else {
        newSongs.unshift(song);
    }
    commit(TYPES.SET_SONGS, newSongs);
    if (_.isEmpty(currentSong)) {
        setCurrentSong({ commit }, song);
    }

    isQueue && notice.success('Add song to queue successfully');
}

export const setCurrentSong = ({ commit }, song) => {
    commit(TYPES.SET_CURRENT_SONG, song);
}

export const nextPrevSong = ({ commit, getters }, isNext) => {
    const songs = getters.songs;
    if (songs.length <= 1) return;
    const currentSong = getters.currentSong;
    const currentSongIndex = songs.findIndex(song => song.songId === currentSong.songId);
    let newCurrentSong;
    if (isNext) {
        newCurrentSong = currentSongIndex === songs.length - 1 ? songs[0] : songs[currentSongIndex + 1];
    } else {
        newCurrentSong = currentSongIndex === 0 ? songs[songs.length - 1] : songs[currentSongIndex - 1];
    }
    const newSongs = songs.filter(s => s.songId !== currentSong.songId);
    commit(TYPES.SET_SONGS, newSongs);
    commit(TYPES.SET_CURRENT_SONG, newCurrentSong);
}

export const playAll = ({ commit }, songs) => {
    if (songs && songs.length < 1) {
        notice.error('Not found any songs');
        return;
    }
    commit(TYPES.SET_SONGS, songs);
    commit(TYPES.SET_CURRENT_SONG, songs[0]);
    commit(TYPES.SET_PLAYING, true);
}