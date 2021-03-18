<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/admin">Admin</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
}

.row a {
  text-decoration: none;
  transition: 0.5s;

  &:hover {
    transform: rotateY(360deg);
  }
}

.v-card__text{
  max-width: 500px ;
  text-align: left;
}

.v-event-timed {
  display: flex;
  align-items: center;
  justify-content: center;
}

.white-font {
  color: white !important;
}

.v-toolbar__title {
  text-transform: uppercase;
}

@media (max-width: 800px) {

  .v-btn.v-size--default, .v-toolbar__title {
    font-size: 0.575rem !important;
  }

  .v-btn--round {
    height: 28px !important;
    width: 28px !important;
  }

  .v-calendar .v-event-timed-container {
    margin: 0 !important;
  }

  .v-event-timed {
    width: auto !important;
    font-size: 8px !important;
    z-index: 3;
  }

  .pl-1 {
    padding: 0 4px !important;

  }
}

</style>
