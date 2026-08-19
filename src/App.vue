<script setup>
// template Practice
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import VHtml from './components/practices/basic/v-html.vue'
import VHtmlXSS from './components/practices/basic/v-html XSS.vue'
import VText from './components/practices/basic/v-text.vue'
import VbindBasic from './components/practices/basic/v-bind-basic.vue'
import VbindClass from './components/practices/basic/v-bind-class.vue'
import VbindStyle from './components/practices/basic/v-bind-style.vue'  
import VShorthand from './components/practices/basic/v-shorthand.vue'
import VIf from './components/practices/basic/v-if.vue'
import VShow from './components/practices/basic/v-show.vue'
import VFor from './components/practices/basic/v-for.vue'
import VonEventHandler from './components/practices/basic/v-on-event-handler.vue'
import VonEventObject from './components/practices/basic/v-on-event-object.vue'
import VonEventModifier from './components/practices/basic/v-on-event-modifier.vue'
import VmodelTwowaybinding from './components/practices/basic/v-model-twoway-binding.vue'
// Style Practice
import StyleExample from './components/practices/basic/StyleExample.vue'
// Script Practice
import VmodelHandling from './components/practices/basic/v-model-handling.vue'
import RefExample from './components/practices/basic/RefExample.vue'
import ReactiveExample from './components/practices/basic/ReactiveExample.vue'
import ComputedExample from './components/practices/basic/ComputedExample.vue'
import WatchExample from './components/practices/basic/WatchExample.vue'
import MultisourceWatch from './components/practices/basic/MultisourceWatch.vue'
import DeepWatch from './components/practices/basic/DeepWatch.vue'
import WatchReactive from './components/practices/basic/WatchReactive.vue'
import WatchEffect from './components/practices/basic/WatchEffect.vue'
import VmodelModifiers from './components/practices/basic/v-model-modifiers.vue'

</script>

<template>
  <main class="practice-list">
    <section class="practice-block">
      <SampleOne />
    </section>

    <section class="practice-block">
      <SampleTwo />
    </section>

    <section class="practice-block">
      <VHtml />
    </section>

    <section class="practice-block">
      <VHtmlXSS />
    </section>

    <section class="practice-block">
      <VText />
    </section>

    <section class="practice-block">
      <VText />
    </section>
    
    <section class="practice-block">
      <VbindBasic />
    </section>

    <section class="practice-block">
      <VbindClass />
    </section>

    <section class="practice-block">
      <VbindStyle />
    </section>

    <section class="practice-block">
      <VShorthand />
    </section>

    <section class="practice-block">
      <VIf />
    </section>

    <section class="practice-block">
      <VShow />
    </section>

    <section class="practice-block">
      <VFor />
    </section>

    <section class="practice-block">
      <VonEventHandler />
    </section>

    <section class="practice-block">
      <VonEventObject />
    </section>

    <section class="practice-block">
      <VonEventModifier />
    </section>

    <section class="practice-block">
      <VmodelTwowaybinding />
    </section>

    <section class="practice-block">
      <StyleExample />
    </section>

    <section class="practice-block">
      <VmodelHandling />
    </section>

    <section class="practice-block">
      <RefExample />
    </section>

    <section class="practice-block">
      <ReactiveExample />
    </section>

    <section class="practice-block">
      <ComputedExample />
    </section>

    <section class="practice-block">
      <WatchExample />
    </section>

    <section class="practice-block">
      <MultisourceWatch />
    </section>  

    <section class="practice-block">
      <DeepWatch />
    </section>

    <section class="practice-block">
      <WatchReactive />
    </section>
  
    <section class="practice-block">
      <WatchEffect />
    </section>

    <section class="practice-block">
      <VmodelModifiers />
    </section>
  </main>
</template>

<style scoped>
/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/style.css';
</style>