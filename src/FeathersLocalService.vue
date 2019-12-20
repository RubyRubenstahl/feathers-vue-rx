<template>
<div style="display:contents">
<slot></slot>
</div>
</template>
<script>
import feathers from '@feathersjs/feathers'
import feathersMemory from 'feathers-memory';

export default {
  inject: ["feathers"],
  name: 'FeathersLocalService',
  props:{
      data:{
          type: Array,
          default: ()=>([])
      },
      name: {
          required: 'true',
          type: String,
      },
      hooks:{
          defaul: null,
          type: Object
      },
      id: {
          default: 'id',
          type: String
      },
      paginate:{
          default: false,
          type: [Boolean, Object]
      },
      multi: {
          default: true,
          type: Boolean
      },
      backingService:{
          default: null,
          type: String
      },
      query:{
          default: null
      }
  },
  created(){
      const service = feathersMemory({
          store:this.data,
          id:this.id,
          paginate: this.paginate      
      })
      const serviceName = `${this.name}.local`
      this.feathers.app.use( `/${serviceName}`, service)
      if(this.hooks){
          this.feathers.app.service(serviceName).hooks(this.hooks);
      }

      if(this.backingService){
          this.configureBackingService();
      }
     
  },
  methods:{
      configureBackingService(){
          const backingService = this.feathers.app.service(this.backingService);
          backingService.find({query: this.query|| {}}).then(res=>{
              debugger
              this.data = res.total ? res.data : res;
          }).catch(err=>console.error(err))
      }
  }
};
</script>
