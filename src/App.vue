<template>
  <v-app>
    <v-app-bar
        app
        color="white"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title class="cursor-pointer" @click="$router.push({name:'Home'})">
        Product CRUD
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
          v-if="!authenticated"
          :to="({name:'Login'})"
          tile
          small
          text
          color="primary"
      >
        Login
      </v-btn>
      <v-btn
          v-if="!authenticated"
          :to="({name:'Register'})"
          tile
          small
          color="primary"
          text
          rounded
      >
        Register
      </v-btn>
      <v-tooltip key="logout" bottom v-else>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="logout"
          >
            <v-icon small color="red">mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Log out</span>
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Menu item 1
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Menu item 2
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Menu item 3
            </v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
  name: 'App',

  components: {},

  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated'
    })
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    })
  }
};
</script>
