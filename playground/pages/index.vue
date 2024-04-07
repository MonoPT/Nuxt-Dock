<template>
  <div class="grid">
    <nd-dock 
      :tabs="[
        {
          name: 'Tab 1',
          iframe_url: '/page1',
          is_active_tab: true
        },
        {
          name: 'Chrome',
          iframe_url: '/page2'
        },
        {
          name: 'Firefox',
          iframe_url: '/page3'
        }
      ]"
      area="a"
    />

    <nd-dock 
      :tabs="[
        {
          name: 'Tab 4',
          iframe_url: '/page1',
          is_active_tab: true
        },
        {
          name: 'Chrome 2',
          iframe_url: '/page2'
        },
        {
          name: 'Opera',
          iframe_url: '/page3'
        }
      ]"
      area="b"
    />

    <nd-dock 
      :tabs="[
        {
          name: 'Tab 4',
          iframe_url: '/page1',
          is_active_tab: true
        },
        {
          name: 'Chrome 2',
          iframe_url: '/page2'
        },
        {
          name: 'Opera',
          iframe_url: '/page3'
        }
      ]"
      area="c"
    />
  </div>
</template>

<script lang="ts" setup>
  import {ref, onMounted} from "vue"

  const height = ref(0);

  onMounted(() => {
    height.value = window.innerHeight
  })

</script>
  
<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
  }


  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "a b" "c c";
    height: 100%;
    height: calc(v-bind(height) * 1px);
  }
</style>