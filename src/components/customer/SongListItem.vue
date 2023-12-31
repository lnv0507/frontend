<template>
  <div @contextmenu.prevent="$refs.menu.open($event, 'Payload')">
    <ContextMenu ref="menu">
      <template>
        <ContextMenuItem v-if="type !== 'Q'" @click.native="addToQueue()">
          Add to queue
        </ContextMenuItem>
        <ContextMenuItem v-if="isAuthenticated" @click.native="addToPlaylist()">
          <div class="text-center">
            <v-menu open-on-hover top offset-x>
              <template v-slot:activator="{ on, attrs }">
                <v-card-text color="primary" dark v-bind="attrs" v-on="on">
                  Add to playlist
                </v-card-text>
              </template>

              <v-list>
                <v-list-item v-for="(item, index) in playlists" :key="index">
                  <v-list-item-title
                    style="cursor: pointer"
                    @click="
                      addSongToPlaylist({
                        playlistId: item.idPlaylist,
                        songId: song.songId,
                      })
                    "
                    >{{ item.namePlaylist }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </ContextMenuItem>
        <ContextMenuItem @click.native="handleRemoveToggle">
          Delete from playlist
        </ContextMenuItem>
      </template>
    </ContextMenu>
    <v-hover v-slot:default="{ hover }">
      <v-list color="#121212">
        <v-list-item link>
          <v-list-item-content class="py-5">
            <v-row class="align-center">
              <v-col
                cols="auto"
                v-if="isPlaying && currentSongId === song.songId"
              >
                <div class="icon">
                  <span />
                  <span />
                  <span />
                </div>
              </v-col>
              <v-col class="py-0 ml-2" cols="auto">
                <v-img
                  :src="song.thumbnail"
                  :width="type === 'result' ? 130 : 45"
                  :height="type === 'result' ? 130 : 45"
                >
                  <v-overlay absolute opacity="0" :value="hover">
                    <v-icon
                      v-if="isPlaying && currentSongId === song.songId"
                      style="cursor: pointer"
                      color="white"
                      :size="type === 'result' ? 75 : 25"
                      @click="handlePauseSong"
                      >mdi-pause-circle</v-icon
                    >
                    <v-icon
                      v-else
                      style="cursor: pointer"
                      color="white"
                      :size="type === 'result' ? 75 : 25"
                      @click="handlePlaySong"
                      >mdi-play-circle</v-icon
                    >
                  </v-overlay>
                </v-img>
              </v-col>
              <v-col>
                <v-list-item-title>
                  <strong v-if="type === 'result'">{{ song.name }}</strong>
                  <div v-else>{{ song.name }}</div>
                  <v-list-item-subtitle>
                    <router-link
                      :style="{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }"
                      class="text-decoration-none"
                      :to="{
                        name: 'Artist',
                        params: {
                          id: 1,
                        },
                      }"
                    >
                      {{ song.nameArtist }}
                    </router-link>
                  </v-list-item-subtitle>
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-list-item-content>

          <v-list-item-action :style="{ color: 'rgba(255, 255, 255, 0.7)' }">
            {{ duration }}
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-hover>
    <dialog-remove
      :dialog="openRemoveSong"
      :content="song.name"
      :handleCancel="handleRemoveToggle"
      :handleRemove="handleRemove"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { generateTime } from "@/utils/song-utils";
import ContextMenu from "../context-menu/ContextMenu.vue";
import ContextMenuItem from "../context-menu/ContextMenuItem.vue";
import DialogRemove from "../dialog-remove/dialogRemove.vue";
import { $rest } from "@/core/rest-client";
export default {
  name: "SongListItem",
  components: {
    ContextMenu,
    ContextMenuItem,
    DialogRemove,
  },
  props: {
    song: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  computed: {
    ...mapGetters("player", ["isPlaying", "currentSongId"]),
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("playlist", [
      "playlists",
      // "toggleRemoveSong",
      "toggleService",
    ]),

    toggleRemoveSong: {
      get() {
        return this.openRemoveSong;
      },

      set(newValue) {
        this.openRemoveSong = newValue;
      },
    },
  },
  data() {
    return {
      duration: null,
      openRemoveSong: false,
    };
  },
  methods: {
    ...mapActions("player", [
      "setPlaying",
      "playSongInQueue",
      "playSong",
      "addSong",
    ]),

    ...mapActions("playlist", ["addSongToPlaylist", "getPlaylistById"]),

    handlePlaySong() {
      this.$root.$emit("playAudio");
      if (this.currentSongId === this.song.songId) return;
      this.type === "Q"
        ? this.playSongInQueue(this.song)
        : this.playSong(this.song);
      this.setPlaying(true);
    },

    handleRemoveToggle() {
      this.$refs.menu.close();
      this.toggleRemoveSong = !this.openRemoveSong;
    },

    async handleRemove() {
      const playlistId = this.$route.params.id;

      const requestParams = {
        songId: this.song.songId,
        playlistId: playlistId,
      };

      const { success, message } = await $rest.delete(
        `/playlist/song`,
        requestParams
      );

      if (success) {
        this.toggleRemoveSong = !this.openRemoveSong;
        await this.getPlaylistById(playlistId);
      } else {
        this.$notice.error(message);
      }
    },

    handlePauseSong() {
      this.$root.$emit("pauseAudio");
      this.setPlaying(false);
    },

    addToQueue() {
      this.addSong({ song: this.song, isQueue: true });
      this.$refs.menu.close();
    },

    addToPlaylist() {
      this.$refs.menu.close();
    },
  },

  async created() {
    this.duration = await generateTime(this.song.link);
  },
};
</script>
<style lang="scss" scoped>
.icon {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 13px;
  height: 13px;
  span {
    width: 3px;
    height: 100%;
    background-color: greenyellow;
    border-radius: 3px;
    transform-origin: bottom;
    animation: bounce 2.2s ease infinite alternate;
    content: "";
    &:nth-of-type(2) {
      animation-delay: -2.2s; /* Start at the end of animation */
    }
    &:nth-of-type(3) {
      animation-delay: -3.7s; /* Start mid-way of return of animation */
    }
  }
}
@keyframes bounce {
  10% {
    transform: scaleY(0.3); /* start by scaling to 30% */
  }
  30% {
    transform: scaleY(1); /* scale up to 100% */
  }
  60% {
    transform: scaleY(0.5); /* scale down to 50% */
  }
  80% {
    transform: scaleY(0.75); /* scale up to 75% */
  }
  100% {
    transform: scaleY(0.6); /* scale down to 60% */
  }
}
</style>
