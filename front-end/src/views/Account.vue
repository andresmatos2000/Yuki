<template>
    <div>
        <h2 v-if="this.loading">Loading...</h2>
        <div v-if="!this.loading"> 
            <h2>Logged in as: {{this.user.firstName}} </h2>
            <!-- {{this.times}} -->
            <div class="container" v-if="this.times && this.times.length > 0">
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="time in this.times" :key="time._id">
                            <td><input type="date" v-model="time.dateIn"><input id="test" type="time" v-model="time.timeIn">
                            </td>
                            <td><input type="date" v-model="time.dateOut"><input id="test" type="time"
                                    v-model="time.timeOut"></td>
                            <td>{{time.total}}</td>
                            <td><button class="btn" @click="update(time)">Update</button></td>
                            <td><button class="btn" @click="deleter(time)">Delete</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div><button class="btn" @click="deletePopup">Delete Account</button></div>
            <div v-if="popup" class="popupContainer">
                <div class="popup">
                    <h2>Are you sure you want to <strong><i style="color: red">Delete</i></strong> your account?</h2>
                    <button class="btn" @click="deleteAccount">Delete Account</button>
                    <button class="btn" @click="deletePopup">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import moment from 'moment'
    export default {
        name: "Account",
        data() {
            return {
                user: '',
                times: null,
                dates: [],
                popup: false,
                loading: true
            }
        },
        created() {
            this.getUser();
        },
        methods: {
            async deleteAccount(){
                try{
                    await axios.delete('/api/users/' + this.user._id);
                    await axios.delete('/api/time/all/' + this.user._id)
                    this.$router.push('/');
                    this.$root.$data.initials = '';
                    return true;
                } catch(error){
                    return error;
                }
            },
            deletePopup(){
                this.popup = !this.popup;
            },
            async getUser(){
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
        this.user = response.data.user;
        let firstInitial = response.data.user.firstName.charAt(0);
        let lastInitial = response.data.user.lastName.charAt(0);
        //console.log(firstInitial, lastInitial)

        this.$root.$data.initials = `${firstInitial}${lastInitial}`;
    this.getData();
    } catch (error) {
      this.$root.$data.user = null;
    }
    },
            async getData() {
                let data = await axios.get('/api/time');
                this.times = data.data.time;
                this.times.forEach(e => {
                    //console.log(e) //.match(/(\d\d:\d\d)/g)
                    e.temp1 = moment(e.clockIn);
                    e.temp2 = moment(e.clockOut);
                    e.timeIn = e.temp1.format("HH:mm");
                    e.timeOut = e.temp2.format("HH:mm");
                    e.dateIn = e.temp1.format("YYYY-MM-DD");
                    e.dateOut = e.temp2.format("YYYY-MM-DD");
                    //console.log(e)
                });
                this.loading = false;
            },
            async update(time) {
                    let timeIn = `${time.dateIn}T${time.timeIn}:00-04:00`;
                    let timeOut = `${time.dateOut}T${time.timeOut}:00-04:00`;
                    //console.log(timeIn, timeOut);
                    try {
                         await axios.put("/api/time/" + time._id,{
                            timeIn,
                            timeOut
                        });
                        //console.log(response.message);
                        this.getData();
                    }catch(error){
                    return alert(error.response.data);        
                    }
                    
            },
            async deleter(time) {
                try {
                    await axios.delete("/api/time/" + time._id);
                    this.getData();
                    return true;
                } catch (error) {
                    //console.log(error);
                }
            },
        },
    }
</script>
<style scoped>

.container {
        display: flex;
    justify-content: space-around;
}
.popupContainer {
    background: grey;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
}
.popup{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
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

    td,
    th {
        padding: 15px
    }
</style>