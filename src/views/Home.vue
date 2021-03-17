<template>
  <v-app>
    <v-app-bar :color="selectedEvent.color" :height="isMobile ? '80':'150'" app dark>
      <div class="d-flex align-center mr-10">
        <RouterLink to="/"
        ><img :height="isMobile ? '60':'120'" alt="logo" src="@/assets/logo.svg"
        /></RouterLink>
      </div>
      <v-toolbar-title v-if="!isMobile">Zapisz się na zajęcia</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row v-if="admin">
        <v-avatar class="mr-4" color="#C87072" size="56"
        >{{ admin.email === 'edytastaszowska@gmail.com' ? 'ES' : 'NM' }}
        </v-avatar>
        <v-btn-toggle>

          <v-btn @click="handleAddButton">Dodaj</v-btn>
          <v-btn @click="logout">Wyloguj</v-btn>
        </v-btn-toggle>
      </v-row>
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
                  @click="type = 'week'"
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
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
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
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text v-if="!admin">
                  <div>{{ selectedEventName }}</div>
                  <div>{{selectedEvent.name}}</div>

                  {{classes.sensoplastyka.short}}
                  <div>
                    Liczba miejsc:
                    <span v-html="selectedEvent.reserved"></span> /
                    <span v-html="selectedEvent.seats"></span>
                  </div>
                </v-card-text>
                <v-card-text v-if="admin">
                  <v-card-text
                      v-for="user in selectedEvent.users"
                      :key="user.name"
                      v-html="user"
                  ></v-card-text>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text
                         @click="selectedOpen = false">
                    Anuluj
                  </v-btn>
                  <v-btn-toggle v-if="!admin">
                    <v-btn
                        :color="selectedEvent.color"
                        :disabled="selectedEvent.reserved >= selectedEvent.seats"
                        class="white-font"
                        @click="openSignUpModal"
                    >
                      Zapisz
                    </v-btn>
                    <v-btn
                        v-if="selectedEvent.reserved >= selectedEvent.seats"
                        :color="selectedEvent.color"
                        class="white-font"
                        @click="openSignUpModal"
                    >
                      Lista rezerwowa
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn-toggle v-if="admin">
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
            <span class="headline">Zapisz się</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="client.firstName"
                      label="Imię"
                      name="firstName"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="client.surname"
                      label="Nazwisko"
                      name="surname"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="client.phone"
                      label="Telefon"
                      name="phone"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                      :items="['0-2', '2-4', '4-6']"
                      label="Wiek dziecka"
                      required
                  ></v-select>
                </v-col>
              </v-row>
              <v-checkbox :color="selectedEvent.color"
                          label="Akceptuje RODO" required></v-checkbox>
            </v-container>
            <small>Wszystkie pola są wymagane</small>
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
    <v-dialog v-model="add_dialog" max-width="700px">
      <v-card>
        <form @submit.prevent="submit_add">
          <v-card-title>
            <span class="headline">{{
                name ? 'edytuj' : 'dodaj'
              }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="2" sm="6">
                  <v-select
                      :items="classes"
                      label="zajecia"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="name" label="Nazwa" required>
                    >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="teacher" label="Prowadzący" required>
                    >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="2" sm="6">
                  <v-select
                      v-model="color"
                      :items="colors"
                      label="Kolor"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="2" sm="6">
                  <v-select
                      v-model="seats"
                      :items="['3','4','5','6','7','8','9','10']"
                      label="Miejsc"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="details"
                      label="opis"
                      required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <datetime v-model="start" :minute-step="15" input-format="YYYY-MM-DD HH:mm"
                            placeholder="Start"
                            required="true"
                            type="datetime"
                  ></datetime>
                </v-col>
                <v-col cols="12" sm="6">

                  <datetime v-model="end" :minute-step="15" input-format="YYYY-MM-DD HH:mm"
                            placeholder="Koniec"
                            required="true"
                            type="datetime"
                  ></datetime>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="add_dialog = false"> Anuluj</v-btn>
            <v-btn type="submit"> Zapisz</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { auth, db } from '@/main.js';
import { Datetime } from 'vue-datetime';
import colors from '../config/colors.js'
import classes from '../config/classes.js'
import moment from 'moment';

export default {

  name: 'App',
  components: { datetime: Datetime },
  data: () => ({
    colors,
    classes,
    admin: null,
    focus: '',
    type: 'week',
    typeToLabel: {
      month: 'Miesiąc',
      week: 'Tydzień',
      day: 'Dzień',
      '4day': '4 dni',
    },
    client: {
      firstName: '',
      surname: '',
      phone: '',
    },
    name: null,
    details: null,
    seats: 5,
    start: null,
    end: null,
    teacher: null,
    color: null,
    selectedEvent: {},
    events: [],
    selectedElement: null,
    selectedOpen: false,
    sign_up_dialog: false,
    add_dialog: false,
    alert: null,
    isMobile: false,
  }),

  beforeMount() {
    this.onResize();
    this.type = this.isMobile ? 'day' : 'week'
  },

  mounted() {
    auth.onAuthStateChanged((user) => (this.admin = user));
    this.getEvents();
  },

  methods: {
    async deleteClass(event) {
      if (confirm('Na pewno chcesz usunąć?')) {
        await db.collection('schedule')
        .doc(event.id)
        .delete();
        this.selectedOpen = false;
        this.getEvents();
      }
    },
    handleAddButton() {
      this.add_dialog = true;
      this.name = null;
      this.details = null;
      this.teacher = null;
      this.seats = 5;
      this.start = null;
      this.end = null;
      this.color = null;
    },

    async editClass(event) {
      this.selectedOpen = false;
      this.add_dialog = true;
      this.name = event.name;
      this.details = event.details;
      this.teacher = event.teacher;
      this.seats = event.seats;
      this.start = event.start;
      this.end = event.end;
      this.color = event.color;

      await db.collection('schedule')
      .doc(event)
      .update({
        name: this.name,
        color: this.color,
        details: this.details,
        seats: this.seats,
      });
    },
    logout() {
      auth.signOut();
    },
    async submit_add() {
      const item = {
        name: this.name,
        color: this.color || '#C87072',
        start: moment(this.start)
        .format('YYYY-MM-DD HH:mm'),
        end: moment(this.end)
        .format('YYYY-MM-DD HH:mm'),
        details: this.details,
        seats: this.seats,
        teacher: this.teacher,
        reserved: 0,
        users: [],
      };

      await db.collection('schedule')
      .doc()
      .set(item);
      this.add_dialog = false;
      this.getEvents();
    },

    async submit_sign_up() {
      const user =
          this.client.firstName +
          ' ' +
          this.client.surname +
          ' ' +
          `<a href="tel:${this.client.phone}">${this.client.phone}</a>`;
      await db
      .collection('schedule')
      .doc(this.selectedEvent.id)
      .update({
        reserved: this.selectedEvent.reserved + 1,
        users: [...this.selectedEvent.users, user],
      });

      this.sign_up_dialog = false;
      this.alert = this.selectedEvent.reserved >= this.selectedEvent.seats ? `Dziękujemy za zapisanie się na listę rezerwową ${this.cleint.firstName}. Jeżeli zwolni się miejsce skontaktujemy się z Tobą telefonicznie` : `Gratulacje ${this.firstName}! Widzimy się na zajęciach :)`;
      this.client.firstName = '';
      this.client.surname = '';
      this.client.phone = '';
      this.getEvents();
    },

    onResize() {
      this.isMobile = window.innerWidth < 1024;
    },
    openSignUpModal() {
      this.sign_up_dialog = true;
      this.selectedOpen = false;
    },
    async getEvents() {
      let snapshot = await db.collection('schedule')
      .get();
      let events = [];
      snapshot.forEach((doc) => {
        let eventData = doc.data();
        eventData.id = doc.id;
        events.push(eventData);
      });
      this.events = events;
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
                event
              }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedEventName = event.name;

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
