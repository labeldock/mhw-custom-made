<template>
  <div class="home">
    <img src="@/assets/mhw-logo.png">
    <div class="mh-box" style="margin-top:30px;">
      <header>
        Thanks 
      </header>
      <a href="http://www.mhwdb.kr" target="_blank">
        http://www.mhwdb.kr
      </a>
    </div>
    
    <div class="mh-box" style="margin-top:30px;">
      <header>
        DB
      </header>
      <div>armors {{ armorsLength }}</div>
      <div>charms {{ charms.length }}</div>
      <div>items {{ items.length }}</div>
      <div>skills {{ skills.length }}</div>
    </div>
    
    
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
  
  get armorsLength (){
    const armors = this.armors;
    return Object.keys(armors).reduce((dest,partName)=>dest + armors[partName].length,0);
  }
}
</script>
