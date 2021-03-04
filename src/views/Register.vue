<template>
  <v-row class="justify-center mx-0">
    <v-col cols="12" md="6">
      <v-row class="justify-center">
        <v-card
            tile
            max-width="500"
            class="pa-5 mt-10 mx-auto"
        >
          <div class="overline mb-4 text-center" style="border-bottom: 2px solid dodgerblue">
            Register Form
          </div>
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="name"
                      :rules="nameRules"
                      label="Enter your name"
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      :error-messages="response.email"
                      label="Enter your email"
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      label="Enter your password"
                      required
                      :type="passwordVisible ? 'text' : 'password'"
                      :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="passwordVisible = !passwordVisible"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn
                      type="submit"
                      color="primary"
                      rounded
                      block
                      :disabled="!isValidForm || busy"
                      :loading="busy"
                  >
                    Register
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import axios from "axios";

export default {

  data() {
    return {
      busy: false,
      name: '',
      email: '',
      password: '',
      response: {},
      passwordVisible: false,
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      nameRules: [
        v => !!v || 'Name is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => this.emailRegex.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
    }),
    form() {
      let formData = new FormData()
      formData.append('name', this.name)
      formData.append('email', this.email)
      formData.append('password', this.password)
      return formData
    },
    isValidForm() {
      const isValidName = !!this.name
      const isValidEmail = this.emailRegex.test(this.email)
      const isValidPassword = this.password.length >= 6
      return isValidEmail && isValidPassword && isValidName
    }
  },
  methods: {
    ...mapActions({
      attempt: 'auth/attempt',
    }),
    submit() {
      this.busy = true
      const url = 'register'
      axios.post(url, this.form).then((response) => {
        this.busy = false
        this.attempt(response.data.token).then(() => {
          this.$router.push('/')
        })
      }).catch((error) => {
        this.response = error.response.data
        this.busy = false
      })
    },
    finalize() {
      if (this.authenticated) {
        this.errors = ''
        this.busy = false
        this.$router.push('/')
      } else {
        this.errors = 'Credential did not match. Please try again or register as a new user.'
        this.busy = false
      }
    },
    clear() {
      this.name = ''
      this.password = ''
      this.errors = ''
      this.busy = false
      this.$refs.observer.reset();
    },
  },
  watch: {
    form() {
      this.response = {}
    }
  }
}
</script>