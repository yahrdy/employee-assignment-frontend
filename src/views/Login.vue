<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-row class="justify-center mx-0">
        <v-col md="8">
            <v-row class="justify-center">
                <v-card
                        tile
                        class="pa-5 col-sm-7 mt-10"
                >
                    <div class="warning py-5 px-3 mb-2" v-if="errors">
                        {{ errors }}
                    </div>
                    <span>Login with phone number</span>

          <validation-observer
              ref="observer"
          >
            <form @submit.prevent="step === 'otp' ? sendOtp() : submit()" class="text-center">
              <validation-provider
                  v-slot="{ errors }"
                  name="phone"
                  :rules="{ required: true, digits: 11, regex: '^(01[3-9])\\d{8}$'}"
              >
                <v-text-field
                    name="phone"
                    v-model="phone"
                    :counter="11"
                    :error-messages="errors"
                    label="Phone Number"
                    required
                ></v-text-field>
              </validation-provider>

              <validation-provider
                  v-slot="{ errors }"
                  name="name"
                  v-if="step === 'login' && newUser"
                  :rules="{required: true}"
              >
                <v-text-field
                    v-model="name"
                    :error-messages="errors"
                    label="Enter your name"
                    required
                ></v-text-field>
              </validation-provider>

              <validation-provider
                  v-slot="{ errors }"
                  name="otp"
                  v-if="step === 'login'"
                  :rules="{required: true}"
              >
                <v-text-field
                    v-model="otp"
                    :error-messages="errors"
                    label="Enter otp"
                    required
                ></v-text-field>
              </validation-provider>

              <v-btn
                  class="mr-4"
                  type="submit"
                  :disabled="!isValidForm || busy"
                  :loading="busy"
                  rounded
                  color="blue"
                  min-width="300"
              >
                {{ step === 'otp' ? 'Continue' : 'Login' }}
                <template v-slot:loader>
                  <span>Loading..</span>
                </template>
              </v-btn>
              <v-btn @click="sendOtp" class="mt-4" v-if="step === 'login'" text color="blue" small :disabled="!resend">Resend otp <span
                  v-if="!resend">Wait {{ wait }} seconds</span></v-btn>
            </form>
          </validation-observer>

        </v-card>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import {required, digits, max, min, regex} from 'vee-validate/dist/rules'
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import axios from "axios";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    name: '',
    phone: '',
    show: false,
    errors: '',
    busy: false,
    step: 'otp',
    otp: '',
    newUser: true,
    wait: 300,
  }),

  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
    }),
    resend() {
      return this.step === 'login' && this.wait < 1
    },
    form() {
      let formData = new FormData();
      formData.append('phone', this.phone)
      if (this.otp) {
        formData.append('otp', this.otp)
      }
      if (this.name) {
        formData.append('name', this.name)
      }
      return formData;
    },
    isValidPhone() {
      let re = /(01)[3-9]{1}\d{8}/;
      return re.test(this.phone);
    },
    isValidForm() {
      if (this.step === 'otp')
        return this.isValidPhone;
      else
        return (this.isValidPhone && this.name && this.otp.length === 4)
    }
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn',
      attempt: 'auth/attempt',
    }),
    sendOtp() {
      this.busy = true
      const url = 'login/otp'
      this.wait = 300
      axios.post(url, this.form).then((response) => {
        this.name = response.data.name
        if (response.data.phone)
          this.step = 'login'
        this.busy = false
        if (this.name) {
          this.newUser = false
        }
      }).catch(() => {

      })
    },
    submit() {
      this.busy = true
      const url = 'login'
      axios.post(url, this.form).then((response) => {
        this.attempt(response.data.token).then(() => {
          this.$router.push('/')
        })
      }).catch(() => {
        this.errors = 'Invalid OTP'
        this.busy = false
      })
    },
    finalize() {
      if (this.authenticated) {
        this.errors = '';
        this.busy = false;
        this.$router.push('/');
      } else {
        this.errors = 'Credential did not match. Please try again or register as a new user.'
        this.busy = false;
      }
    },
    clear() {
      this.phone = '';
      this.password = '';
      this.errors = '';
      this.busy = false;
      this.$refs.observer.reset();
    },
  },
  mounted() {
    setInterval(() => {
      this.wait--;
    }, 1000);
  },
}

setInteractionMode('eager');

extend('digits', {
  ...digits,
  message: '{_field_} needs to be {length} digits.',
})

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters',
})

extend('regex', {
  ...regex,
  message: '{_field_} format is not valid',
})

extend('min', {
  ...min,
  message: 'Minimum 6 characters',
})
</script>