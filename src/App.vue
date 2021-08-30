<template>
  <v-app>
    <v-app-bar
        app
        color="white"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title class="cursor-pointer" @click="$router.push({name:'Home'})">
        {{ appName }}
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
              text
              plain
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
        app
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >

          <v-list-item :to="{name:'ManageCompanies'}">
            <v-list-item-icon>
              <v-icon>mdi-home-modern</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Companies
            </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'AllDepartments'}">
            <v-list-item-icon>
              <v-icon>mdi-theater</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Departments
            </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'AllEmployees'}">
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Employees
            </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'About'}">
            <v-list-item-icon>
              <v-icon>mdi-information-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              About
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
    drawer: true,
    group: null,
    appName: process.env.VUE_APP_NAME
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
