<template>
  <div class="home">
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" md="8">
          <v-card
              class="mt-10"
              color="#385F73"
              dark
          >
            <v-card-title v-if="authenticated" class="justify-end">Hello, {{ user.first_name }}!</v-card-title>
            <v-card-title class="headline">
              Welcome to BogSoft!
            </v-card-title>
            <v-card-subtitle v-if="!authenticated">Please login or register to go to the next step.</v-card-subtitle>
            <v-card-subtitle v-else>Now you can manage this website. Please choose from the left menu.
            </v-card-subtitle>
            <v-card-actions>
              <v-btn v-if="!authenticated" text :to="{name: 'Login'}">
                Login
              </v-btn>
              <v-btn v-if="!authenticated" text :to="{name: 'Register'}">
                Register
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name: 'Home',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user'
    })
  }
}
</script>
