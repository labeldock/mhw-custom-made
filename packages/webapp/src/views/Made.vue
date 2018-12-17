<template>
  <div class="about">
    <div>
      Wanted
      <div>
        
      </div>
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
}
</script>