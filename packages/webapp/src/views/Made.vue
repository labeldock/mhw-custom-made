<template>
  <div class="about">
    <div>
      Wanted
      <div>
        <input type="text" v-model="wantedText">
        <br>
        <select multiple @input="selectedWantedItem">
          <option v-for="{idx, name} in filteredSkills" :key="idx" :value="idx">{{ name }}</option>
        </select>
        <div>
          {{ item }}
        </div>
      </div>
      
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Hangul from 'hangul-js';


@Component({
  components: {}
})
export default class Home extends Vue {
  @State('armors') armors;
  @State('charms') charms;
  @State('items') items;
  @State('skills') skills;
  
  wantedText:string="";
  item:any=null;
  
  get filteredSkills ():Array<{ idx:number, name:string }> {
    
    
    const wantedText = this.wantedText;
    const skills = this.skills;
    
    if(!wantedText){
      return skills;
    }
    
    const searcher = new Hangul.Searcher(wantedText);
    
    return skills.filter(({ name })=>{
      return searcher.search(name) === 0;
    });
  }
  
  selectedWantedItem (datum){
    const skills = this.skills;
    const item = skills.find(({idx})=>idx = datum.target.value);
    this.item = item;
  }
  
  
}
</script>