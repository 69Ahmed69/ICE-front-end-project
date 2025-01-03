<script setup>
const logos = [
  {
    src: new URL('../assets/trusted-companies/Company Logo.png', import.meta.url).href,
    link: 'https://www.netflix.com',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-4.png', import.meta.url).href,
    link: 'https://www.google.com',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-7.png', import.meta.url).href,
    link: 'https://www.microsoft.com',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-2.png', import.meta.url).href,
    link: 'https://www.youtube.com',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-5.png', import.meta.url).href,
    link: 'https://www.lexmark.com',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-6.png', import.meta.url).href,
    link: 'https://www.lenovo.com/dz/fr/',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-1.png', import.meta.url).href,
    link: 'https://www.slack.com',
  },
  {
    src: new URL('../assets/trusted-companies/Company Logo-3.png', import.meta.url).href,
    link: 'https://www.verizon.com',
  },
]
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-10 px-6 lg:px-36 py-10 mb-8 lg:mb-16">
    <!-- Left Section -->
    <div class="flex flex-col items-center justify-center lg:basis-1/3 text-center lg:text-start">
      <h2 class="text-xl lg:text-3xl font-primary font-bold text-font mb-4">
        Trusted by Top Companies
      </h2>
      <p class="text-xs lg:text-base font-primary text-gray_3">
        Our platform is trusted by some of the most reputable companies around the globe. Join the
        growing network of organizations benefiting from our services.
      </p>
    </div>

    <!-- Right Section -->
    <div class="flex-1 lg:basis-2/3">
      <div class="flex flex-wrap gap-6 justify-center items-center">
        <!-- Logos -->

        <div
          v-for="(logo, i) in logos"
          :key="i"
          :class="`flex items-center justify-center p-4 bg-background rounded-3xl shadow-md `"
          class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
        >
          <a :href="logo.link" target="_blank" rel="noopener noreferrer">
            <img
              :src="logo.src"
              alt="Company Logo"
              class="max-w-full max-h-12 lg:max-h-24 object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
