<template>
  <div v-if="!good"></div>
  <div v-else>
    <ul class="slots" style="margin-bottom:5px">
      <li v-for="slot in good.slots">{{slot}}</li>
    </ul>
    <div>
      <ol class="skills">
        <li v-for="skill in good.skills">
          {{ skill.name }}
          {{ skill.level }}
        </li>
      </ol>
      
    </div>
    <div> 물리방어 : {{good.defense}} </div>
    <div> 
      속성방어 : 
      불 [{{ good.resistance.fire }}]
      물 [{{ good.resistance.water }}]
      번개 [{{ good.resistance.thunder }}]
      얼음 [{{ good.resistance.ice }}]
      용 [{{ good.resistance.dragon }}]
    </div>
    
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class MHEquipDesc extends Vue {
  @Prop() data:any;
  
  get good (){
    const data = this.data;
    return (data && typeof data === "object") ? data : null;
  }
}
</script>