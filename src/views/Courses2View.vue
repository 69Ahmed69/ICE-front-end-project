<script setup>
import NavBarTop from '@/components/navbars/NavBarTop.vue';
import NavBarBottom from '@/components/navbars/NavBarBottom.vue';
import PagesNumberComp from '@/components/PagesNumberComp.vue';
import FooterTop from '@/components/footers/FooterTop.vue';
import FooterBottom from '@/components/footers/FooterBottom.vue';
</script>

<template >
  <div class="all" >
  <NavBarTop />
  <NavBarBottom />
  <div class="main" style="padding-top:200px;">
  <PagesNumberComp :bar="true"/>
  <FooterTop />
  <FooterBottom/>
</div>
</div>
</template>
