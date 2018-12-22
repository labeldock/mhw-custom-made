<template>
  <li class="ve-opt" :selected="isActive">
    <div class="ve-opt-button" @click="input"></div>
    <div class="ve-opt-text"><slot></slot></div>
  </li>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';

@Component({
  inject:{
    select:"select"
  }
})
export default class VEOpt extends Vue {
  
  @Inject('select') select;
  @Prop() value;
  
  input (){
    const select = this.select;
    select.input(this.value,this);
  }
  
  get isActive (){
    const select = this.select;
    const value  = this.value;
    return select.isSelected(this.value)
  }
}
</script>
<style lang="scss">
.ve-opt {
  display:inline-block;
  .ve-opt-button {
    width:15px;
    height:15px;
    
    background-color:#3b3b3b;
    border:1px solid #49494b;
  }
  
  &[selected] {
    .ve-opt-button {
      background-color:#937d32;
      border:1px solid #b1a277;
    }
  }
  
  .ve-opt-text {
    display:none;
  }
  + .ve-opt {
    margin-left:5px;
  }
}
</style>