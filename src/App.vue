<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/admin">Admin</router-link>
    </div>
    <router-view />
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
.v-event-timed{
  display: flex;
  align-items: center;
  justify-content: center;
}
.white-font{
  color: white !important;
}

</style>
