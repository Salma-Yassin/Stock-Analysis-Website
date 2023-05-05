
class Mediator {
    constructor() {
      this.handlers = {};
    }
  
    register(key, handler) {
      if (!this.handlers[key]) {
        this.handlers[key] = [];
      }
      this.handlers[key].push(handler);
    }
  
    unregister(key, handler) {
      if (!this.handlers[key]) {
        return;
      }
      const index = this.handlers[key].indexOf(handler);
      if (index !== -1) {
        this.handlers[key].splice(index, 1);
      }
    }
  
    notify(key, data) {
      if (!this.handlers[key]) {
        return;
      }
      this.handlers[key].forEach(function(handler) {
        handler(data);
      });
    }
  }

  export { Mediator };