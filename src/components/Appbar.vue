<template>
  <v-app-bar :color="selectedEvent.color" :height="isMobile ? '80':'150'" app dark>
    <div class="d-flex align-center mr-10">
      <RouterLink to="/"
      ><img :height="isMobile ? '60':'120'" alt="logo" src="@/assets/logo.svg"
      /></RouterLink>
    </div>
    <v-toolbar-title>Zapisz się na zajęcia on-line</v-toolbar-title>
    <div> {{ selectedEvent.id }}
    </div>
    <v-spacer></v-spacer>
    <div v-if="admin">
      <v-avatar class="mr-4" color="#C87072" size="56"
      >{{ admin.email === 'edytastaszowska@gmail.com' ? 'ES' : 'NM' }}
      </v-avatar>
      <v-btn-toggle>

        <v-btn @click="()=>{add_dialog = true; currentEvent = null}">Dodaj</v-btn>
        <v-btn @click="logout">Wyloguj</v-btn>
      </v-btn-toggle>
    </div>
    <v-row v-if="!admin" justify="space-around">
      <a a href="https://www.giligili.pl" target="_blank"
      >
        <v-icon large> mdi-application</v-icon>
      </a
      >
      <a href="https://www.facebook.com/giligilibawialnia/" target="_blank"
      >
        <v-icon large> mdi-facebook</v-icon>
      </a
      >
      <a href="https://www.instagram.com/giligili_bawialnia/" target="_blank"
      >
        <v-icon large> mdi-instagram</v-icon>
      </a
      >
      <a href="mailto:halo@giligili.pl">
        <v-icon large> mdi-email</v-icon>
      </a>
      <a href="tel:513-922-938">
        <v-icon large> mdi-cellphone</v-icon>
      </a>
    </v-row>
  </v-app-bar>

</template>

<script>
export default {
  name: 'Appbar',
  props: ['selectedEvent', 'isMobile', 'admin', 'logout']


}
</script>
