class Message{
    constructor(author, body, log){
        this.author = author;
        this.body   = body;
        this.date   = new Date();
        this.log    = !!log;
    }
}

module.exports = Message;