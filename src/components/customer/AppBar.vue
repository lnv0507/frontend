<template>
  <v-app-bar dark app>
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <v-btn
          class="mx-2 d-in"
          fab
          dark
          small
          color="black"
          @click="$router.go(-1)"
        >
          <v-icon dark> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn class="mx-2" fab dark small color="black" @click="$router.go(1)">
          <v-icon dark> mdi-chevron-right </v-icon>
        </v-btn>
      </v-col>
      <!-- Handle input search on AppBar. page Search -->
      <!-- start -->
      <v-row v-if="checkInputSearch()">
        <v-col class="py-0" cols="auto">
          <v-text-field
            clearable
            filled
            hide-details
            label="Search for Artists, songs, or podcasts"
            prepend-inner-icon="mdi-magnify"
            rounded
            @input="handleOnchangeSearchBox"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- end -->

      <!--  -->
      <v-col cols="auto" class="align-end">
        <!-- <v-btn
          v-if="isAuthenticated"
          class="ml-7 mr-5"
          :color="avatar ? null : 'brown'"
          fab
          dark
        > -->

        <v-menu
          v-if="isAuthenticated"
          class="ml-7 mr-5"
          :color="avatar ? null : 'brown'"
          fab
          dark
          bottom
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-row align="center">
            <span class=" mr-5"> Hi, {{ fullName }}</span>
            <v-btn icon x-large v-on="on">
              <v-avatar color="brown" size="48">
                <v-img v-if="avatar" :src="avatar" alt="avatar"></v-img>
                <span v-else class="white--text text-h5 mt">{{
                  defaultAvatar
                }}</span>
              </v-avatar>
            </v-btn>
            </v-row>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-btn depressed rounded text to="/user">
                  Account Settings
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text to="/artist-setting">
                  Artist Settings
                </v-btn>
                <!-- <v-divider class="my-3"></v-divider> -->
                  <!-- <v-btn depressed rounded text to="/podcast-setting">
                    Podcast Settings
                  </v-btn> -->
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="handleLogout()">
                  Logout
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
        <!-- </v-btn> -->
        <v-btn
          v-else
          :to="{ name: 'Login' }"
          class="ml-7 mr-5"
          color="pink"
          dark
        >
          Login
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { debounce } from "lodash";
export default {
  name: "AppBar",

  computed: {
    ...mapGetters("auth", ["fullName", "avatar", "isAuthenticated"]),

    defaultAvatar() {
      return this.fullName ? this.fullName.charAt(0) : "";
    },
  },

  methods: {
    ...mapActions("search", ["getSearchData"]),
    ...mapActions("auth", ["logout"]),

    handleOnchangeSearchBox: debounce(async function (event) {
      await this.getSearchData(event || "");
    }, 1000),

    checkInputSearch() {
      if (this.$route.name === "Search") return true;
      return false;
    },

    async handleLogout() {
      await this.logout();
      this.$router.go(this.$router.currentRoute);
    },
  },
  async created() {
    this.checkInputSearch();
  },
};
</script>
