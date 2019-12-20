<template>
    <div style="display:contents">
        <slot v-if="visible">
        </slot>
    </div>
</template>
<script>
export default {
    name:'DelayRender',
    props:{
        delayTime:{
            type: Number,
            default: 500,
            description: 'Delay time in ms'
        }
    },
    mounted(){
        console.log('delaying render')
        this.timer = setTimeout(()=>{
            this.visible = true;
        }, this.delayTime);
    },
    beforeDestroy(){
     this.destroyTimer();
    },
    methods:{
        destroyTimer(){
            if(this.timer){
                clearTimeout(this.timer);
            }
        }
    },
    data(){return {
        visible: false,
        timer:null
      }
    }
}
</script>