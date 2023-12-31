<template>
  <v-row justify="center">
    <v-dialog v-model="toggleDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <h3 class="display-1 font-weight-bold">Profile details</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form ref="formProfile" v-model="isValidProfileForm">
                  <v-row>
                    <v-col cols="12" sm="5">
                      <v-avatar class="ms-8" size="150" color="brown">
                        <v-img
                          v-if="checkAvatar"
                          :src="avatar"
                          alt="avatar"
                        ></v-img>
                        <span
                          v-else
                          class="white--text text-h2 mt font-weight-regular"
                          >{{ defaultAvatar }}</span
                        >
                      </v-avatar>
                      <v-file-input
                        :rules="rules"
                        @change="handleFileUpload"
                        accept="image/png, image/jpeg,  image/jpg"
                        placeholder="Pick an avatar"
                        label="Avatar"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="7">
                      <v-text-field
                        v-model="fullNameAccount"
                        label="Name"
                        placeholder="Add display name"
                        outlined
                        :rules="fullNameRules"
                        @keypress.enter="handleEditProfile()"
                      ></v-text-field>
                      <v-btn
                        class="float-right"
                        rounded
                        color="primary"
                        dark
                        @click="handleEditProfile()"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>

              <v-col cols="12">
                <small class="white--text font-weight-bold"
                  >By continuing, you agree to allow Jetstify to access the
                  images you have selected for upload. Please make sure you have
                  permission to upload images.</small
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleEdit"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { jsonToFormData } from "@/utils/rest-utils";
import { mapActions, mapGetters } from "vuex";
import { $rest } from "@/core/rest-client";
// import userStore from "@/store/user";

export default {
  name: "UserEditForm",

  data: () => ({
    dialog: false,
    isValidProfileForm: false,
    flagAvatar: true,
    flagName: true,
    linkAvatar: "",
    nameAccount: "",
    fileAvatar: null,
    rules: [
      (value) =>
        !value ||
        value.size < 3000000 ||
        "Avatar size should be less than 3 MB!",
    ],

    fullNameRules: [(v) => (!!v && !!v.trim()) || "Full name is required"],
  }),

  computed: {
    ...mapGetters("user", ["toggleDialog", "userInfo"]),

    checkAvatar() {
      if (this.flagAvatar) {
        return !!this.userInfo.avatar;
      }
      return !!this.linkAvatar;
    },

    defaultAvatar() {
      if (this.flagName) {
        return this.userInfo.fullName ? this.userInfo.fullName.charAt(0) : "";
      }

      return this.nameAccount.trim().charAt(0);
    },

    avatar: {
      get() {
        return this.linkAvatar ? this.linkAvatar : this.userInfo.avatar;
      },

      set(newValue) {
        if (newValue === null) {
          this.flagAvatar = true;
        } else {
          this.flagAvatar = false;
          this.linkAvatar = newValue;
        }
      },
    },

    fullNameAccount: {
      get() {
        return this.nameAccount ? this.nameAccount : this.userInfo.fullName;
      },

      set(newValue) {
        if (newValue === "") {
          this.nameAccount = " ";
        } else if (newValue === null) {
          this.flagName = true;
          this.nameAccount = newValue;
        } else {
          this.flagName = false;
          this.nameAccount = newValue;
        }
      },
    },
  },

  methods: {
    ...mapActions("user", ["setToggleDialog", "getInfoUser"]),
    ...mapActions("auth", ["updateUserInfo"]),

    handleEdit() {
      this.setToggleDialog();
      this.resetFormClose();
    },

    handleFileUpload(files) {
      let imgUrl;
      if (files) {
        this.fileAvatar = files;
        imgUrl = URL.createObjectURL(files);
      } else {
        this.fileAvatar = new File([""], "");
      }
      this.avatar = imgUrl;
    },

    async handleEditProfile() {
      this.$refs.formProfile.validate();
      if (!this.isValidProfileForm) {
        return;
      }

      const jsonObject = {
        fileImg: this.fileAvatar,
        userRequest: JSON.stringify({
          fullName: (this.nameAccount
            ? this.nameAccount
            : this.userInfo.fullName
          ).trim(),
        }),
      };

      const formData = jsonToFormData(jsonObject);

      const { success, message } = await $rest.upload("/user", formData);

      if (success) {
        this.handleEdit();
        await this.getInfoUser();
        const data = {
          fullName: this.userInfo.fullName,
          avatar: this.userInfo.avatar,
        };
        await this.updateUserInfo(data);
      } else {
        this.$notice.error(message);
      }
    },

    resetFormClose() {
      this.fullNameAccount = null;
      this.avatar = null;
      this.fileAvatar = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
