Vue.component("navbar", {
  props: ["archive"],

  methods: {

    toggleArchive: function() {
      if (this.archive) {
        this.$emit("update:archive", false)
      } else {
        this.$emit("update:archive", true)
      }
    }
  },

  template: `
    <nav>
      <a href="">Account</a>
      <a href="/archive" v-on:click.prevent="toggleArchive">Archive</a>
      <hr>
    </nav>
  `
})

Vue.component("my-footer", {
  template: `
    <footer>
      <hr>
      This is my footer.
    </footer>
  `
})

Vue.component("archive", {
  delimiters: ["[[", "]]"],

  props: ["lists", "token", "archive"],

  methods: {

    archiveList: function(e) {
      const id = e.target.parentElement.id
      let archived

      this.lists[id].archived ? archived = false : archived = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

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
        this.$emit("update:lists", data)
      })
    },

    collapseList: function(e) {
      const id = e.target.parentElement.id
      let collapsed

      this.lists[id].collapsed ? collapsed = false : collapsed = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

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
        this.$emit("update:lists", data)
      })
    },
  },

  template: `
    <div v-if="archive">
      <template v-if="lists !== undefined">
        <div v-for="list in lists" :id="list.id">
          <template v-if="list.archived">

            <p>[[ list.title ]]</p>

            <button v-on:click="archiveList($event)">Restore</button>
            <button v-on:click="collapseList($event)">Collapse</button>

            <ul style="padding: 0">
              <template v-for="entry in list.entries">
                <template v-if="entry.header_id === list.id">
                  <li :id="entry.id">
                    <p>[[ entry.amount ]] [[ entry.text ]] - Checked: [[ entry.done ]]</p>
                  </li>
                </template>
              </template>
            </ul>

          </template>
        </div>
      </template>
    </div>
  `
})

Vue.component("list", {
  props: ["lists", "token", "archive"],

  methods: {
    // LISTS:

    newList: function(e) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("title", e.target[0].value)

      fetch("/new_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    updateList: function(e) {
      const id = e.target.parentElement.id

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("title", e.target[0].value)

      fetch("/update_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    archiveList: function(e) {
      const id = e.target.parentElement.id
      let archived

      this.lists[id].archived ? archived = false : archived = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

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
        this.$emit("update:lists", data)
      })
    },

    collapseList: function(e) {
      const id = e.target.parentElement.id
      let collapsed

      this.lists[id].collapsed ? collapsed = false : collapsed = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

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
        this.$emit("update:lists", data)
      })
    },

    // ENTRIES:

    newEntry: function(e) {
      const id = e.target.parentElement.id

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("text", e.target[0].value)
      body.append("amount", e.target[1].value)
      body.append("id", id)

      fetch("/new_entry/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    deleteEntry: function(e) {
      const id = e.target.parentElement.id

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)

      fetch("/delete_entry/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    checkEntry: function(e) {
      const id = e.target.parentElement.id
      const listId = e.target.parentElement.parentElement.parentElement.id
      let checked

      this.lists[listId].entries[id].done ? checked = false : checked = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("checked", checked)

      fetch("/check_entry/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    updateEntry: function(e) {
      const id = e.target.parentElement.id
      const amount = e.target[1].value ? e.target[1].value : 1

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("text", e.target[0].value)
      body.append("amount", amount)
      body.append("id", id)

      fetch("/update_entry/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    }
  },

  template: `
    <div v-if="!archive">
      <form action="new_list/" method="post" v-on:submit.prevent="newList($event)">
        <input type="text" name="title" placeholder="New list">
        <input type="submit" value="Add">
      </form>

      <template v-if="lists !== undefined">
        <div v-for="list in lists" :id="list.id">
          <template v-if="!list.archived">

            <hr>

            <!--
            <p>[[ list.title ]]</p>
            <p>id: [[ list.id ]]</p>
            <p>Archived: [[ list.archived ]]</p>
            <p>Collapsed: [[ list.collapsed ]]</p>
            -->

            <form action="" method="post" v-on:submit.prevent="updateList($event)">
              <input type="text" name="title" :value="[[ list.title ]]">
              <input type="submit" value="Save">
            </form>

            <button v-on:click="archiveList($event)">Archive</button>
            <button v-on:click="collapseList($event)">Collapse</button>

            <ul style="padding: 0">
              <template v-for="entry in list.entries">
                <template v-if="entry.header_id === list.id">
                  <li :id="entry.id">

                    <!--
                    <p>[[ entry.amount ]] [[ entry.text ]] - Checked: [[ entry.done ]]</p>
                    <p>id: [[ entry.id ]]</p>
                    -->

                    <form action="" method="post" v-on:submit.prevent="updateEntry($event)">
                      <input type="text" name="text" :value="[[ entry.text ]]">
                      <input type="number" name="amount" :value="[[ entry.amount ]]">
                      <input type="submit" value="Save">
                    </form>

                    <button v-on:click="deleteEntry($event)">Delete</button>
                    <button v-on:click="checkEntry($event)">Check</button>
                  </li>
                </template>
              </template>
            </ul>

            <form action="" method="post" v-on:submit.prevent="newEntry($event)">
              <input type="text" name="text" placeholder="New item">
              <input type="number" name="amount" placeholder="Amount">
              <input type="submit" value="Add">
            </form>

          </template>
        </div>
      </template>
    </div>
  `
})

new Vue({
  delimiters: ["[[", "]]"],

  el: "#app",

  data: function() {
    return {
      "token": undefined,
      "lists": undefined,
      "archive": false
    }
  },

  mounted: function() {
    this.getCookie('csrftoken')
    this.getData()
  },

  methods: {
    getCookie: function(name) {
      let cookieValue = null;

      if (document.cookie && document.cookie != '') {
        let cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();

          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }

      this.token = cookieValue;
    },

    getData: function() {
      fetch("/get_all")
      .then(res => res.json())
      .then(data => {
        this.lists = data
      })
    }
  }
})