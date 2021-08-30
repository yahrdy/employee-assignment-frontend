<template>
  <v-row class="justify-center mx-0">
    <v-col cols="12" md="6">
      <v-row class="justify-center">
        <v-card
            tile
            max-width="1000"
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
                    md="4"
                >
                  <v-text-field
                      v-model="employee.first_name"
                      :rules="nameRules"
                      label="Enter your first name*"
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                  <v-text-field
                      v-model="employee.middle_name"
                      label="Enter your middle name"
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                  <v-text-field
                      v-model="employee.last_name"
                      :rules="nameRules"
                      label="Enter your last name*"
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="employee.email"
                      :rules="emailRules"
                      :error-messages="response.email"
                      label="Enter your email*"
                      required
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="employee.password"
                      :rules="passwordRules"
                      label="Enter your password*"
                      required
                      :type="passwordVisible ? 'text' : 'password'"
                      :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="passwordVisible = !passwordVisible"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    md="6">
                  <v-select
                      :error-messages="ageErrorMessage"
                      :rules="requiredRules"
                      v-model="employee.age"
                      :items="ages" label="Age*"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-combobox
                      v-model="employee.interests"
                      :items="interests"
                      label="Interests"
                      multiple
                      clearable
                  ></v-combobox>
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
      employee: {
        first_name: '',
        middle_name: '',
        last_name: '',
        age: '',
        email: '',
        password: '',
        interests: [],
      },
      defaultEmployee: {
        first_name: '',
        middle_name: '',
        last_name: '',
        age: '',
        email: '',
        password: '',
        interests: [],
      },
      interests: [
        'Programming',
        'Drawing',
        'Designing',
        'Problem Solving',
        'Dancing',
        'Travelling'
      ],
      response: {},
      passwordVisible: false,
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      nameRules: [
        v => !!v || 'This is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => this.emailRegex.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
      ],
      requiredRules: [
        v => !!v || 'Age is required'
      ]
    }
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
    }),
    form() {
      let formData = new FormData()
      formData.append('first_name', this.employee.first_name)
      formData.append('middle_name', this.employee.middle_name)
      formData.append('last_name', this.last_name)
      formData.append('email', this.employee.email)
      formData.append('password', this.employee.password)
      formData.append('age', this.employee.age)
      formData.append('interests', this.employee.interests)
      return formData
    },
    isValidForm() {
      const isValidInfo = !!this.employee.first_name && !!this.employee.last_name && this.employee.age > 0
      const isValidEmail = this.emailRegex.test(this.employee.email)
      const isValidPassword = this.employee.password.length >= 6
      return isValidEmail && isValidPassword && isValidInfo
    },
    ages() {
      let ages = []
      for (let i = 18; i < 61; i++) {
        ages.push(i)
      }
      return ages
    },
    firstNameErrorMessage() {
      return this.response.first_name ? this.response.first_name[0] : null
    },
    lastNameErrorMessage() {
      return this.response.last_name ? this.response.last_name[0] : null
    },
    middleNameErrorMessage() {
      return this.response.middle_name ? this.response.middle_name[0] : null
    },
    emailErrorMessage() {
      return this.response.email ? this.response.email[0] : null
    },
    passwordErrorMessage() {
      return this.response.password ? this.response.password[0] : null
    },
    ageErrorMessage() {
      return this.response.age ? this.response.age[0] : null
    },
    interestsErrorMessage() {
      return this.response.interests ? this.response.interests[0] : null
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
        this.attempt(response.data.accessToken).then(() => {
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
      this.employee = this.defaultEmployee
      this.errors = ''
      this.busy = false
      this.$refs.observer.reset();
    },
  },
  watch: {
    employee: {
      handler() {
        this.response = {}
      },
      deep: true
    }
  }
}
</script>