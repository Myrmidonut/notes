const app = new Vue({
  delimiters: ["[[", "]]"],
  el: "#app",
  data: {
    "message": "my Vue",
    "lists": undefined
  },
  methods: {
    getData: function() {
      fetch("/get_all")
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    },

    // LISTS:

    newList: function(e) {
      let headers = new Headers()
      headers.append("X-CSRFToken", e.target[0].value)

      let body = new FormData()
      body.append("title", e.target[1].value)

      fetch("/new_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    },

    updateList: function(e) {
      const id = e.target.parentElement.id

      let headers = new Headers()
      headers.append("X-CSRFToken", e.target[0].value)

      let body = new FormData()
      body.append("id", id)
      body.append("title", e.target[1].value)

      fetch("/update_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    },

    archiveList: function(e) {
      const id = e.target.parentElement.id
      let archived

      this.lists[id].archived ? archived = false : archived = true

      let headers = new Headers()
      headers.append("X-CSRFToken", e.target.parentElement.childNodes[0].value)

      let body = new FormData()
      body.append("id", id)
      body.append("archived", archived)

      fetch("/archive_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    },

    collapseList: function(e) {
      const id = e.target.parentElement.id
      let collapsed

      this.lists[id].collapsed ? collapsed = false : collapsed = true

      let headers = new Headers()
      headers.append("X-CSRFToken", e.target.parentElement.childNodes[0].value)

      let body = new FormData()
      body.append("id", id)
      body.append("collapsed", collapsed)

      fetch("/collapse_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    },

    // ENTRIES:

    newEntry: function(e) {
      const id = e.target.parentElement.id

      let headers = new Headers()
      headers.append("X-CSRFToken", e.target[0].value)

      let body = new FormData()
      body.append("text", e.target[1].value)
      body.append("amount", e.target[2].value)
      body.append("id", id)

      fetch("/new_entry/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    },

    deleteEntry: function(e) {
      const id = e.target.parentElement.id

      let headers = new Headers()
      headers.append("X-CSRFToken", e.target.parentElement.childNodes[0].value)

      let body = new FormData()
      body.append("id", id)

      fetch("/delete_entry/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    }

  }
})

app.getData()

/*
id
title
archived
collapsed
*/

/*
"1": {
  "id": 1,
  "title": "food",
  "collapsed": false,
  "archived": false,
  "entries": {
    "1": {
      "id": 1,
      "header_id": 1,
      "text": "apple",
      "amount": 2,
      "done": true
    },
    "2": {
      "id": 2,
      "header_id": 1,
      "text": "banana",
      "amount": 5,
      "done": false
    }
  }
},
"2": {
  ...
}
*/