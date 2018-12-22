<template>
  <div id="master-app">
    <div id="master-nav">
      <span>CUSTOM MADE | </span>
      <router-link class="master-nav-item" to="/">Home</router-link> |
      <router-link class="master-nav-item" to="/about">Made</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '@/assets/entry.scss';
</style>
