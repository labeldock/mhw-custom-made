<template>
  <div class="home">
    <h2>Thanks </h2>
    <a href="http://www.mhwdb.kr" target="_blank">
      http://www.mhwdb.kr
    </a>
    
    <h2>DB </h2>
    <div>armors {{ armors.length }}</div>
    <div>charms {{ charms.length }}</div>
    <div>items {{ items.length }}</div>
    <div>skills {{ skills.length }}</div>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src


@Component({
  components: {}
})
export default class Home extends Vue {
  @State('armors') armors;
  @State('charms') charms;
  @State('items') items;
  @State('skills') skills;
}
</script>
