import * as getters from "./getters";
import * as actions from "./actions";
import * as TYPES from "./types";

const initState = () => ({
    playlists: [],
    playlist: {},
    toggleDialog: false,
    toggleDialogRemove: false,
    toggleRemoveSong: false,
    toggleService: false,
});

const mutations = {
    [TYPES.SET_PLAYLISTS]: (state, playlists) => state.playlists = playlists,

    [TYPES.SET_PLAYLIST]: (state, playlist) => state.playlist = playlist,

    [TYPES.SET_TOGGLE]: (state) => {
        state.toggleDialog = !state.toggleDialog;
    },

    [TYPES.SET_TOGGLE_REMOVE]: (state) => {
        state.toggleDialogRemove = !state.toggleDialogRemove;
    },

    [TYPES.SET_TOGGLE_REMOVE_SONG]: (state) => {
        state.toggleRemoveSong = !state.toggleRemoveSong;
    },

    [TYPES.SET_TOGGLE_SERVICE]: (state) => {
        state.toggleService = !state.toggleService;
    },

};

export default {
    namespaced: true,
    state: initState(),
    getters,
    actions,
    mutations,
};