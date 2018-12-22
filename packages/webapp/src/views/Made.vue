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
          <li v-for="(skill, index) in availableSkills" :key="index">
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
        <div class="top">
          <VELoading :total="totalSkillsCount" :value="restSkillsCount"></VELoading>
          {{totalSkillsCount}} {{restSkillsCount}}
        </div>
        <ul class="mh-simple">
          <li v-for="(skill, index) in availableSkills" :key="index">
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
      <div class="mh-list-section">
        <header>
          <span class="ico">장비선택</span>
        </header>
        <div class="top"></div>
        <ul>
          <li v-for="set in userSettings">
            <div class="top-controls">
              <button class="mh-button" @click="openPartList(set.part)">장비찾기</button>
            </div>
            <div class="name">
              [{{ set.part }}] <span v-if="set.equip"> {{ set.equip.name }} </span>
            </div>
            <MHEquipDesc class="desc" :data="set.equip"></MHEquipDesc>
          </li>
        </ul>
      </div>
      <div class="mh-list-section">
        <header>
          {{ recommandedSearch.part || '' }}
          추천목록
          ({{ remomandedList.length }})
        </header>
        <div class="top">
          
        </div>
        <ul>
          <li v-for="good in remomandedList" :key="good.idx">
            <div class="top-controls">
              <button class="mh-button" @click="equipArmor(good)">착용하기</button>
            </div>
            <div class="name">
              {{ good.name }}
              <span class="level">{{good.rare}} ({{ good.set_level }})</span>
            </div>
            <MHEquipDesc class="desc" :data="good"></MHEquipDesc>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

import VEStet from '@/components/VEStet.vue'; // @ is an alias to /src
import VEOpt from '@/components/VEOpt.vue';
import VELoading from '@/components/VELoading.vue';
import MHEquipDesc from '@/components/MHEquipDesc.vue';
import Hangul from 'hangul-js';

import { removeValue, sort } from '@sepalang/pado';
import VERadio from '@sepalang/pado/packages/vecom/src/components/PadoRadio.vue';


@Component({
  components: {
    VERadio,
    VEStet,
    VEOpt,
    VELoading,
    MHEquipDesc
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
  
  userSettings:Array<any> = [
    {
      part:"머리",
      equip:null,
      slots:[]
    },
    {
      part:"몸통",
      equip:null,
      slots:[]
    },
    {
      part:"팔",
      equip:null,
      slots:[]
    },
    {
      part:"허리",
      equip:null,
      slots:[]
    },
    {
      part:"다리",
      equip:null,
      slots:[]
    }
  ];
  
  recommandedSearch = {
    part:null
  };
  
  
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
    //const skills = this.skills;
    //for(let i=0,l=3;i<l;i++){
    //  const { idx } = skills[i];
    //  this.wantedSkillWithIdx(idx);
    //}
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
    if(!wantedSkills) return [];
    return wantedSkills.filter(({ $selected })=>{
      return typeof $selected === "number"
    })
  }
  
  get totalSkillsCount (){
    const availableSkills = this.availableSkills;
    let count = 0;
    availableSkills.forEach(({ desc })=>{
      count += desc.length;
    })
    return count;
  }
  
  get restSkillsCount (){
    const availableSkills = this.availableSkills;
    let count = 0; 
    return count;
  }
  
  openPartList (partName){
    this.recommandedSearch.part = partName;
  }
  
  equipArmor (armor){
    const { part, name } = armor;
    const userSettings = this.userSettings
    const targetSetting = userSettings.find(({ part:thisPart })=>thisPart===part);
    
    if(!targetSetting){
      alert("예상치 못한 오류");
    }
    
    targetSetting.equip = armor;
  }
  
  get remomandedList (){
    const recommandedSearch = this.recommandedSearch;
    const armors = this.armors;
    
    const { part } = recommandedSearch;
    if(!part) return [];
    
    let list = armors.filter(({ part:partName })=>partName===part);
    
    //rare
    list = sort(list,({ rare:a },{ rare:b })=>Number(a) > Number(b));
    
    //slot
    list = sort(list,({ slots:a },{ slots:b })=>{
      if(a.length === b.length){
        return a[0] > b[0];
      }
      return a.length > b.length
    });
    
    return list;
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