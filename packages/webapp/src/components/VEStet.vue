<template>
  <div class="ve-stet">
    <ul class="ve-stet-list">
      <slot></slot>
    </ul>
    <div class="ve-stet-bg">
      <div class="ve-stet-bg-line"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator';

@Component({
  provide (){
    return { select:this }
  }
})
export default class VEStet extends Vue {
  @Model("commit") model;
  
  input (value){
    console.log("value")
    this.$emit("commit", value);
  }
  
  isSelected (value){
    if(value === undefined) return false;
    //special
    if(typeof value === "number" && typeof this.model === "number"){
      return value <= this.model;
    }
    return this.model === value;
  }
}
</script>
<style lang="scss">
.ve-stet {
  display:block;
  width:fit-content;
  position:relative;
  height:15px;
  z-index:0;
}
.ve-stet-list {
  position:relative;
  z-index:2;
}
.ve-stet-bg {
  position:absolute;
  left:0;
  right:0;
  top:8px;
  height:2px;
  background-color:#49494b;
  z-index:1;
}
</style>