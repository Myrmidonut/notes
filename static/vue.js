const app = new Vue({
  delimiters: ["[[", "]]"],
  el: "#app",
  data: {
    "message": "my Vue",
    "json": undefined
  },
  methods: {
    getData: function() {
      fetch("/json")
      .then(res => res.json())
      .then(data => {
        this.json = data.data
      })
    }
  }
})

app.getData()

/*
lists: [
  {
    id
    title
    collapsed
    archived

    entry {...}
  }
]

entries: [
  {
    id
    header_id
    text
    amount
    done
  }
]

Main:
  add list

List:
  archive
  collapse
  edit

Entry:
  edit
  delete
  check
  add entry
*/