<template>
    <div>
        <h2 v-if="this.loading">Loading...</h2>
        <div v-if="!this.loading">
            <h2>Analytics</h2>
            <div class="container">
                <table class="table" v-for="date in this.dates" :key="date.date">
                    <thead>
                        <tr>
                            <th colspan="4" class="center">{{date.date}}</th>
                        </tr>
                        <tr>
                    <th>User</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Duration</th>
                    </tr>
                    </thead>
                    <tbody>
                <tr v-for="time in date.times" :key="time._id">
                    <td>{{time.user.firstName}}</td>
                    <td>{{time.clockIn}}</td>
                    <td>{{time.clockOut}}</td>
                    <td>{{time.since}}</td>
                </tr>
                </tbody>
                </table>
            </div>
        </div>



    </div>

</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
    data(){
        return {
            times: null,
            dates: [],
            loading: true
        }
    },
    created(){
        this.getTimes();
        this.getUser();
    },
    methods: {
        async getUser(){
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
        let firstInitial = response.data.user.firstName.charAt(0);
        let lastInitial = response.data.user.lastName.charAt(0);
        console.log(firstInitial, lastInitial)
        this.$root.$data.initials = `${firstInitial}${lastInitial}`;
    } catch (error) {
      this.$root.$data.user = null;
    }
    },
        //check to make sure its deleting everything not just a single item
        async getTimes(){
            try{
                let clocked = await axios.get("/api/time/all-finished");
                this.times = clocked.data.time;
                console.log("times",this.times)
                //console.log(this.times);
                this.times.forEach(e => {
//Set date for later use
                let date = moment(e.clockIn).format('MMMM Do');
                e.since = moment.duration(moment(e.clockOut).diff(moment(e.clockIn))).humanize();
                e.clockIn = moment(e.clockIn).format('h:mm a');
                e.clockOut = moment(e.clockOut).format('h:mm a');
//Use date
                let index = this.dates.map(function(o) { return o.date; }).indexOf(date);
                if(index != -1){
                    //Pushes after first push
                    this.dates[index].times.push({since: e.since, user: e.user, clockIn: e.clockIn, clockOut: e.clockOut, id: e._id});
                    //console.log("contains")
                } else{
                    //first Push
                    //console.log("first push");
                    this.dates.push({date: date, times:[]});
                    //console.log(this.dates);
                    index = this.dates.map(function(o) { return o.date; }).indexOf(date);
                    //console.log(index);
                    this.dates[index].times.push({since: e.since, user: e.user, clockIn: e.clockIn, clockOut: e.clockOut, id: e._id});
                    //console.log("ended");
                }
                this.loading = false;
            });
            //console.log(this.dates)
            } catch (error) {
        this.error = error.response.message;
      }
        }
    }
}
</script>
<style scoped>
.container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
.table {
    flex-basis: 25%;
    margin: 1rem;
    min-width: fit-content;
}

table {
  background: rgb(192, 240, 255); 
  border: 0; 
  border-collapse: separate; 
  border-spacing: 0 5px;
}
thead th {
  border-bottom: 1px solid black; 
  border-collapse: separate; 
  border-spacing: 5px 5px;
} 
    td,th {
        padding:15px
    }
    .center {
        text-align: center;
        border-bottom: none;
    }
</style>