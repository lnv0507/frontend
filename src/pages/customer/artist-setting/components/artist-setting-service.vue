<template>
  <v-container fluid>
    <v-menu transition="slide-y-transition" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-3" dark v-bind="attrs" v-on="on"> ... </v-btn>
      </template>
      <v-list>
        <v-list-item @click="handleCreate"
          >Upload music</v-list-item
        >
        <v-list-item @click="handleEdit">Edit profile</v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ArtistSettingService",

  methods: {
    ...mapActions("artistSetting", [
      "setToggleDialog",
      "setToggleDialogCreateSong",
    ]),

    handleEdit() {
      this.setToggleDialog();
    },

    handleCreate() {
      this.setToggleDialogCreateSong();
    },
  },
};
</script>

<style lang="scss"></style>
