<template>
  <div>
    <div class="page-custommade">
      <div class="mh-list-section">
        <header>
          <span class="ico">원하는 스킬</span>
        </header>
        <div class="top">
          <input type="text" v-model="wantedText" placeholder="원하는 능력을 검색하세요">
        </div>
        <ul class="wanted-list" @input="selectedWantedItem">
          <li class="wanted-list-item" v-for="{idx, name, desc} in filteredSkills" :key="'wl'+idx" :value="idx">
            <div class="name">{{ name }}</div>
            <div class="desc" style="width:calc(100% - 70px)">
              <div v-for="opt in desc" :key="idx+opt.name">
                {{ opt.name }} {{ opt.desc }}
              </div>
            </div>
            <div class="controls">
              <button class="mh-button" @click="wantedSkillWithIdx(idx)">추가</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="mh-list-section">
        <header>
          <span class="ico">스텟 양 고르기</span>
        </header>
        <div class="top"></div>
        <ul>
          <li v-for="skill in wantedSkills" :key="'ws'+skill.idx">
            <div class="name">{{ skill.name }}</div>
            <div class="stet">
              <VEStet v-model="skill.$selected">
                <VEOpt v-for="(opt,index) in skill.desc" :key="index" :value="index">{{ opt.name }} {{ opt.desc }}</VEOpt>
              </VEStet>
            </div>
            <div class="desc">
              <span v-if="skill.desc[skill.$selected]">
                {{skill.desc[skill.$selected].name}} {{skill.desc[skill.$selected].desc}}
              </span>
              <span class="ghosted" v-else>
                스킬을 선택해 주세요
              </span>
            </div>
            <div class="controls">
              <button class="mh-button" @click="skill.$selected = null" :disabled="typeof skill.$selected !== 'number'">초기화</button>&nbsp;
              <button class="mh-button" @click="removeWantedSkillWithIdx(skill.idx)">제외</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="mh-list-section">
        <header>
          선택한 스텟 목록
        </header>
        <div class="top" style="text-align:center;">
          <div class="mh-button">
            스크롤을 내리시면 다음단계가 보입니다.
          </div>
        </div>
        <ul class="mh-simple">
          <li v-for="(skill, index) in availableSkills">
            <span>{{ index+1 }} - {{ skill.name }}</span>
            <div class="controls" style="padding-top:8px">
              <VEStet v-model="skill.$selected" style="display:inline-block">
                <VEOpt v-for="(opt,index) in skill.desc" :key="index" :value="index" readonly>{{ opt.name }} {{ opt.desc }}</VEOpt>
              </VEStet>
              &nbsp;
              <span style="position:relative;top:-3px;">{{ skill.$selected + 1 }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-custommade">
      <div class="mh-list-section">
        <header>
          <span>셋팅완성도</span>
        </header>
        <div class="top"></div>
        <ul></ul>
      </div>
      <div class="mh-list-section">
        <header>
          <span class="ico">장비선택</span>
        </header>
        <div class="top"></div>
      </div>
      <div class="mh-list-section">
        <header>
          추천목록
        </header>
        <div class="top"></div>
        <div style="text-align:center;"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

import VEStet from '@/components/VEStet.vue'; // @ is an alias to /src
import VEOpt from '@/components/VEOpt.vue';

import Hangul from 'hangul-js';

import { removeValue } from '@sepalang/pado';
import VERadio from '@sepalang/pado/packages/vecom/src/components/PadoRadio.vue';


@Component({
  components: {
    VERadio,
    VEStet,
    VEOpt
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
  
  mounted (){
    const skills = this.skills;
    for(let i=0,l=3;i<l;i++){
      const { idx } = skills[i];
      this.wantedSkillWithIdx(idx);
    }
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
  
  get availableSkills (){
    const wantedSkills = this.wantedSkills;
    
    return wantedSkills.filter(({ $selected })=>{
      return typeof $selected === "number"
    })
  }
  
}
</script>

<style lang="scss">
  .page-custommade {
    display: flex;
    flex-flow: row nowrap;
    text-align:left;
    
    > div {
      flex: 1;
      opacity:.6;
      transition:opacity .3s;
      &:hover {
        opacity:1;
      }
    }
    
    > div > ul {
      overflow:auto;
      height:calc(100vh - 240px);
      min-height:600px;
    }
    
    + .page-custommade {
      margin-top:120px;
    }
  }
</style>