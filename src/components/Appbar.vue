<template>
  <div>
    <v-app-bar :color="selectedEvent.color" :height="isMobile ? '80':'150'" app dark class="header">
      <RouterLink to="/" class="mr-auto">
        <img :height="isMobile ? '60':'120'" alt="logo" src="@/assets/logo.svg"/>
      </RouterLink>
      <div v-if="!logged_user">
        <v-btn-toggle background-color="transparent">
          <v-btn @click="log_in_dialog=true; error=null">Zaloguj się</v-btn>
          <v-btn @click="sign_in_dialog=true; error=null">Zarejestruj się</v-btn>
        </v-btn-toggle>
      </div>
      <div v-else class="d-flex align-center ">
        <h2 class="mr-10">Witaj, {{ logged_user.firstName }}, zapisz się na zajęcia</h2>

        <v-btn-toggle background-color="transparent">
          <v-btn v-if="!logged_user.isAdmin" @click="showUserEvents">Moje zajęcia</v-btn>
          <v-btn v-if="logged_user.isAdmin" @click="handleAddButton">Dodaj</v-btn>
          <v-btn @click="logout">Wyloguj</v-btn>
        </v-btn-toggle>
      </div>

    </v-app-bar>
    <v-dialog v-model="log_in_dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="submit_log_in">
          <v-card-title>
            <span class="headline">Zaloguj się</span>
          </v-card-title>
          <v-alert v-if="error" dense text type="error">
            {{ error }}
          </v-alert>
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
    <v-dialog v-model="user_events_dialog" max-width="600px" class="dialog user-events-dialog">
      <v-card>
        <v-card-title>
          <span class="headline">Moje zajęcia</span>
        </v-card-title>
        <div v-if="user_events.length === 0" class="pb-10">Nie masz jeszcze żadnych zajęć</div>
        <UserEvent v-for="event in user_events" :key="event.id" :event="event"/>
        <small v-if="user_events.length" class="pb-10">Jeżeli chcesz zrezygnować z zajęć poinformuj
          nas o tym telefonicznie <a
              href="tel:513-922-938">513-922-938</a></small>

      </v-card>
    </v-dialog>
    <v-dialog v-model="sign_in_dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="submit_sign_in">
          <v-card-title>
            <span class="headline">Zarejstruj się</span>
          </v-card-title>
          <v-alert v-if="error" dense text type="error">
            {{ error }}
          </v-alert>
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
    <v-dialog v-model="add_dialog" max-width="700px">
      <v-card>
        <form @submit.prevent="submit_add">
          <v-card-title>
            <span class="headline">Dodaj</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" sm="12">
                  <v-combobox
                      v-model="add_modal_selected_event[0]"
                      :items="classes"
                      :value="add_modal_selected_event"
                      label="zajecia"
                      @input="handleSelectEvent"
                  />
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-text-field v-model="add_modal_selected_event.name" label="Nazwa" required>

                  </v-text-field>
                </v-col>
                <v-col cols="6" md="6" sm="6">
                  <v-text-field v-model="add_modal_selected_event.teacher"
                                label="Prowadzący"
                                required>

                  </v-text-field>
                </v-col>
                <v-col cols="6" md="6" sm="6">
                  <v-text-field v-model="add_modal_selected_event.who"
                                label="dla kogo"
                                required>

                  </v-text-field>
                </v-col>
                <v-col cols="6" md="3" sm="3">
                  <v-text-field v-model="add_modal_selected_event.time"
                                label="Czas"
                                required>

                  </v-text-field>
                </v-col>

                <v-col cols="6" md="3" sm="3">
                  <v-select
                      v-model="add_modal_selected_event.color"
                      :items="colors"
                      label="Kolor"
                  >
                  </v-select>
                </v-col>
                <v-col cols="6" md="3" sm="3">
                  <v-text-field
                      v-model="add_modal_selected_event.seats"
                      label="Miejsc"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="3" sm="3">
                  <v-text-field
                      v-model="add_modal_selected_event.price"
                      label="Cena"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="add_modal_selected_event.short"
                      label="opis"
                      required
                  ></v-text-field>

                </v-col>

                <v-col cols="12" sm="6">
                  <datetime
                      v-model="add_modal_selected_event.start" :minute-step="15"
                      input-format="YYYY-MM-DD HH:mm"
                      placeholder="Start"
                      required="true"
                      type="datetime"
                  ></datetime>
                </v-col>
                <v-col cols="12" sm="6">

                  <datetime
                      v-model="add_modal_selected_event.end"
                      :minute-step="15"
                      input-format="YYYY-MM-DD HH:mm"
                      placeholder="Koniec"
                      required="true"
                      type="datetime"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="add_dialog = false">Anuluj</v-btn>
            <v-btn type="submit">Zapisz</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { auth, db } from '@/main.js';
import { Datetime } from 'vue-datetime';
import moment from 'moment';
import UserEvent from '@/components/UserEvent';

const modal_event_factory = {
  teacher: null,
  color: null,
  start: null,
  seats: null,
  details: null,
  name: null,
  end: null,
  time: null,
  who: null,
};
export default {
  name: 'Appbar',
  props: ['selectedEvent', 'isMobile', 'classes', 'colors'],
  components: { UserEvent, datetime: Datetime },

  data() {
    return {
      log_in_dialog: false,
      sign_in_dialog: false,
      add_dialog: false,
      user_events_dialog: false,
      error: '',
      add_modal_selected_event: {
        ...modal_event_factory,
      },
      user_events: [],
      user: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
      },
      errors: {
        'auth/invalid-email': 'Proszę podać poprawny adres email',
        'auth/weak-password': 'Hasło musi mieć co najmniej 6 znaków',
        'auth/email-already-in-use': 'Użytkownik już istnieje'
      }
    }

  },
  computed: {
    ...mapGetters(['logged_user', 'events'])
  },
  mounted() {
    auth.onAuthStateChanged(async (user) => {
      if (!user || (user && !user.uid)) return
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        const user = doc.data();
        this.setUser(user)
      }
    });
  },
  methods: {
    ...mapActions(['setUser']),
    //rejestracja
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
          email: this.user.email,
        })
        this.sign_in_dialog = false;
        this.user = {};
      }
      catch (err) {
        this.error = this.errors[err.code];
      }
    },
    // end rejestracja

    // logowanie
    async submit_log_in() {
      try {
        const res = await auth.signInWithEmailAndPassword(this.user.email, this.user.password)
        if (!res) {
          this.error = 'Nie można było zalogować';
        }

        this.setUser(res.user)
        this.log_in_dialog = false;
        this.user = {};


      }
      catch (err) {
        this.error = 'Hasło jest nieprawidłowe lub taki użytkownik nie istnieje'
        this.user = {};
      }
    },
    //end logowanie

    // logout
    logout() {
      try {
        auth.signOut();
        this.setUser(null)
      }
      catch (err) {
        this.error = err
      }

    },
    //end logout

    //modal z dodwaniem zajec
    handleAddButton() {
      this.add_dialog = true;
      this.add_modal_selected_event = { ...modal_event_factory };
    },
    // dodawanie nowych zajec przez admina
    async submit_add() {
      const item = {
        name: this.add_modal_selected_event.name,
        color: this.add_modal_selected_event.color.value,
        start: moment(this.add_modal_selected_event.start).format('YYYY-MM-DD HH:mm'),
        end: moment(this.add_modal_selected_event.end).format('YYYY-MM-DD HH:mm'),
        details: this.add_modal_selected_event.short,
        seats: this.add_modal_selected_event.seats,
        teacher: this.add_modal_selected_event.teacher,
        price: this.add_modal_selected_event.price,
        time: this.add_modal_selected_event.time,
        who: this.add_modal_selected_event.who,
        reserved: 0,
        users: [],
      };

      await db.collection('schedule').doc().set(item);
      this.add_dialog = false;
      this.getEvents();
    },
    //end

    //modal z zapisami
    showUserEvents() {
      this.user_events_dialog = true;
      this.user_events = this.events.filter(event => {
        if (event.usersRef) {
          return event.usersRef.some(user_uid => {
            return this.logged_user.uid == user_uid
          })
        }
      })
    },
    //end

    handleSelectEvent(val) {
      if (typeof val === 'string') {
        this.add_modal_selected_event.name = val;
      } else {
        this.add_modal_selected_event = { ...val };
      }
    },
  }
}
</script>

