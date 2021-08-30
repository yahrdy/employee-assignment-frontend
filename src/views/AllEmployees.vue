<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="employees"
        :options.sync="options"
        :server-items-length="totalEmployees"
        :footer-props="footerProps"
        :items-per-page="20"
        item-key="id"
        :search="search"
        class="elevation-1"
        :loading="loading"
        loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-toolbar-title>Employees</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <router-link :to="{name:'Home'}">Home</router-link>
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
          ></v-text-field>
          <v-dialog
              v-model="dialog"
              max-width="800px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="save">
                  <v-container>
                    <v-row>
                      <v-col
                          cols="12"
                          md="4"
                      >
                        <v-text-field
                            v-model="editedItem.first_name"
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
                            v-model="editedItem.middle_name"
                            label="Enter your middle name"
                        ></v-text-field>
                      </v-col>

                      <v-col
                          cols="12"
                          md="4"
                      >
                        <v-text-field
                            v-model="editedItem.last_name"
                            :rules="nameRules"
                            label="Enter your last name*"
                            required
                        ></v-text-field>
                      </v-col>

                      <v-col
                          cols="12"
                      >
                        <v-text-field
                            v-model="editedItem.email"
                            :rules="emailRules"
                            :error-messages="emailErrorMessage"
                            label="Enter your email*"
                            disabled
                        ></v-text-field>
                      </v-col>
                      <v-col
                          cols="12"
                          md="6">
                        <v-select
                            :error-messages="ageErrorMessage"
                            :rules="requiredRules"
                            v-model="editedItem.age"
                            :items="ages" label="Age*"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-combobox
                            v-model="editedItem.interests"
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
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
            color="blue"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            color="red"
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="color"
        bottom
        left
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from "axios";
import moment from 'moment'

export default {
  data() {
    return {
      snackbar: false,
      busy: false,
      color: '',
      snackbarText: '',
      search: '',
      employees: [],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      totalEmployees: 0,
      options: {
        page: 1,
        itemsPerPage: 20,
        sortBy: [],
        sortDesc: []
      },
      loading: false,
      image: null,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'First Name',
          value: 'first_name'
        },
        {
          text: 'Middle Name',
          value: 'middle_name',
        },
        {
          text: 'Last Name',
          value: 'last_name',
        },
        {
          text: 'Age',
          value: 'age',
        },
        {
          text: 'Interests',
          value: 'interests',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
      editedIndex: -1,
      editedItem: {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        age: '',
        interests: [],
      },
      defaultItem: {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        age: '',
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
      errorMessages: [],
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
    formTitle() {
      return this.editedIndex === -1 ? 'New Employee' : 'Edit Employee'
    },
    sortTerm() {
      if (this.options) {
        return this.options.sortBy[0] ? '&sort=' + this.options.sortBy[0] : ''
      } else return ''
    },
    descTerm() {
      if (this.options) {
        return this.options.sortDesc[0] ? '&desc=' + this.options.sortDesc[0] : ''
      } else return ''
    },
    searchTerm() {
      return this.search ? '&query=' + this.search : ''
    },
    form() {
      let formData = new FormData()
      if (this.editedIndex > -1) {
        formData.append('_method', 'PUT')
      }
      formData.append('first_name', this.editedItem.first_name)
      formData.append('middle_name', this.editedItem.middle_name || '')
      formData.append('last_name', this.editedItem.last_name)
      formData.append('age', this.editedItem.age)
      formData.append('interests', this.editedItem.interests)
      return formData
    },
    isValidForm() {
      const isValidInfo = !!this.editedItem.first_name && !!this.editedItem.last_name && this.editedItem.age > 0
      const isValidEmail = this.emailRegex.test(this.editedItem.email)
      return isValidEmail && isValidInfo
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
  watch: {
    options: {
      handler() {
        this.initialize()
      },
      deep: true,
    },
    search() {
      this.initialize()
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    editedItem: {
      handler() {
        this.response = {}
      },
      deep: true
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.loading = true
      const url = 'employees?page=' + this.options.page + '&per_page=' + this.options.itemsPerPage + this.sortTerm + this.descTerm + this.searchTerm
      axios.get(url).then((response) => {
        this.loading = false
        this.employees = response.data.data
        this.totalEmployees = response.data.total
      }).catch(() => {
        this.loading = false
      })
    },

    editItem(item) {
      this.editedIndex = this.employees.indexOf(item)
      item['password'] = ''
      item['interests'] = (item.interests && Array.isArray(item.interests) && item.interests.length > 0) ? item.interests.split(',') : []
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.employees.indexOf(item)
      item['password'] = ''
      item['interests'] = (item.interests && Array.isArray(item.interests) && item.interests.length > 0) ? item.interests.split(',') : []
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      const url = 'employees/' + this.editedItem.id
      let editedIndex = this.editedIndex
      axios.delete(url).then(() => {
        this.employees.splice(editedIndex, 1)
        this.closeDelete()
        this.color = 'red'
        this.snackbarText = 'Employee deleted'
        this.snackbar = true
      })
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        this.busy = true
        const url = 'employees/' + this.editedItem.id
        let editedIndex = this.editedIndex
        axios.post(url, this.form).then((response) => {
          Object.assign(this.employees[editedIndex], response.data)
          this.close()
          this.color = 'green'
          this.snackbarText = 'Employee updated'
          this.snackbar = true
          this.busy = false
        }).catch((error) => {
          this.response = error.response.data
        })
        Object.assign(this.employees[this.editedIndex], this.editedItem)
      } else {
        this.busy = true
        const url = 'employees'
        axios.post(url, this.form).then((response) => {
          this.employees.push(response.data)
          this.close()
          this.color = 'green'
          this.snackbarText = 'New employee created'
          this.snackbar = true
          this.busy = false
        }).catch((error) => {
          this.response = error.response.data
          this.busy = false
        })
      }
    },
  },
  filters: {
    date(value) {
      return moment(value).format('D MMM Y')
    }
  }
}
</script>