<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html{
  overflow-y: auto !important;
}

#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

.disabled {
  color: #aaa;
}

.row a {
  text-decoration: none;
  transition: 0.5s;

  &:hover {
    transform: rotateY(360deg);
  }
}

.v-card__text {
  max-width: 500px;
  text-align: left;
  padding: 10px !important;
}

.v-event-timed {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px !important;
}

.white-font {
  color: white !important;
}

.v-toolbar__title {
  text-transform: uppercase;
}

.pl-1{
  width: 100%;
  text-overflow:ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

@media (max-width: 800px) {
  .v-application {
    .header-content.align-center {
      flex-direction: column;
      align-items: flex-end !important;


      h2.mr-10 {
        font-size: 14px;
        margin-right: 0 !important;
        margin-bottom: 10px;
      }
    }
  }
  .v-card__text {
    font-size: 12px !important;
    padding: 6px !important;
  }


  .v-btn {
    height: 30px !important;
  }


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
    font-size: 14px !important;
    padding: 14px !important;
    z-index: 3;
  }

  .pl-1 {
    padding: 0 4px !important;

  }
}

//
//.v-calendar-daily__scroll-area::-webkit-scrollbar-track
//{
//  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//  border-radius: 10px;
//  background-color: #F5F5F5;
//}
//
//.v-calendar-daily__scroll-area::-webkit-scrollbar
//{
//  background-color: #F5F5F5;
//}
//
//.v-calendar-daily__scroll-area::-webkit-scrollbar-thumb
//{
//  border-radius: 10px;
//  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
//  background-color: #D62929;
//}

</style>
