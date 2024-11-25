class Todo {
    constructor(id, title, completed = false) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    markComplete() {
        this.completed = true;
    }

    updateTitle(newTitle) {
        this.title = newTitle;
    }
}

module.exports = Todo;
