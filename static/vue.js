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
        console.log(data)
        
        this.json = data
      })
    }
  }
})

app.getData()