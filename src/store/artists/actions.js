import { $rest } from "@/core/rest-client";
import * as TYPES from "./types";
import notice from "@/core/notice";
// import { DELETE_SUCCESS, SAVE_SUCCESS } from "@/core/constants";


const USER = "/user";
const FOLLOW = "/follow"




export const getListArtistFollow = async({ commit }) => {
    const { success, data, message } = await $rest.get(
        `${USER}${FOLLOW}?type=ARTIST`
    );
    if (success) {
        commit(TYPES.SET_FOLLOWS, data);
    } else {
        notice.error(message);
    }
};