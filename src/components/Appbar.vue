<template>
  <div>
    <v-app-bar :color="selectedEvent.color" :height="isMobile ? '80':'150'" app dark>
      <div class="d-flex align-center mr-10">
        <RouterLink to="/">
          <img :height="isMobile ? '60':'120'" alt="logo" src="@/assets/logo.svg"/>
        </RouterLink>
      </div>
      <v-spacer></v-spacer>
      <v-row v-if="admin">
        <v-avatar
            class="mr-4" color="#C87072" size="56"
        >{{ admin.email === 'edytastaszowska@gmail.com' ? 'ES' : 'NM' }}
        </v-avatar>
        <v-btn-toggle background-color="transparent">
          <v-btn @click="handleAddButton">Dodaj</v-btn>
          <v-btn @click="logout">Wyloguj</v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row v-else-if="loggedUser">
        <h2>{{ loggedUser.email }}</h2>
        <v-btn-toggle background-color="transparent">
          <v-btn @click="showUserEvents">my events</v-btn>
          <v-btn @click="logout">Wyloguj</v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row v-else>
        <v-btn-toggle background-color="transparent">
          <v-btn @click="log_in_dialog=true">Zaloguj się</v-btn>
          <v-btn @click="sign_in_dialog=true">Zarejestruj się</v-btn>
        </v-btn-toggle>
      </v-row>

    </v-app-bar>
    <v-dialog v-model="log_in_dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="submit_log_in">
          <v-card-title>
            <span class="headline">Zaloguj się</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="user.email"
                      label="email"
                      name="email"
                      required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                      v-model="user.password"
                      label="Hasło"
                      name="password"
                      required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-checkbox
                  :color="selectedEvent.color"
                  label="Akceptuje RODO" required
              ></v-checkbox>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :color="selectedEvent.color"
                text
                @click="log_in_dialog = false"
            >
              Anuluj
            </v-btn>
            <v-btn :color="selectedEvent.color" dark type="submit">
              Potwierdź
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sign_in_dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="submit_sign_in">
          <v-card-title>
            <span class="headline">Zarejstruj się</span>
            <div v-if="error">{{ error }}</div>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="user.firstName"
                      label="Imię"
                      name="firstName"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="user.lastName"
                      label="Nazwisko"
                      name="lastName"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="user.phone"
                      label="Telefon"
                      name="phone"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="user.email"
                      label="email"
                      name="email"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="user.password"
                      label="Hasło"
                      name="password"
                      required
                  ></v-text-field>
                </v-col>

              </v-row>
              <v-checkbox
                  :color="selectedEvent.color"
                  label="Akceptuje RODO" required
              ></v-checkbox>
            </v-container>
            <small>Wszystkie pola są wymagane</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :color="selectedEvent.color"
                text
                @click="sign_in_dialog = false"
            >
              Anuluj
            </v-btn>
            <v-btn :color="selectedEvent.color" dark type="submit">
              Potwierdź
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth, db } from '@/main.js';

export default {
  name: 'Appbar',
  props: ['selectedEvent', 'isMobile'],
  data() {
    return {
      loggedUser: null,
      admin: null,
      log_in_dialog: false,
      sign_in_dialog: false,
      error: '',

      user: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged((user) => (this.loggedUser = user));
  },
  methods: {
    async submit_sign_in() {
      try {
        const res = await auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
        if (!res) {
          this.error = 'Nie można było zarejstrować';
        }
        await db.collection('users').doc(res.user.uid).set({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          phone: this.user.phone,
          uid: res.user.uid,
          email: this.user.email
        })
        this.loggedUser = res.user
        this.sign_in_dialog = false;
      }
      catch (err) {
        this.error = err
      }
    },
    async submit_log_in() {
      try {
        const res = await auth.signInWithEmailAndPassword(this.user.email, this.user.password)
        if (!res) {
          this.error = 'Nie można było zalogować';
        }
        this.loggedUser = res.user
        this.log_in_dialog = false;
      }
      catch (err) {
        this.error = err
      }
    },
    logout() {
      try {
        auth.signOut();
      }
      catch (err){
        this.error = err
      }

    },
    showUserEvents(){
      console.warn('events');
    }
  }
}
</script>
