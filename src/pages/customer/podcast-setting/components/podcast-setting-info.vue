<template>
  <v-container id="artist" fluid>
    <v-row justify="space-around">
      <v-card width="100%">
        <v-img height="320px">
          <v-card class="card d-flex">
            <v-avatar class="profile" color="brown" size="200">
              <v-img v-if="podcastInfo.thumbnail" :src="podcastInfo.thumbnail"></v-img>
              <span v-else class="white--text text-h1 mt font-weight-regular">{{
                avatar
              }}</span>
            </v-avatar>
            <v-card-title class="white--text d-block titleArtits">
              <p class="caption mb-7 font-weight-bold">Podcast Profile</p>
              <p class="display-3 font-weight-bold" @click="handleEdit">
                {{ podcastInfo.namePodcast }}
              </p>
              <p class="display-1 font-weight-bold">{{podcastInfo.fullNameUser}}</p>
            </v-card-title>
          </v-card>
        </v-img>
      </v-card>
    </v-row>
    <router-view class="px-7"></router-view>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "PodcastInfo",

  computed: {
    ...mapGetters("podcastSetting", ["podcastInfo"]),

    avatar() {
      return this.podcastInfo.namePodcast ? this.podcastInfo.namePodcast.charAt(0) : "";
    },
  },

  methods: {
    ...mapActions("podcastSetting", ["getInfoPodcast", "setToggleDialog"]),

    handleEdit() {
      this.setToggleDialog();
    },
  },

  async created() {
    await this.getInfoPodcast();
  },
};
</script>

<style lang="scss" scoped>
.card {
  padding: 30px;
  .titleArtits {
    & > h3 {
      margin-top: 10px;
    }
  }
}
</style>
