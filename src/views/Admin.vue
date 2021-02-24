<template>
  <div class="admin">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <form @submit.prevent="submit">
              <v-card-title>
                <span class="headline">Dodaj</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field label="Nazwa" required v-model="name">
                        >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        :items="colors"
                        label="Kolor"
                        v-model="color"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        :items="['5', '10', '15']"
                        label="Liczba miejsc"
                        v-model="seats"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="opis"
                        required
                        v-model="details"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="start 2021-02-15 10:00"
                        required
                        v-model="start"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="koniec 2021-02-15 11:00"
                        required
                        v-model="end"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false"> Anuluj </v-btn>
                <v-btn type="submit"> Zapisz </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </v-row>
      <v-app>
        <v-app-bar app dark height="150">
          <div class="d-flex align-center">
            <RouterLink to="/"
              ><img alt="logo" src="@/assets/logo.svg"
            /></RouterLink>
          </div>
          <v-spacer></v-spacer>

          <div v-if="user">
            <v-avatar class="mr-4" color="#C87072" size="56"
              >{{ user.email === "edytastaszowska@gmail.com" ? "ES" : "NM" }}
            </v-avatar>
            <v-btn @click="dialog = true">Dodaj</v-btn>
            <v-btn @click="logout">Wyloguj</v-btn>
          </div>
        </v-app-bar>
        <v-main>
          <v-form v-if="!user" @submit.prevent="login">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="password"
                    label="password"
                    required
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-alert v-if="error" border="top" color="red lighten-2" dark>
                    {{ error }}
                  </v-alert>
                  <v-btn type="submit">Log in</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-row v-if="user">
            <v-col
              v-for="item in schedule"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card shaped>
                <v-card-title> {{ item.name }}</v-card-title>
                <v-card-text>{{ item.start }}</v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-text
                  v-for="user in item.users"
                  :key="user.name"
                  v-html="user"
                ></v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-main>
      </v-app>
    </template>
  </div>
</template>


<script>
import { db } from "@/main.js";
import { auth } from "@/main.js";

export default {
  name: "Admin",
  data() {
    return {
      colors: ["#C87072", "#E79C00", "#6D2128"],
      dialog: false,
      password: "",
      email: "",
      error: null,
      user: null,
      schedule: [],
      name: "",
      color: "",
      seats: "",
      details: "",
      start: "",
      end: "",
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => (this.user = user));

    db.collection("schedule")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => this.schedule.push(doc.data()));
      });
  },
  methods: {
    login() {
      this.error = null;
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .catch((error) => {
          this.error = error;
        });
    },
    logout() {
      auth.signOut();
    },
    async submit() {
      const item = {
        name: this.name,
        color: this.color,
        start: this.start,
        end: this.end,
        details: this.details,
        seats: this.seats,
        reserved: 0,
        users: [],
      };

      console.log(item);

      await db.collection("schedule").doc().set(item);
      this.dialog = false;
    },
  },
};
</script>
