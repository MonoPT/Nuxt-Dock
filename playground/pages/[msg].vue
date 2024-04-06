<template>
  <div class="cont">
    {{ useRoute().params.msg }}
  </div>
</template>

<script lang="ts" setup>
    //@ts-ignore
    import { useRoute } from '#vue-router';
</script>

<style lang="scss" scoped>
    .cont {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        place-items: center;
        place-content: center;
        color: #fff;
        font-size: 3rem;
    }
</style>