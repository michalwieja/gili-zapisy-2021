<template>
  <div v-if="user" class="user">
    <div class="name">
      {{ user.firstName }}
      {{ user.lastName }}
    </div>
    <div class="phone"><a href="tel:${user.phone }"> {{ user.phone }}</a></div>
    <v-btn @click="remove_user" class="white-font delete-btn"
           color="red">X
    </v-btn>
  </div>
</template>

<script>
import { db } from '@/main';
import { mapActions } from 'vuex';

export default {
  name: "User",
  props: ['id', 'users', 'event'],
  computed: {
    user() {
      return this.users.find(user => user.uid === this.id)
    }
  },
  methods: {
    ...mapActions(['fetchEvents']),

    async remove_user() {
      await db.collection('schedule').doc(this.event.id).update({
        usersRef: this.event.usersRef.filter(user => user !== this.id),
        reserved: this.event.reserved -= 1
      });
      this.fetchEvents()
    }
  }
}
</script>

<style lang="scss">
.user {
  display: flex;

  .name {
    min-width: 150px;
  }

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
