<template>
  <div class="card-item" :class="{ '-active': isCardFlipped }">
    <div class="card-item__side -front">
      <div
        class="card-item__focus"
        :class="{ '-active': focusElementStyle }"
        :style="focusElementStyle"
        ref="focusElement"
      ></div>
      <div class="card-item__cover">
        <img v-if="currentCardBackground" :src="currentCardBackground" class="card-item__bg" />
      </div>
      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img src="../../public/card/chip.png" class="card-item__chip" />
          <div class="card-item__type">
            <transition name="slide-fade-up">
              <img
                :src="'../../public/card/' + cardType + '.png'"
                v-if="cardType"
                :key="cardType"
                alt
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>

        <label :for="fields.cardNumber" class="card-item__number" :ref="fields.cardNumber">
          <span
            v-for="(placeholderChar, index) in currentPlaceholder.split('')"
            :key="`number-${index}`"
          >
            <transition name="slide-fade-up">
              <!-- Masked character -->
              <div v-if="getIsNumberMasked(index, placeholderChar)" class="card-item__numberItem">
                *
              </div>

              <!-- Display character from card number -->
              <div
                v-else-if="labels.cardNumber[index]"
                class="card-item__numberItem"
                :class="{ '-active': labels.cardNumber[index].trim() === '' }"
              >
                {{ labels.cardNumber[index] }}
              </div>

              <!-- Placeholder character -->
              <div
                v-else
                class="card-item__numberItem"
                :class="{ '-active': placeholderChar.trim() === '' }"
              >
                {{ placeholderChar }}
              </div>
            </transition>
          </span>
        </label>

        <div class="card-item__content">
          <label :for="fields.cardName" class="card-item__info" :ref="fields.cardName">
            <div class="card-item__holder">Card Holder</div>
            <transition name="slide-fade-up">
              <div class="card-item__name" v-if="labels.cardName.length" key="1">
                <transition-group name="slide-fade-right">
                  <span
                    class="card-item__nameItem"
                    v-for="(n, $index) in labels.cardName.replace(/\s\s+/g, ' ')"
                    :key="$index + 1"
                    >{{ n }}</span
                  >
                </transition-group>
              </div>
              <div class="card-item__name" v-else key="2">Full Name</div>
            </transition>
          </label>
          <div class="card-item__date" ref="cardDate">
            <label :for="fields.cardMonth" class="card-item__dateTitle">Expires</label>
            <label :for="fields.cardMonth" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="labels.cardMonth != 'Month'" :key="labels.cardMonth">{{
                  labels.cardMonth
                }}</span>
                <span v-else key="2">MM</span>
              </transition>
            </label>
            /
            <label for="cardYear" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="labels.cardYear != 'Year'" :key="labels.cardYear">{{
                  String(labels.cardYear).slice(2, 4)
                }}</span>
                <span v-else key="2">YY</span>
              </transition>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="card-item__side -back">
      <div class="card-item__cover">
        <img v-if="currentCardBackground" :src="currentCardBackground" class="card-item__bg" />
      </div>
      <div class="card-item__band"></div>
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">CVV</div>
        <div class="card-item__cvvBand">
          <span v-for="(n, $index) in labels.cardCvv" :key="$index">*</span>
        </div>
        <div class="card-item__type">
          <img
            :src="'../../public/card/' + cardType + '.png'"
            v-if="cardType"
            class="card-item__typeImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    labels: Object,
    fields: Object,
    isCardNumberMasked: Boolean,
    randomBackgrounds: {
      type: Boolean,
      default: true,
    },
    backgroundImage: [String, Object],
  },
  data() {
    return {
      focusElementStyle: null,
      currentFocus: null,
      isFocused: false,
      isCardFlipped: false,
      amexCardPlaceholder: '#### ###### #####',
      dinersCardPlaceholder: '#### ###### ####',
      defaultCardPlaceholder: '#### #### #### ####',
      currentPlaceholder: '',
    }
  },
  watch: {
    currentFocus() {
      if (this.currentFocus) {
        this.changeFocus()
      } else {
        this.focusElementStyle = null
      }
    },
    cardType() {
      this.changePlaceholder()
    },
    'labels.cardNumber': {
      handler(newVal) {},
      immediate: true,
    },
  },
  mounted() {
    this.changePlaceholder()

    let self = this
    let fields = document.querySelectorAll('[data-card-field]')
    fields.forEach((element) => {
      element.addEventListener('focus', () => {
        this.isFocused = true
        if (element.id === this.fields.cardYear || element.id === this.fields.cardMonth) {
          this.currentFocus = 'cardDate'
        } else {
          this.currentFocus = element.id
        }
        this.isCardFlipped = element.id === this.fields.cardCvv
      })
      element.addEventListener('blur', () => {
        this.isCardFlipped = !element.id === this.fields.cardCvv
        setTimeout(() => {
          if (!self.isFocused) {
            self.currentFocus = null
          }
        }, 300)
        self.isFocused = false
      })
    })
  },
  computed: {
    cardType() {
      let number = this.labels.cardNumber
      let re = new RegExp('^4')
      if (number.match(re) != null) return 'visa'

      re = new RegExp('^(34|37)')
      if (number.match(re) != null) return 'amex'

      re = new RegExp('^5[1-5]')
      if (number.match(re) != null) return 'mastercard'

      re = new RegExp('^6011')
      if (number.match(re) != null) return 'discover'

      re = new RegExp('^62')
      if (number.match(re) != null) return 'unionpay'

      re = new RegExp('^9792')
      if (number.match(re) != null) return 'troy'

      re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}')
      if (number.match(re) != null) return 'dinersclub'

      re = new RegExp('^35(2[89]|[3-8])')
      if (number.match(re) != null) return 'jcb'

      return '' // default type
    },
    currentCardBackground() {
      if (this.randomBackgrounds && !this.backgroundImage) {
        // TODO will be optimized
        let random = Math.floor(Math.random() * 25 + 1)
        return `../../public/card/${random}.jpeg`
      } else if (this.backgroundImage) {
        return this.backgroundImage
      } else {
        return null
      }
    },
  },
  methods: {
    changeFocus() {
      let target = this.$refs[this.currentFocus]
      this.focusElementStyle = target
        ? {
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
            transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
          }
        : null
    },
    getIsNumberMasked(index, n) {
      return (
        index > 4 &&
        index < 14 &&
        this.labels.cardNumber.length > index &&
        n.trim() !== '' &&
        this.isCardNumberMasked
      )
    },
    changePlaceholder() {
      if (this.cardType === 'amex') {
        this.currentPlaceholder = this.amexCardPlaceholder
      } else if (this.cardType === 'dinersclub') {
        this.currentPlaceholder = this.dinersCardPlaceholder
      } else {
        this.currentPlaceholder = this.defaultCardPlaceholder
      }
      this.$nextTick(() => {
        this.changeFocus()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../src/assets/style.scss';
</style>
