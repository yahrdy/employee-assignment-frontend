<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="products"
        :options.sync="options"
        :server-items-length="totalProducts"
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
          <v-toolbar-title>Products</v-toolbar-title>
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
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  text
              >
                <v-icon>mdi-plus</v-icon>
                Add product
              </v-btn>
            </template>
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
                      >
                        <v-text-field
                            v-model="editedItem.title"
                            label="Product title"
                            :error-messages="errorMessages.title"
                            required
                        ></v-text-field>
                      </v-col>
                      <v-col
                          cols="12"
                      >
                        <v-textarea
                            v-model="editedItem.description"
                            label="Product description"
                            :error-messages="errorMessages.description"
                        ></v-textarea>
                      </v-col>
                      <v-col
                          cols="12"
                      >
                        <v-text-field
                            v-model="editedItem.price"
                            label="Price"
                            :error-messages="errorMessages.price"
                            required
                        ></v-text-field>
                      </v-col>
                      <v-col
                          cols="12"
                      >
                        <v-file-input
                            accept="image/*"
                            v-model="image"
                            label="Upload product image"
                        ></v-file-input>
                      </v-col>
                      <v-col cols="12">
                        <v-spacer></v-spacer>
                        <v-btn
                            color="red"
                            text
                            @click="close"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            type="submit"
                            :loading="busy"
                            :disabled="busy"
                        >
                          Save
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
      <template v-slot:item.title="{ item }">
        <router-link :to="{name: 'Product',params:{productId:item.id}}">{{ item.title }}</router-link>
      </template>
      <template v-slot:item.image="{ item }">
        <v-img :src="item.image" max-width="100" :alt="item.title"></v-img>
      </template>
      <template v-slot:item.updated_at="{ item }">
        {{ item.updated_at | date }}
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
      <template v-slot:no-data>
        <v-btn
            color="primary"
            @click="initialize"
        >
          Reset
        </v-btn>
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
  data: () => ({
    snackbar: false,
    busy: false,
    color: '',
    snackbarText: '',
    search: '',
    products: [],
    footerProps: {
      itemsPerPageOptions: [20, 50, 100, 500]
    },
    totalProducts: 0,
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
        text: 'Image',
        value: 'image'
      },
      {
        text: 'Title',
        value: 'title'
      },
      {
        text: 'Price',
        value: 'price'
      },
      {
        text: 'Last update',
        value: 'updated_at'
      },
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    editedIndex: -1,
    editedItem: {
      title: '',
      description: '',
      price: '',
    },
    defaultItem: {
      title: '',
      description: '',
      price: '',
    },
    errorMessages: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Product' : 'Edit Product'
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
      formData.append('title', this.editedItem.title)
      formData.append('description', this.editedItem.description)
      formData.append('price', this.editedItem.price)
      formData.append('image', this.image)
      return formData
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
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.loading = true
      const url = 'products?page=' + this.options.page + '&per_page=' + this.options.itemsPerPage + this.sortTerm + this.descTerm + this.searchTerm
      axios.get(url).then((response) => {
        this.loading = false
        this.products = response.data.data
        this.totalProducts = response.data.total
      }).catch(() => {
        this.loading = false
      })
    },

    editItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      const url = 'products/' + this.editedItem.id
      let editedIndex = this.editedIndex
      axios.delete(url).then(() => {
        this.products.splice(editedIndex, 1)
        this.closeDelete()
        this.color = 'red'
        this.snackbarText = 'Product deleted'
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
        const url = 'products/' + this.editedItem.id
        let editedIndex = this.editedIndex
        axios.post(url, this.form).then((response) => {
          Object.assign(this.products[editedIndex], response.data)
          this.close()
          this.color = 'green'
          this.snackbarText = 'Product updated'
          this.snackbar = true
          this.busy = false
        }).catch((error) => {
          this.errorMessages = error.response.data
        })
        Object.assign(this.products[this.editedIndex], this.editedItem)
      } else {
        this.busy = true
        const url = 'products/'
        axios.post(url, this.form).then((response) => {
          this.products.push(response.data)
          this.close()
          this.color = 'green'
          this.snackbarText = 'New product created'
          this.snackbar = true
          this.busy = false
        }).catch((error) => {
          this.errorMessages = error.response.data
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