<template>
  <section class="chatbox" v-if="user.length > 0">
    <audio src="/som.mp3" ref="audio"></audio>
    <div class="left">
      <ul class="messages" ref="msgs">
        <li v-for="(message, i) in messages" :key="i" :class="{'me': message.author === user, 'log': message.log}">
          <img src="http://www.iconarchive.com/download/i7734/hopstarter/sleek-xp-basic/Administrator.ico" class="author-image" />
          <span class="author-name">{{message.author}}</span>
          <p class="body">{{message.body}}</p>
        </li>
        <li v-for="(u, i) in usersTyping" :key="i">{{u.name}}</li>
      </ul>
      <textarea @keydown.enter.prevent="send" v-model="message"></textarea>
    </div>
    <div class="right">
      <ul class="users">
        <li v-for="(u, i) in users" :key="i">
          <p>{{u.name}}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="stylus" src="./styles/chatbox.styl"></style>

<script>
import Message from './classes/Message';

export default {
  data(){
    return {
      user: prompt("Qual o seu nome?"),
      messages: [],
      users : [],
      isTyping  : null,
      message : '',
      focused: true,
      originalTitle: document.title,
      blinkTileInt: null
    }
  },
  watch: {
    message(){
      this.typing();
    }
  },
  sockets: {
    chatError(e){
      alert(e);
    },
    message(newMessage){
      this.messages.push(newMessage);
      if(newMessage.author != this.user && !this.focused){
        this.$refs.audio.play();
        this.blinkTitle(`${newMessage.author} te enviou uma mensagem.`);
        }
    },
    updateUsers(users){
      this.users = users;
    },
    log(msg){
      this.log(msg);
    }
  },
  mounted(){
      this.$socket.emit('login', this.user);
      window.onfocus= () => {
        this.focused = true;
        this.stopBlinkTitle();
      }
      window.onblur= () => this.focused = false;
  },
  computed: {
    usersTyping(){
      return this.users.filter(u => u.typing && u.name !== this.user);
    }
  },
  methods: {
    blinkTitle(title){
      this.blinkTileInt = setInterval(() => {
        document.title = document.title == title ? this.originalTitle : title;
      }, 1000);
    },
    stopBlinkTitle(){
      clearInterval(this.blinkTileInt);
      document.title = this.originalTitle;
    },
    log(message){
      const msg = new Message('', message, true);
      this.messages.push(msg);
    },
    typing(){
      clearTimeout(this.isTyping);

      this.isTyping = setTimeout(() => {
        this.$socket.emit('stop-typing', this.user);
        console.log("Parou")
      }, 500);

      this.$socket.emit('typing', this.user);
    },
    send(){
      const msg = new Message(this.user, this.message, false);
      this.$socket.emit('stop-typing', this.user);
      this.$socket.emit('message', msg);
      this.message = '';
    }
  },
  updated(){
    const {msgs} = this.$refs;
    msgs.scrollTop = msgs.clientHeight + msgs.scrollHeight; 
  }
}
</script>


