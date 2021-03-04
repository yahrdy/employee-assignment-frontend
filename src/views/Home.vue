<template>
  <div class="home">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card
              color="#385F73"
              dark
          >
            <v-card-title v-if="authenticated" class="justify-end">Hello, {{ user.name }}!</v-card-title>
            <v-card-title class="headline">
              Welcome to product CRUD application!
            </v-card-title>
            <v-card-subtitle v-if="!authenticated">Please login or register to go to the next step.</v-card-subtitle>
            <v-card-subtitle v-else>Now you can manage products. Click 'MANAGE PRODUCTS' button to continue.
            </v-card-subtitle>
            <v-card-actions>
              <v-btn v-if="!authenticated" text :to="{name: 'Login'}">
                Login
              </v-btn>
              <v-btn v-if="!authenticated" text :to="{name: 'Register'}">
                Register
              </v-btn>
              <v-btn v-else :to="{name: 'ManageProducts'}" color="yellow" text>
                Manage Products
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
