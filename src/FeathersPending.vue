<template>
  <div class="lds-pending">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script>
export default {
  name: "FeathersPending"
};
</script>
<style>
.lds-pending {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-pending div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: #ccc;
  animation: lds-pending 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-pending div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
  background-color: "green";
}
.lds-pending div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-pending div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-pending {
  0% {
    top: 8px;
    height: 64px;
  }
  50%,
  100% {
    top: 24px;
    height: 32px;
  }
}
</style>
