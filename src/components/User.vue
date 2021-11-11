<template>
  <div v-if="user" class="user">
    <div :class="index +1 > event.seats && 'disabled'" class="name d-flex">
      <div class="mr-1" style="width: 15px">
        {{ index + 1 }}
      </div>
      <div>
        <div>{{ user.firstName }} {{ user.lastName }}</div>
        <div class="text-caption">
          {{ user.email }}
        </div>
      </div>
      <div class="phone ml-auto"><a href="tel:${user.phone }"> {{ user.phone }}</a></div>
      <v-btn
          class="white-font delete-btn ml-2"
          color="red"
          style="width: 35px"
          @click="remove_user"
      >
        X
      </v-btn>

    </div>

  </div>
</template>

<script>
import { db } from '@/main';
import { mapActions } from 'vuex';

export default {
  name: 'User',
  props: ['id', 'users', 'event', 'index'],
  computed: {
    user() {
      return this.users.find(user => user.uid === this.id);
    }
  },
  methods: {
    ...mapActions(['fetchEvents', 'fetchUsers']),

    async remove_user() {
      await db.collection('schedule')
          .doc(this.event.id)
          .update({
            usersRef: this.event.usersRef.filter(user => user !== this.id),
          });
      await this.fetchEvents();
      await this.fetchUsers();
    }
  }
};
</script>

<style lang="scss">
.user {
  display: grid;
  grid-template-columns: 1fr auto auto;

  .name {
    min-width: 150px;

    & > span {
      padding: 0 10px;
    }
  }

  .phone {
    padding: 0 20px;
    margin-left: auto;
  }

  .delete-btn {
    margin-left: auto;
    background-color: crimson;
    color: white;
    height: 26px !important;
    min-width: 30px !important;
    padding: 0 10px !important;
  }
}

@media (max-width: 800px) {

  .user {
    .name {
      min-width: 125px !important;

      & > span {
        padding: 0 2px !important;
      }
    }
  }
}
</style>
