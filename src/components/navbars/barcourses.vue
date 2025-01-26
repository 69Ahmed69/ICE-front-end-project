<script setup>
import {MagnifyingGlassIcon,} from '@heroicons/vue/24/outline'
import { reactive ,defineProps  } from 'vue';
import PagesNumberComp from '../PagesNumberComp.vue';


const props=defineProps({
  courses:
  {
    type:Array||Object,
    Required:true,
  },
  totalstudient:
  {
    type:Number,
  },
  page:{
    default:false
  },
  filernbr:Number,
})

const vars= reactive({
    thefilternumber:Number,
    sortes:["most students","Z-A","A-Z","most stars"],
    sortescourses:[],
    catname:"",
    Suggestion:["user interface","user experience","web design","interface","app"] ,//its will be updated when the json file completed
    coursessorted:[]
})
vars.thefilternumber=props.filernbr
function studients(coursese)
{
  let studient=0
 for(let x=0;x<coursese.length;x++)
  {
    vars.catname=coursese[0].category
    studient+=Number(coursese[x].students);

  }

return studient

}
const x=reactive("most stars");

</script>
<!--*************************************************************************************************************************************************-->
<template>
<section>
  <section>
 
 <div class="containertop max-w-7xl mx-auto px-4">
<div class="left ">
  <div class="filter" @click="$emit('changeFilter')">
   <img src="/src/assets/img/Faders.png" alt="" style="height: 20px; width: 20px;">
   <p style="font: 20px bold;">filter</p>
   <p style="background-color: #9CE0FF80;color: #29C8F0; padding:0 5px ;">{{ vars.thefilternumber }}</p>
  </div>
  <div class=" relative max-w-64">
           <MagnifyingGlassIcon
             class="size-6 text-gray_2 absolute left-2 top-1/2 transform -translate-y-1/2"
             aria-hidden="true"
           />
           <input
             type="text"
             id="inpt"
             placeholder="What do you want to learn..."
             class="bar rounded-full bg-transparent px-10 py-3 font-regular text-gray_1 shadow-lg ring-1 ring-gray_3 hover:bg-fourth hover:ring-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
             @input="$emit('changecourses',$event.target.value)"
           />
         </div>
</div>
<div class="right">
   <p>sort by :</p>
   <select v-model="x"  @change="$emit('changeSort', x) "  class="filter">
       <option  selected v-for="(sort,index) in vars.sortes" :key="index" :value=sort>{{sort}}</option>
   </select >
   
</div>
</div>
<div class="containerbottom max-w-7xl mx-auto px-4">
 <div class="left">
   <p>suggestion :</p>
   <ul style="display: flex;gap: 10px;">
     <li v-for="(seg,i) in vars.Suggestion" :key="i">
        <p style="color: #29C8F0;"><a href="">{{ seg }}</a> </p>
     </li>
   </ul>
 </div>
 <div class="right">
   <p>{{ studients($props.courses ) || totalstudient + " " }}<span v-if="page" style="color: #3B444AB2;">results find for {{vars.catname }}</span>
     <span v-else style="color: #3B444AB2;">results find for {{ "all courses"}}</span></p>
 </div>
</div>
<div v-if="page">
 <PagesNumberComp v-if="courses " :courses="sorted(courses)"/>
  <PagesNumberComp v-else />
</div>
</section>

</section>
</template>
<style scoped>
.containertop
{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.bar {
    background-color: #F2FDFF;
    
}
.left
{
    display: flex;
    gap: 20px;
}
.right
{
    display: flex;
    align-items: center;
    gap: 10px;
}
.filter 
{
display: flex;
flex-direction: row;
gap:20px;
border-radius: 25px;
border: solid 1px #28c8fa;
padding:10px 20px;
align-items: center;
cursor: pointer;
background-color: #F2FDFF;
}
.containerbottom 
{
  display: flex;
  justify-content: space-between;
  background-color: #F2FDFF;
  padding: 20px 0;
}
</style>