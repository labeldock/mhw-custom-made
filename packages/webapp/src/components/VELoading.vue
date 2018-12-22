<template>
  <div class="ve-loading">
    <div class="ve-loading-visual">
      <div class="ve-loading-visual-bar" :style="visualBarStyled"></div>
    </div>
    <div class="ve-loading-caption">
      {{ captionContent }}
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { limitNumber } from '@sepalang/pado';

@Component({})
export default class VELoading extends Vue {
  
  @Prop() value:number;
  @Prop() total:number;
  
  get ratio (){
    const total = this.total || 0;
    const value = this.value || 0;
    
    return limitNumber(total/value, 100, 0);
  }
  
  get visualBarStyled (){
    const ratio = this.ratio;
    const insetRight = 100 - (ratio * 100);
    const styled = {
      '-webkit-clip-path': `inset(0 ${insetRight}% 0 0)`,
      'clip-path': `inset(0 ${insetRight}% 0 0)`
    };
    return styled;
  }
  
  get captionContent (){
    const ratio = this.ratio;
    return `${100*ratio}%`;
  }
  
}
</script>
<style lang="scss">
.ve-loading {
  position:relative;
  width:-webkit-fill-available;
  width:fill-available;
  width:stretch;
  height:20px;
  
  .ve-loading-visual {
    position:absolute;
    top:3px;
    left:0;
    right:50px;
    background-color:black;
    height:15px;
    border-radius:2px;
    .ve-loading-visual-bar {
      position:absolute;
      top:3px;
      bottom:3px;
      left:5px;
      right:5px;
      background: linear-gradient(135deg, rgba(44,64,55,1) 0%,rgba(125,157,103,1) 100%);
      border-radius:2px;
    }
  }
  .ve-loading-caption {
    position:absolute;
    top:0;
    right:0;
    text-align:right;
    font-size:15px;
  }
}
</style>