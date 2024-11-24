<script setup>
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import NavBarNewUser from '@/components/navbars/NavBarBottom.vue'
import Hero from '@/components/Hero.vue'
import TopCategories from '@/components/TopCategories.vue'
import BestSellingCourses from '@/components/BestSellingCourses.vue'
import FeatureCourses from '@/components/FeatureCourses.vue'
import RecentCourses from '@/components/RecentCourses.vue'
import BecomeAnInstructor from '@/components/BecomeAnInstructor.vue'
import TopInsctructors from '@/components/TopInsctructors.vue'
import TrustedCompanies from '@/components/TrustedCompanies.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
</script>

<template>
  <NavBarNewUser />
  <NavBarTop />
  <Hero />
  <TopCategories />
  <BestSellingCourses :limit="10" :showButton="false" />
  <FeatureCourses :limit="4" />
  <RecentCourses :limit="4" />
  <BecomeAnInstructor />
  <TopInsctructors :limit="5" />
  <TrustedCompanies />
  <FooterTop />
  <FooterBottom />
</template>
