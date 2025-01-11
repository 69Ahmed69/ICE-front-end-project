<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const restartAnimation = () => {
  const rods = document.querySelectorAll(
    '#rod1, #rod2, #rod3, #rod4, #rod5, #rod6, #rod7, #rod8, #flakes path',
  )
  rods.forEach((rod) => {
    rod.style.animation = 'none'
    setTimeout(() => {
      rod.style.animation = ''
    }, 50)
  })
}

defineProps({
  size: {
    type: Number,
    required: false,
    default: 150,
  },
})

let animationInterval

onMounted(() => {
  restartAnimation()
  animationInterval = setInterval(restartAnimation, 4500)
})

onBeforeUnmount(() => {
  clearInterval(animationInterval)
})
</script>

<template>
  <div>
    <svg
      id="snowflake"
      :width="size"
      :height="size"
      :viewBox="`0 0 150 150`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Loading animation">
        <g id="elements">
          <g id="rods">
            <rect id="rod5" x="72" y="75" width="7" height="52" rx="3.5" />
            <rect id="rod1" x="72" y="23" width="7" height="52" rx="3.5" />
            <rect
              id="rod3"
              x="131"
              y="73"
              width="7"
              height="54"
              rx="3.5"
              transform="rotate(90 131 73)"
            />
            <rect
              id="rod7"
              x="77"
              y="73"
              width="7"
              height="57"
              rx="3.5"
              transform="rotate(90 77 73)"
            />
            <rect
              id="rod4"
              x="116.98"
              y="113.184"
              width="6.78261"
              height="54"
              rx="3.3913"
              transform="rotate(135 116.98 113.184)"
            />
            <rect
              id="rod8"
              x="77.6748"
              y="73.618"
              width="6.78261"
              height="58.7954"
              rx="3.3913"
              transform="rotate(135 77.6748 73.618)"
            />
            <rect
              id="rod2"
              x="114.335"
              y="33"
              width="6.78261"
              height="59.2376"
              rx="3.3913"
              transform="rotate(45 114.335 33)"
            />
            <rect
              id="rod6"
              x="72.6328"
              y="74"
              width="6.78261"
              height="54.6354"
              rx="3.3913"
              transform="rotate(45 72.6328 74)"
            />
          </g>
          <g id="flakes">
            <path
              id="flake3"
              d="M86.0917 43.398C87.4161 42.0736 89.5634 42.0736 90.8878 43.398V43.398C92.2121 44.7224 92.2121 46.8697 90.8878 48.194L79.6713 59.4105C78.347 60.7349 76.1997 60.7349 74.8753 59.4105V59.4105C73.5509 58.0861 73.5509 55.9388 74.8753 54.6144L86.0917 43.398Z"
            />
            <path
              id="flake13"
              d="M84.9443 108.566C86.2687 109.89 88.4159 109.89 89.7403 108.566V108.566C91.0647 107.241 91.0647 105.094 89.7403 103.77L79.1945 93.224C77.8701 91.8996 75.7228 91.8996 74.3984 93.224V93.224C73.074 94.5484 73.074 96.6956 74.3984 98.02L84.9443 108.566Z"
            />
            <path
              id="flake14"
              d="M84.9443 122.131C86.2687 123.455 88.4159 123.455 89.7403 122.131V122.131C91.0647 120.807 91.0647 118.659 89.7403 117.335L79.1945 106.789C77.8701 105.465 75.7228 105.465 74.3984 106.789V106.789C73.074 108.114 73.074 110.261 74.3984 111.585L84.9443 122.131Z"
            />
            <path
              id="flake16"
              d="M65.629 122.131C64.3046 123.455 62.1573 123.455 60.8329 122.131V122.131C59.5086 120.807 59.5086 118.659 60.8329 117.335L71.3788 106.789C72.7032 105.465 74.8504 105.465 76.1748 106.789V106.789C77.4992 108.114 77.4992 110.261 76.1748 111.585L65.629 122.131Z"
            />
            <path
              id="flake15"
              d="M65.629 108.566C64.3046 109.89 62.1573 109.89 60.8329 108.566V108.566C59.5086 107.241 59.5086 105.094 60.8329 103.77L71.3788 93.224C72.7032 91.8996 74.8504 91.8996 76.1748 93.224V93.224C77.4992 94.5484 77.4992 96.6956 76.1748 98.02L65.629 108.566Z"
            />
            <path
              id="flake7"
              d="M103.031 61.572C104.355 60.2476 106.502 60.2476 107.827 61.572V61.572C109.151 62.8964 109.151 65.0436 107.827 66.368L97.2809 76.9138C95.9565 78.2382 93.8092 78.2382 92.4849 76.9138V76.9138C91.1605 75.5894 91.1605 73.4422 92.4849 72.1178L103.031 61.572Z"
            />
            <path
              id="flake8"
              d="M118.857 61.572C120.181 60.2476 122.329 60.2476 123.653 61.572V61.572C124.977 62.8964 124.977 65.0436 123.653 66.368L113.107 76.9138C111.783 78.2382 109.635 78.2382 108.311 76.9138V76.9138C106.987 75.5894 106.987 73.4422 108.311 72.1178L118.857 61.572Z"
            />
            <path
              id="flake9"
              d="M103.031 90.4789C104.355 91.8033 106.502 91.8033 107.827 90.4789V90.4789C109.151 89.1546 109.151 87.0073 107.827 85.6829L97.2809 75.1371C95.9565 73.8127 93.8092 73.8127 92.4849 75.1371V75.1371C91.1605 76.4615 91.1605 78.6087 92.4849 79.9331L103.031 90.4789Z"
            />
            <path
              id="flake19"
              d="M47.5421 90.4789C46.2177 91.8033 44.0704 91.8033 42.746 90.4789V90.4789C41.4216 89.1546 41.4216 87.0073 42.746 85.6829L53.2919 75.1371C54.6163 73.8127 56.7635 73.8127 58.0879 75.1371V75.1371C59.4123 76.4615 59.4123 78.6087 58.0879 79.9331L47.5421 90.4789Z"
            />
            <path
              id="flake20"
              d="M31.7159 90.4789C30.3915 91.8033 28.2442 91.8033 26.9199 90.4789V90.4789C25.5955 89.1546 25.5955 87.0073 26.9199 85.6829L37.4657 75.1371C38.7901 73.8127 40.9373 73.8127 42.2617 75.1371V75.1371C43.5861 76.4615 43.5861 78.6087 42.2617 79.9331L31.7159 90.4789Z"
            />
            <path
              id="flake21"
              d="M47.5421 61.572C46.2177 60.2476 44.0704 60.2476 42.746 61.572V61.572C41.4216 62.8964 41.4216 65.0436 42.746 66.368L53.2919 76.9138C54.6163 78.2382 56.7635 78.2382 58.0879 76.9138V76.9138C59.4123 75.5894 59.4123 73.4422 58.0879 72.1178L47.5421 61.572Z"
            />
            <path
              id="flake22"
              d="M31.7159 61.572C30.3915 60.2476 28.2442 60.2476 26.9199 61.572V61.572C25.5955 62.8964 25.5955 65.0436 26.9199 66.368L37.4657 76.9138C38.7901 78.2382 40.9373 78.2382 42.2617 76.9138V76.9138C43.5861 75.5894 43.5861 73.4422 42.2617 72.1178L31.7159 61.572Z"
            />
            <path
              id="flake10"
              d="M118.857 90.4789C120.181 91.8033 122.329 91.8033 123.653 90.4789V90.4789C124.977 89.1546 124.977 87.0073 123.653 85.6829L113.107 75.1371C111.783 73.8127 109.635 73.8127 108.311 75.1371V75.1371C106.987 76.4615 106.987 78.6087 108.311 79.9331L118.857 90.4789Z"
            />
            <path
              id="flake1"
              d="M65.629 43.4849C64.3046 42.1605 62.1573 42.1605 60.8329 43.4849V43.4849C59.5086 44.8093 59.5086 46.9566 60.8329 48.281L71.3788 58.8268C72.7032 60.1512 74.8504 60.1512 76.1748 58.8268V58.8268C77.4992 57.5024 77.4992 55.3552 76.1748 54.0308L65.629 43.4849Z"
            />
            <path
              id="falke4"
              d="M84.9443 27.6589C86.2687 26.3345 88.4159 26.3345 89.7403 27.6589V27.6589C91.0647 28.9833 91.0647 31.1305 89.7403 32.4549L79.1945 43.0007C77.8701 44.3251 75.7228 44.3251 74.3984 43.0007V43.0007C73.074 41.6764 73.074 39.5291 74.3984 38.2047L84.9443 27.6589Z"
            />
            <path
              id="flake6"
              d="M100.391 54.7826C98.5183 54.7826 97 53.2643 97 51.3913V51.3913C97 49.5183 98.5183 48 100.391 48H118.478C120.351 48 121.87 49.5183 121.87 51.3913V51.3913C121.87 53.2643 120.351 54.7826 118.478 54.7826H100.391Z"
            />
            <path
              id="flake23"
              d="M30.174 54.6521C28.3011 54.6521 26.7827 53.1338 26.7827 51.2608V51.2608C26.7827 49.3878 28.3011 47.8695 30.174 47.8695H48.261C50.1339 47.8695 51.6523 49.3878 51.6523 51.2608V51.2608C51.6523 53.1338 50.1339 54.6521 48.261 54.6521H30.174Z"
            />
            <path
              id="flake11"
              d="M100.391 103.783C98.5183 103.783 97 102.264 97 100.391V100.391C97 98.5183 98.5183 97 100.391 97H118.478C120.351 97 121.87 98.5183 121.87 100.391V100.391C121.87 102.264 120.351 103.783 118.478 103.783H100.391Z"
            />
            <path
              id="flake18"
              d="M31.3913 103.783C29.5183 103.783 28 102.264 28 100.391V100.391C28 98.5183 29.5183 97 31.3913 97H49.4783C51.3512 97 52.8696 98.5183 52.8696 100.391V100.391C52.8696 102.264 51.3512 103.783 49.4783 103.783H31.3913Z"
            />
            <path
              id="flake5"
              d="M96 50.4782C96 52.3512 97.5183 53.8695 99.3913 53.8695V53.8695C101.264 53.8695 102.783 52.3512 102.783 50.4782V32.3912C102.783 30.5183 101.264 28.9999 99.3913 28.9999V28.9999C97.5183 28.9999 96 30.5183 96 32.3912V50.4782Z"
            />
            <path
              id="flake12"
              d="M96.0001 119.478C96.0001 121.351 97.5184 122.87 99.3914 122.87V122.87C101.264 122.87 102.783 121.351 102.783 119.478V101.391C102.783 99.5183 101.264 98 99.3914 98V98C97.5184 98 96.0001 99.5183 96.0001 101.391V119.478Z"
            />
            <path
              id="flake17"
              d="M47.1313 119.087C47.1313 120.96 48.6497 122.478 50.5227 122.478V122.478C52.3956 122.478 53.914 120.96 53.914 119.087V101C53.914 99.127 52.3956 97.6087 50.5227 97.6087V97.6087C48.6497 97.6087 47.1313 99.127 47.1313 101V119.087Z"
            />
            <path
              id="flake24"
              d="M47.1313 48.9999C47.1313 50.8729 48.6497 52.3912 50.5227 52.3912V52.3912C52.3956 52.3912 53.914 50.8729 53.914 48.9999V30.913C53.914 29.04 52.3956 27.5217 50.5227 27.5217V27.5217C48.6497 27.5217 47.1313 29.04 47.1313 30.913V48.9999Z"
            />
            <path
              id="flake2"
              d="M65.629 27.6589C64.3046 26.3345 62.1573 26.3345 60.8329 27.6589V27.6589C59.5086 28.9833 59.5086 31.1305 60.8329 32.4549L71.3788 43.0007C72.7032 44.3251 74.8504 44.3251 76.1748 43.0007V43.0007C77.4992 41.6764 77.4992 39.5291 76.1748 38.2047L65.629 27.6589Z"
            />
          </g>
          <circle id="center" cx="75.1958" cy="76.5" r="12.5" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
#elements {
  fill: #29c8f0;
  transition: all 1s ease;
}
svg {
  margin: auto;
  cursor: wait;
}

/* Initial state: hide all elements */
#rods rect,
#flakes path {
  opacity: 0;
}

/* Animation for rods */
@keyframes rod1Animation {
  from {
    opacity: 0;
    transform: translateY(-41px);
  }
  to {
    opacity: 1;
    transform: translateY(-1px);
  }
}
@keyframes rod2Animation {
  from {
    opacity: 0;
    transform: translate(19px, -81px) rotate(45deg);
  }
  to {
    opacity: 1;
    transform: translate(-19px, -41px) rotate(45deg);
  }
}
@keyframes rod3Animation {
  from {
    opacity: 0;
    transform: translate(91px, -59px) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: translate(51px, -59px) rotate(90deg);
  }
}
@keyframes rod4Animation {
  from {
    opacity: 0;
    transform: translate(140px, 80px) rotate(135deg);
  }
  to {
    opacity: 1;
    transform: translate(101px, 39px) rotate(135deg);
  }
}
@keyframes rod5Animation {
  from {
    opacity: 0;
    transform: translateY(41px);
  }
  to {
    opacity: 1;
    transform: translateY(1px);
  }
}
@keyframes rod6Animation {
  from {
    opacity: 0;
    transform: translate(-79px, 81px) rotate(225deg);
  }
  to {
    opacity: 1;
    transform: translate(-39px, 41px) rotate(225deg);
  }
}
@keyframes rod7Animation {
  from {
    opacity: 0;
    transform: translate(-91px, 6px) rotate(270deg);
  }
  to {
    opacity: 1;
    transform: translate(-51px, 6px) rotate(270deg);
  }
}
@keyframes rod8Animation {
  from {
    opacity: 0;
    transform: translate(-86px, -76px) rotate(315deg);
  }
  to {
    opacity: 1;
    transform: translate(-46px, -36px) rotate(315deg);
  }
}

/* Animation for flakes */
@keyframes flakeAnimation {
  0%,
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Animation for hiding */
@keyframes hideAnimation {
  0%,
  10% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Apply animations to rods sequentially */
#rod1 {
  animation:
    rod1Animation 0.2s linear forwards 0s,
    hideAnimation 1s linear forwards 2.4s;
}
#rod2 {
  transform-origin: center;
  animation:
    rod2Animation 0.2s linear forwards 0.2s,
    hideAnimation 1s linear forwards 2.6s;
}
#rod3 {
  transform-origin: center;
  animation:
    rod3Animation 0.2s linear forwards 0.4s,
    hideAnimation 1s linear forwards 2.8s;
}
#rod4 {
  transform-origin: center;
  animation:
    rod4Animation 0.2s linear forwards 0.6s,
    hideAnimation 1s linear forwards 3s;
}
#rod5 {
  animation:
    rod5Animation 0.2s linear forwards 0.8s,
    hideAnimation 1s linear forwards 3.2s;
}
#rod6 {
  transform-origin: center;
  animation:
    rod6Animation 0.2s linear forwards 1s,
    hideAnimation 1s linear forwards 3.4s;
}
#rod7 {
  transform-origin: center;
  animation:
    rod7Animation 0.2s linear forwards 1.2s,
    hideAnimation 1s linear forwards 3.6s;
}
#rod8 {
  transform-origin: center;
  animation:
    rod8Animation 0.2s linear forwards 1.4s,
    hideAnimation 1s linear forwards 3.8s;
}

#flakes path {
  animation:
    flakeAnimation 0.8s linear forwards 1.6s,
    hideAnimation 1s linear forwards 3s;
}
</style>
