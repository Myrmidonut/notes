Vue.component("navbar", {
  delimiters: ["[[", "]]"],

  props: ["page", "username"],

  methods: {
    toggleArchive: function() {
      if (this.page === "list") {
        this.$emit("update:page", "archive")
      } else {
        this.$emit("update:page", "list")
      }
    },

    toggleAccount: function() {
      if (this.page === "list" || this.page === "archive") {
        this.$emit("update:page", "account")
      } else {
        this.$emit("update:page", "list")
      }
    }
  },

  template: `
    <nav>
      <span>[[ username ]]</span>

      <a href="/archive" v-on:click.prevent="toggleArchive">
        <span v-if="page === 'list'">Archive</span>
        <span v-if="page === 'archive'">Notes</span>
      </a>

      <a href="/account" v-on:click.prevent="toggleAccount">
        <span v-if="page === 'list'">Account</span>
        <span v-if="page === 'archive'">Account</span>
        <span v-if="page === 'account'">Notes</span>
      </a>

    </nav>
  `
})

Vue.component("my-footer", {
  template: `
    <footer>
      <a href="https://github.com/Myrmidonut/notes" target="_blank">by Frederik</a>
    </footer>
  `
})

Vue.component("archive", {
  delimiters: ["[[", "]]"],

  props: ["lists", "token", "page"],

  filters: {
    lineThrough: function (checked) {
      if (checked) {
        return "text-decoration: line-through; color: gray;"
      }
    }
  },

  methods: {

    // LISTS:

    deleteList: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)

      fetch("/api/delete_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    updateList: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("title", e.target[0].value)

      fetch("/api/update_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    archiveList: function(e, id) {
      let archived

      this.lists[id].archived ? archived = false : archived = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("archived", archived)

      fetch("/api/archive_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    collapseList: function(e, id) {
      let collapsed

      this.lists[id].collapsed ? collapsed = false : collapsed = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("collapsed", collapsed)

      fetch("/api/collapse_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    // ITEMS:

    newItem: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("text", e.target[0].value)
      body.append("id", id)

      fetch("/api/new_item/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)

        e.target[0].value = ""
      })
    },

    deleteItem: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)

      fetch("/api/delete_item/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    checkItem: function(e, id, listId) {
      let checked

      this.lists[listId].items[id].checked ? checked = false : checked = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("checked", checked)

      fetch("/api/check_item/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    updateItem: function(e, id) {
      const text = e.target[0].value

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("text", text)
      body.append("id", id)

      fetch("/api/update_item/", {
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
    <div v-if="page === 'archive'">
      <div class="card-container">
        <template v-if="lists !== undefined">
          <template v-for="list in lists">
            <template v-if="list.archived">
              <div class="card">
                <div class="card-row">

                  <form action="" method="post" v-on:submit.prevent="updateList($event, list.id)">
                    <input class="title" type="text" name="title" :value="[[ list.title ]]">
                    <button type="submit" title="Save"><i class="fas fa-save"></i></button>
                  </form>

                  <div class="card-row-buttons">

                    <button title="Delete" v-on:click="deleteList($event, list.id)"><i class="fas fa-trash-alt"></i></button>

                    <button title="Collapse" v-on:click="collapseList($event, list.id)">
                      <template v-if="list.collapsed">
                        <i class="fas fa-angle-down"></i>
                      </template>
                      <template v-if="!list.collapsed">
                        <i class="fas fa-angle-up"></i>
                      </template>
                    </button>

                    <button title="Restore" v-on:click="archiveList($event, list.id)"><i class="fas fa-eye"></i></button>

                  </div>
                </div>

                <div class="card-body" v-if="!list.collapsed">
                  <ul>
                    <template v-for="item in list.items">
                      <template v-if="item.header_id === list.id">
                        <li class="card-row" :id="item.id">

                          <form action="" method="post" v-on:submit.prevent="updateItem($event, item.id)">
                            <input class="item" type="text" name="text" :value="item.text" :style="item.checked | lineThrough">
                            <button type="submit" title="Save"><i class="fas fa-save"></i></button>
                          </form>

                          <div class="card-row-buttons">
                            <button title="Check" v-on:click.submit.prevent="checkItem($event, item.id, list.id)"><i class="fas fa-check"></i></button>
                            <button title="Delete" v-on:click.submit.prevent="deleteItem($event, item.id)"><i class="fas fa-minus"></i></button>
                          </div>

                        </li>
                      </template>
                    </template>
                  </ul>

                  <div class="card-row">

                    <form action="" method="post" v-on:submit.prevent="newItem($event, list.id)">
                      <input class="item" type="text" name="text" placeholder="new item">
                      <button title="Add" type="submit"><i class="fas fa-plus"></i></button>
                    </form>

                  </div>
                </div>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
  `
})

Vue.component("list", {
  delimiters: ["[[", "]]"],

  props: ["lists", "token", "page"],

  filters: {
    lineThrough: function (checked) {
      if (checked) {
        return "text-decoration: line-through; color: gray;"
      }
    }
  },

  methods: {

    // LISTS:

    newList: function(e) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("title", e.target[0].value)

      fetch("/api/new_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)

        e.target[0].value = ""
      })
    },

    updateList: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("title", e.target[0].value)

      fetch("/api/update_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    archiveList: function(e, id) {
      let archived

      this.lists[id].archived ? archived = false : archived = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("archived", archived)

      fetch("/api/archive_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    collapseList: function(e, id) {
      let collapsed

      this.lists[id].collapsed ? collapsed = false : collapsed = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("collapsed", collapsed)

      fetch("/api/collapse_list/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    // ITEMS:

    newItem: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("text", e.target[0].value)
      body.append("id", id)

      fetch("/api/new_item/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)

        e.target[0].value = ""
      })
    },

    deleteItem: function(e, id) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)

      fetch("/api/delete_item/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    checkItem: function(e, id, listId) {
      let checked

      this.lists[listId].items[id].checked ? checked = false : checked = true

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("id", id)
      body.append("checked", checked)

      fetch("/api/check_item/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:lists", data)
      })
    },

    updateItem: function(e, id) {
      const text = e.target[0].value

      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("text", text)
      body.append("id", id)

      fetch("/api/update_item/", {
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
    <div v-if="page === 'list'">
      <div class="new-list">

        <form action="new_list/" method="post" v-on:submit.prevent="newList($event)">
          <input type="text" name="title" placeholder="new list">
          <button title="Add" type="submit"><i class="fas fa-plus"></i></button>
        </form>

      </div>

      <div class="card-container">
        <template v-if="lists !== undefined">
          <template v-for="list in lists">
            <template v-if="!list.archived">
              <div class="card">
                <div class="card-row">

                  <form action="" method="post" v-on:submit.prevent="updateList($event, list.id)">
                    <input class="title" type="text" name="title" :value="[[ list.title ]]">
                    <button title="Save" type="submit"><i class="fas fa-save"></i></button>
                  </form>

                  <div class="card-row-buttons">

                    <button title="Collapse" v-on:click="collapseList($event, list.id)">
                      <template v-if="list.collapsed">
                        <i class="fas fa-angle-down"></i>
                      </template>
                      <template v-if="!list.collapsed">
                        <i class="fas fa-angle-up"></i>
                      </template>
                    </button>

                    <button title="Archive" v-on:click="archiveList($event, list.id)"><i class="fas fa-eye-slash"></i></button>

                  </div>
                </div>

                <div class="card-body" v-if="!list.collapsed">
                  <ul>
                    <template v-for="item in list.items">
                      <template v-if="item.header_id === list.id">
                        <li class="card-row" :id="item.id">

                          <form action="" method="post" v-on:submit.prevent="updateItem($event, item.id)">
                            <input class="item" type="text" name="text" :value="item.text" :style="item.checked | lineThrough">
                            <button title="Save" type="submit"><i class="fas fa-save"></i></button>
                          </form>

                          <div class="card-row-buttons">
                            <button title="Check" v-on:click.submit.prevent="checkItem($event, item.id, list.id)"><i class="fas fa-check"></i></button>
                            <button title="Delete" v-on:click.submit.prevent="deleteItem($event, item.id)"><i class="fas fa-minus"></i></button>
                          </div>

                        </li>
                      </template>
                    </template>
                  </ul>

                  <div class="card-row">

                    <form action="" method="post" v-on:submit.prevent="newItem($event, list.id)">
                      <input class="item" type="text" name="text" placeholder="new item">
                      <button title="Add" type="submit"><i class="fas fa-plus"></i></button>
                    </form>

                  </div>
                </div>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
  `
})

Vue.component("account", {
  delimiters: ["[[", "]]"],

  props: ["token", "page", "username"],

  methods: {
    resetToken() {
      this.$parent.getCookie('csrftoken')
    },

    getData() {
      this.$parent.getData()
    },
    
    signin: function(e) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("username", e.target[0].value)
      body.append("password", e.target[1].value)

      fetch("/account/signin/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:username", data.username)

        this.resetToken()
        this.getData()

        this.$emit("update:page", "list")
      })
    },

    signout: function() {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      fetch("/account/signout/", {
        method: "post",
        headers: headers
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:username", "Anonymous")

        this.resetToken()
        this.getData()

        this.$emit("update:page", "list")
      })
    },

    signup: function(e) {
      let headers = new Headers()
      headers.append("X-CSRFToken", this.token)

      let body = new FormData()
      body.append("username", e.target[0].value)
      body.append("password", e.target[1].value)

      fetch("/account/signup/", {
        method: "post",
        headers: headers,
        body: body
      })
      .then(res => res.json())
      .then(data => {
        this.$emit("update:username", data.username)

        this.resetToken()
        this.getData()

        this.$emit("update:page", "list")
      })
    }
  },

  template: `
  <div v-if="page === 'account'">
    <div class="account">

      <button title="Sign Out" v-on:click="signout">Logout</button>

      <form class="account-form" action="" method="post" v-on:submit.prevent="signin($event)">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Login</button>
      </form>

      <form class="account-form" action="" method="post" v-on:submit.prevent="signup($event)">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Register</button>
      </form>

    </div>
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
      "page": "list",
      "username": "Anonymous"
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
      fetch("/api/get_all")
      .then(res => res.json())
      .then(data => {
        this.lists = data.data
        this.username = data.username
      })
    }
  }
})