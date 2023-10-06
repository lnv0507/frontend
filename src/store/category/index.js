import * as getters from "./getters";
import * as actions from "./actions";
import * as TYPES from "./types";
import _ from 'lodash';

const initState = () => ({
    selected: {},
    categoriesObj: {},
    categoriesClient: [],
    songs: [],
});

const mutations = {
    [TYPES.SET_SELECTED]: (state, item) => state.selected = _.cloneDeep(item),

    [TYPES.SET_CATEGORIES]: (state, categoriesObj) => state.categoriesObj = {...categoriesObj},

    [TYPES.SET_CATEGORIESCLIENT]: (state, categoriesClient) => state.categoriesClient = [...categoriesClient],
    [TYPES.SET_SONGS]: (state, songs) => state.songs = [...songs]
};

export default {
    namespaced: true,
    state: initState(),
    getters,
    actions,
    mutations,
};