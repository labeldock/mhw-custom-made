<template>
  <div class="page-custommade">
    <div class="mh-list-section wanted">
      <header>
        원하는 스킬
      </header>
      <div class="top">
        <input type="text" v-model="wantedText" placeholder="원하는 능력을 검색하세요">
      </div>
      <ul class="wanted-list" @input="selectedWantedItem">
        <li class="wanted-list-item" v-for="{idx, name, desc} in filteredSkills" :key="'wl'+idx" :value="idx">
          <div class="name">{{ name }}</div>
          <div class="desc">
            <div v-for="opt in desc" :key="idx+opt.name">
              {{ opt.name }} {{ opt.desc }}
            </div>
          </div>
          <div class="controls">
            <button class="mh-button" @click="wantedSkillWithIdx(idx)">추가</button>
          </div>
        </li>
      </ul>
      
      <div>
        <br>
        
        <div>
          {{ item }}
        </div>
      </div>
    </div>
    <div class="mh-list-section suggest">
      <header>
        스텟 양 고르기
      </header>
      <ul class="wanted-skills">
        <li class="wanted-skills-item" v-for="skill in wantedSkills" :key="'ws'+skill.idx">
          <div class="name">{{ skill.name }}</div>
          <div class="desc">
            <div v-for="(opt,index) in skill.desc" :key="skill.idx+index+opt.name">
              <VERadio v-model="skill.$selected" :value="index">
                {{ opt.name }} {{ opt.desc }}
              </VERadio>
            </div>
          </div>
          <div class="controls">
            <button @click="removeWantedSkillWithIdx(skill.idx)">제외</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="mh-list-section equip">
      <header>
        나의 장비
      </header>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Hangul from 'hangul-js';

import { removeValue } from '@sepalang/pado';
import VERadio from '@sepalang/pado/packages/vecom/src/components/PadoRadio.vue';


@Component({
  components: {
    VERadio
  }
})
export default class Home extends Vue {
  @State('armors') armors;
  @State('charms') charms;
  @State('items') items;
  @State('skills') skills;
  
  wantedText:string="";
  item:any=null;
  wantedSkills:Array<any>=[];
  
  get filteredSkills ():Array<{ idx:number, name:string }> {
    
    const wantedSkills = this.wantedSkills;
    const wantedText = this.wantedText;
    const skills = this.skills.filter(({ idx })=>{
      return !wantedSkills.some(({ idx:alreadyIdx })=>alreadyIdx===idx);
    });

    if(!wantedText){
      return skills;
    }
    
    const searcher = new Hangul.Searcher(wantedText);
    const searched = skills.filter(({ name, desc },index)=>{
      const content = `${name} ${desc.map(({desc})=>desc).join("")}`;
      const matched = searcher.search(content) === 0 || content.indexOf(wantedText) != -1;
      return matched;
    });
    
    return searched;
  }
  
  wantedSkillWithIdx (wantedIdx){
    const skills = this.skills;
    const wantedSkills = this.wantedSkills;
    
    const skill = skills.find(({idx})=>idx===wantedIdx);
    
    wantedSkills.push({ ...skill, $selected:null });
  }
  
  removeWantedSkillWithIdx (removeIdx){
    const wantedSkills = this.wantedSkills;
    const removeTarget = wantedSkills.find(({ idx })=>{ return removeIdx === idx });
    removeValue(wantedSkills,removeTarget);
  }
  
  selectedWantedItem (datum){
    const skills = this.skills;
    const item = skills.find(({idx})=>idx = datum.target.value);
    this.item = item;
  }
  
  
}
</script>

<style lang="scss">
  .page-custommade {
    display: flex;
    flex-flow: row nowrap;
    text-align:left;
    
    .wanted {
      flex: 1;
      .wanted-list {
        overflow:auto;
        height:70vh;
        min-height:600px;
        .wanted-list-item {
          position:relative;
          
          .controls {
            position:absolute;
            right:5px;
            top:50%;
            transform:translateY(-50%);
          }
        }
      }
    }
    .suggest {
      flex: 1;
      .wanted-skills {
        overflow:auto;
        height:70vh;
        min-height:600px;
        .wanted-skills-item {
          position:relative;
          .name {
            font-weight:bold;
          }
          .desc {
            font-size:12px;
          }
          .controls {
            position:absolute;
            right:5px;
            top:50%;
            transform:translateY(-50%);
          }
          + .wanted-skills-item {
            margin-top:10px;
          }
        }
      }
    }
    .equip {
      flex: 1;
    }
    
  }
</style>