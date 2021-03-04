<template>
  <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="500"
  >
    <template slot="progress">
      <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
      ></v-progress-linear>
    </template>

    <v-img
        v-if="product.image"
        height="300"
        :src="product.image"
    ></v-img>

    <v-card-title>{{ product.title }}</v-card-title>

    <v-card-text>
      <v-row
          align="center"
          class="mx-0 mb-2"
      >
        <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
        ></v-rating>

        <div class="grey--text ml-4">
          4.5
        </div>
      </v-row>
      <div>{{ product.description }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "Product",
  data() {
    return {
      loading: false,
      product: '',
    }
  },
  methods: {
    initialize() {
      this.loading = true
      const url = 'products/' + this.$route.params.productId
      axios.get(url).then((response) => {
        this.loading = false
        this.product = response.data
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.initialize()
  }
}
</script>

<style scoped>

</style>