<template>
  <v-app>
    <Appbar :selected-event="selectedEvent" :is-mobile="isMobile"
            :classes="classes" :colors="colors"/>
    <v-main>
      <v-row class="fill-height">
        <v-col>
          <!--          calendar menu-->
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn
                  v-if="!isMobile"
                  class="mr-4"
                  color="grey darken-2"
                  outlined
                  @click="handleCurrentWeekClick"
              >
                Obecny tydzień
              </v-btn>
              <v-btn color="grey darken-2" fab small text @click="prev">
                <v-icon small> mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn color="grey darken-2" fab small text @click="next">
                <v-icon small> mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="grey darken-2"
                      outlined
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Dzień</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Tydzień</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Miesiąc</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 dni</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <!--          end calendar menu-->
          <!--          calendar-->
          <v-sheet height="600">
            <v-alert v-if="alert" dense text type="success">
              {{ alert }}
            </v-alert>
            <v-calendar
                ref="calendar"
                v-model="focus"
                :event-color="getEventColor"
                :events="events"
                :first-interval="9"
                :interval-count="10"
                :type="type"
                color="#ddd"
                locale="pl"
                :weekdays="weekdays"
                @click:date="viewDay"
                @click:event="showEvent"
                @click:more="viewDay"
            ></v-calendar>
            <v-menu
                v-model="selectedOpen"
                :activator="selectedElement"
                :close-on-content-click="false"
                offset-x
            >
              <v-card v-if="selectedEvent.name" color="grey lighten-4" flat min-width="280px">
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title
                  >{{ selectedEvent.name }} | {{ selectedEvent.start }}
                  </v-toolbar-title>
                </v-toolbar>
                <v-card-text v-if="logged_user && logged_user.isAdmin">
                  <v-card-text v-if="selectedEvent.usersRef.length ===0">Jeszcze nikt
                    się nie zapisał :(
                  </v-card-text>
                  <v-card-text
                      v-for="(user, index) in selectedEvent.usersRef"
                      :key="user"
                  >
                    <User :id="user" :index="index" :users="users" :event="selectedEvent"/>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text v-for="user in selectedEvent.users" v-html="user" :key="user.id">
                  </v-card-text>
                </v-card-text>
                <v-card-text v-else-if="logged_user && !logged_user.isAdmin">
                  <h2>{{ selectedEvent.name }}</h2>
                  <br>
                  <div>Prowadząca: <b>{{ selectedEvent.teacher }}</b></div>
                  <div>Dla kogo: <b>{{ selectedEvent.who }}</b></div>
                  <div>Czas trwania: <b>{{ selectedEvent.time }}</b></div>
                  <div>Koszt: <b>{{ selectedEvent.price }}</b></div>
                  <br>
                  <div>opis: {{ selectedEvent.details }}</div>
                  <br>
                  <div>
                    Liczba zajętych miejsc: <b>
                    <span v-html="selectedEvent.usersRef.length"></span> /
                    <span v-html="selectedEvent.seats"></span></b>
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <h2>{{ selectedEvent.name }}</h2>
                  <br>
                  <div>Prowadząca: <b>{{ selectedEvent.teacher }}</b></div>
                  <div>Dla kogo: <b>{{ selectedEvent.who }}</b></div>
                  <div>Czas trwania: <b>{{ selectedEvent.time }}</b></div>
                  <div>Koszt: <b>{{ selectedEvent.price }}</b></div>
                  <br>
                  <div>opis: {{ selectedEvent.details }}</div>
                  <br>
                  <div>
                    Liczba zajętych miejsc: <b>
                    <span>{{ selectedEvent.usersRef.length }}</span> /
                    <span v-html="selectedEvent.seats"></span></b>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <div class="text-center" v-if="!logged_user">Zaloguj się lub zarejstruj aby móc
                    się zapisać
                  </div>
                  <v-btn-toggle v-if="logged_user && !logged_user.isAdmin">
                    <v-btn
                        :color="selectedEvent.color"
                        :disabled="selectedEvent.usersRef.length >= selectedEvent.seats"
                        class="white-font"
                        @click="openSignUpModal"
                    >
                      Zapisz
                    </v-btn>
                    <v-btn
                        v-if="selectedEvent.usersRef.length >= selectedEvent.seats"
                        :color="selectedEvent.color"
                        class="white-font"
                        @click="openSignUpModal"
                    >
                      Lista rezerwowa
                    </v-btn>
                    <v-btn
                        color="secondary" text
                        @click="selectedOpen = false"
                    >
                      Anuluj
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn-toggle v-if="logged_user && logged_user.isAdmin">
                    <v-btn
                        :color="selectedEvent.color"
                        class="white-font"
                        disabled
                        @click="()=>editClass(selectedEvent)"
                    >
                      Edytuj
                    </v-btn>
                    <v-btn
                        class="white-font"
                        color="red"
                        @click="()=>deleteClass(selectedEvent)"
                    >
                      Usuń
                    </v-btn>
                    <v-btn
                        color="secondary" text
                        @click="selectedOpen = false"
                    >
                      Anuluj
                    </v-btn>
                  </v-btn-toggle>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
          <!--          end calendar-->
        </v-col>
      </v-row>
    </v-main>
    <!--    dialogs-->
    <v-dialog v-model="sign_up_dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="submit_sign_up">
          <v-card-title>
            <span class="headline">{{ selectedEvent.name }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>{{ selectedEvent.start }}</v-row>
              <v-row>{{ selectedEvent.end }}</v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :color="selectedEvent.color"
                text
                @click="sign_up_dialog = false"
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
    <!--    end dialogs-->
  </v-app>
</template>

<script>
import { auth, db } from '@/main.js';
import colors from '../config/colors.js';
import classes from '../config/classes.js';
import Appbar from '@/components/Appbar';
import { mapGetters, mapActions } from 'vuex';
import User from '@/components/User';

export default {
  name: 'App',
  components: {
    User,
    Appbar
  },
  data: () => ({
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    colors,
    classes,
    focus: '',
    type: 'week',
    typeToLabel: {
      month: 'Miesiąc',
      week: 'Tydzień',
      day: 'Dzień',
      '4day': '4 dni',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    sign_up_dialog: false,
    alert: null,
    isMobile: false,
  }),

  computed: {
    ...mapGetters(['logged_user', 'events', 'users'])
  },

  beforeMount() {
    this.onResize();
    this.type = this.isMobile ? 'day' : 'week';
  },

  mounted() {
    auth.onAuthStateChanged((user) => (this.setUser(user)));
    this.fetchEvents();
    this.fetchUsers();
  },

  methods: {
    ...mapActions(['fetchEvents', 'fetchUsers', 'setUser']),

    async submit_sign_up() {
      await db.collection('schedule')
          .doc(this.selectedEvent.id)
          .update({
            usersRef: [...this.selectedEvent.usersRef, this.logged_user.uid],
          });

      this.sign_up_dialog = false;
      this.alert = this.selectedEvent.usersRef.length >= this.selectedEvent.seats ? `Dziękujemy za zapisanie się na listę rezerwową. Jeżeli zwolni się miejsce skontaktujemy się z Tobą telefonicznie` : `Gratulacje! Widzimy się na zajęciach :)`;
      await this.fetchEvents();
    },
    async deleteClass(event) {
      if (confirm('Na pewno chcesz usunąć?')) {
        await db.collection('schedule')
            .doc(event.id)
            .delete();
        this.selectedOpen = false;
        await this.fetchEvents();
        await this.fetchUsers();
      }
    },

    onResize() {
      this.isMobile = window.innerWidth < 1024;
    },
    openSignUpModal() {
      this.sign_up_dialog = true;
      this.selectedOpen = false;
    },

    handleCurrentWeekClick() {
      this.setToday();
      this.type = 'week';
    },
    getEventColor(ev) {
      return ev.color;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({
      nativeEvent,
      event,
    }) {
      const open = () => {
        this.selectedEvent = event;

        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
  },
};
</script>
