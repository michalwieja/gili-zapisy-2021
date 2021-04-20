<template>
  <div v-if="user" class="user">
    <div class="name">
      {{ user.firstName }}
      {{ user.lastName }}
    </div>
    <div class="phone"><a href="tel:${user.phone }"> {{ user.phone }}</a></div>
    <v-btn class="white-font delete-btn"
           color="red" disabled>X
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "User",
  props: ['id', 'users'],
  computed: {
    user() {
      return this.users.find(user => user.uid === this.id)
    }
  }
}
</script>

<style lang="scss">
.user {
  display: flex;

  .phone {
    padding-left: 20px;
  }

  .delete-btn {
    margin-left: auto;
    background-color: crimson;
    color: white;

  }

}

</style>
