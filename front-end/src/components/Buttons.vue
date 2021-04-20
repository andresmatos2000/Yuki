<template>
    <div v-if="!loading" class="main">
        <div class="members">
            <div class="btn" v-bind:value="user.firstName" v-for="user in this.users" :key="user._id"
                @click="selectUser(user, $event)">{{user.firstName}}</div>
        </div>
        <h3 v-if="this.clockedIn && this.clockedIn.length > 0">Currently Clocked In</h3>
        <div v-for="clockedIn in this.clockedIn" :key="clockedIn._id">

            <p>{{clockedIn.user.firstName}}</p>
            <p>Clocked in: {{clockedIn.since}} ago</p>
        </div>
        <button class="large_btn green" @click="clockIn()">Clock In</button>
        <button class="large_btn red" @click="ClockOut()">Clock Out</button>
    </div>
</template>
<script>
    import axios from 'axios'
    import moment from 'moment'
    export default {
        name: "Buttons",
        data() {
            return {
                users: [],
                activeUser: null,
                clockedIn: null,
                ticket: '',
                loading: true,
            }
        },
        created() {
            this.getUser();
            this.getUsers();
            this.getClockedIn();
            this.activeUser = this.$root.$data.user;

        },
        methods: {
            async getUser() {
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
            //Get users and push to array
            async getUsers() {
                try {
                    let response = await axios.get('/api/users/all');
                    response.data.user.forEach(e => {
                        e.isClockedIn = false;
                        this.users.push(e)
                    })
                } catch (error) {
                    this.errorLogin = "Error: " + error.response.data.message;
                    this.$root.$data.user = null;
                }
            },
            selectUser(user, event) {
                document.querySelectorAll(".members > div").forEach(e => {
                    e.classList.remove("darken")
                })
                event.target.classList.add("darken");
                this.activeUser = user;
            },
            async clockIn() {
                if(this.isClockedIn() === true)
                return alert("Clock out first!");
                try {
                    await axios.post("/api/time", {
                        activeUser: this.activeUser,
                        clockIn: moment().format()
                    });
                    this.getClockedIn();
                    return true;
                } catch (error) {
                    //console.log(error);
                }
            },
            async getClockedIn() {
                let clocked = await axios.get("/api/time/clocked-in");
                this.clockedIn = clocked.data.time;
                let now = moment();
                this.clockedIn.forEach(e => {
                    e.since = moment.duration(moment(e.clockIn).diff(now)).humanize();
                })
                this.loading = false;
            },
            async ClockOut() {
                console.log(this.isClockedIn())
                if(this.isClockedIn() == undefined)
                return alert("Please select user and clock in!");
                try {
                    await axios.put('/api/time/' + this.activeUser._id, {
                        clockOut: moment().format()
                    });
                    this.getClockedIn();

                } catch (error) {
                    this.error = error.response;
                }

            },
            isClockedIn() {
                if (this.clockedIn.some(e => e.user._id === this.activeUser._id))
                        return true;
            }
        }
    }
</script>
<style scoped>
    .large_btn {
        height: 100px;
        width: 200px;
        border: none;
        box-shadow: 4px 4px 10px rgb(82, 82, 82);
        outline: none;
        margin: 10%;
        border-radius: 5%;
    }

    .large_btn:hover {
        filter: brightness(.8);
        cursor: pointer;
    }

    .darken {
        background-color: white;
        filter: brightness(0.9);
    }

    .large_btn:active {
        filter: brightness(1);
    }

    .members {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-evenly;
        align-items: center;
    }

    .wide_btn {
        width: 100px;
        margin: 1rem;
        border: none;
        box-shadow: 4px 4px 10px rgb(82 82 82);
        outline: none;
        border-radius: 5%;
    }

    .green {
        background-color: green;
    }

    .red {
        background-color: red;
    }

    .main {
        margin-top: 3rem;
    }
</style>