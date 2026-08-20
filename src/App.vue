<script setup>
// Template Practice
import SampleTwo from './components/practices/Template/SampleTwo.vue'
import VHtml from './components/practices/Template/v-html.vue'
import VHtmlXSS from './components/practices/Template/v-html XSS.vue'
import VText from './components/practices/Template/v-text.vue'
import VbindBasic from './components/practices/Template/v-bind-basic.vue'
import VbindClass from './components/practices/Template/v-bind-class.vue'
import VbindStyle from './components/practices/Template/v-bind-style.vue'
import VShorthand from './components/practices/Template/v-shorthand.vue'
import VIf from './components/practices/Template/v-if.vue'
import VShow from './components/practices/Template/v-show.vue'
import VFor from './components/practices/Template/v-for.vue'
import VonEventHandler from './components/practices/Template/v-on-event-handler.vue'
import VonEventObject from './components/practices/Template/v-on-event-object.vue'
import VonEventModifier from './components/practices/Template/v-on-event-modifier.vue'
import VmodelTwowaybinding from './components/practices/Template/v-model-twoway-binding.vue'
import VmodelHandling from './components/practices/Template/v-model-handling.vue'
import VmodelModifiers from './components/practices/Template/v-model-modifiers.vue'
// Style Practice
import StyleExample from './components/practices/Style/StyleExample.vue'
// Script/Reactivity Practice
import SampleOne from './components/practices/Script-Reactivity/SampleOne.vue'
import RefExample from './components/practices/Script-Reactivity/RefExample.vue'
import ReactiveExample from './components/practices/Script-Reactivity/ReactiveExample.vue'
import ComputedExample from './components/practices/Script-Reactivity/ComputedExample.vue'
import WatchExample from './components/practices/Script-Reactivity/WatchExample.vue'
import MultisourceWatch from './components/practices/Script-Reactivity/MultisourceWatch.vue'
import DeepWatch from './components/practices/Script-Reactivity/DeepWatch.vue'
import WatchReactive from './components/practices/Script-Reactivity/WatchReactive.vue'
import WatchEffect from './components/practices/Script-Reactivity/WatchEffect.vue'
// Component Practice
import LifecycleParent from './components/practices/Component/LifecycleParent.vue'
import PropsemitsParents from './components/practices/Component/PropsemitsParents.vue'
import SlotdefaultParent from './components/practices/Component/SlotdefaultParent.vue'
import SlotnamedParent from './components/practices/Component/SlotnamedParent.vue'
import SlotscopedParent from './components/practices/Component/SlotscopedParent.vue'
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

    <section class="practice-block">
      <LifecycleParent />
    </section>

    <section class="practice-block">
      <PropsemitsParents />
    </section>

    <section class="practice-block">
      <SlotdefaultParent />
    </section>

    <section class="practice-block">
      <SlotnamedParent />
    </section>

    <section class="practice-block">
      <SlotscopedParent />
    </section>
  </main>
</template>

<style scoped>
/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/style.css';
</style>
