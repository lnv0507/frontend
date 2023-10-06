import * as getters from "./getters";
import * as actions from "./actions";
import * as TYPES from "./types"

const initState = () => ({
    artists: [],
});

const mutations = {

    [TYPES.SET_FOLLOWS](state, artists) {
        state.artists = [...artists]
    },

};

export default {
    namespaced: true,
    state: initState(),
    getters,
    actions,
    mutations,
};