<template>
  <div>
    <span>{{ event.name }}</span>
    <p>{{ event.start }}</p>
  </div>
</template>

<script>
export default {
  name: "UserEvent",
  props: ['event']
}
</script>

