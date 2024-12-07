<script setup>
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
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
import BackToTheTop from '@/components/ui elements/BackToTheTop.vue'
import AltHero from '@/components/Alt-Hero.vue'
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <BackToTheTop />
  <AltHero />
  <TopCategories />
  <BestSellingCourses
    :limit="8"
    :showButton="false"
    title="Best Selling Courses"
    titlePosition="center"
  />
  <FeatureCourses :limit="4" />
  <RecentCourses :limit="4" title="Recently Added Courses" titlePosition="center" />
  <BecomeAnInstructor />
  <TopInsctructors :limit="5" />
  <TrustedCompanies />
  <div><FooterTop /> <FooterBottom /></div>
</template>
