<template>
  <section>
    <section class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">VindThing</h1>
          <h2>Finds your things!</h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2 class="subtitle">Key Features</h2>
        <div class="content">
          <ul>
            <li>Keep track of your belongings easily</li>
            <li>Share Stores with other users</li>
            <li>Leave Comments for other users</li>
            <li>Get Insights about your usage of items</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section has-background-white-bis">
      <div class="container">
        <h2 class="subtitle has-text-primary">How it Works</h2>
        <b-steps size="is-medium">
          <b-step-item
            label="Create a Store"
            step="1"
            icon="plus"
            :clickable=true
          >
            <hr>
            <h2 class="subtitle">Create a Store</h2>
            <p>In 3 easy steps:</p>
            <div class="content">
              <ul>
                <li><nuxt-link to="/stores">Login</nuxt-link> and open the <nuxt-link to="/stores">Store</nuxt-link> page</li>
                <li>Click "New Store"</li>
                <li>Fill out the form and send - your first Store is ready to go! 🎉</li>
              </ul>
            </div>
            <br>
            <img src="images/howto-step-1.png" alt="howto-step-1">
          </b-step-item>
          <b-step-item
            label="Add Items"
            step="2"
            icon="plus-box-multiple"
            :clickable=true
          >
            <hr>
            <h2 class="subtitle">Add Items</h2>
            <p>Now let's add some Items to our Store</p>
            <div class="content">
              <ul>
                <li>Click the "Add Item" <b-icon icon="plus"></b-icon> button</li>
                <li>Fill out the form and send</li>
                <li>That's it 😎</li>
              </ul>
            </div>
            <p>To find your saved Item, just click "View Items" <b-icon icon="eye"></b-icon> in the <nuxt-link to="/stores">Store</nuxt-link> overview</p>
            <br>
            <img src="images/howto-step-2.png" alt="howto-step-2">
          </b-step-item>
          <b-step-item
            label="Share with others"
            step="3"
            icon="share-variant"
            :clickable=true
          >
            <hr>
            <h2 class="subtitle">Share with other Users</h2>
            <p>Your Store belongs to a club? Or just want to share your Stores with friends and relatives? We got this covered 😃</p>
            <div class="content">
              <ul>
                <li>Click the "View/Edit Store" <b-icon icon="file-eye"></b-icon> button</li>, this is also where you can view and update your Stores
                <li>Go to the "Share" tab and add users to share</li>
                <li>Here we go 👍</li>
              </ul>
            </div>
            <br>
            <img src="images/howto-step-3.png" alt="howto-step-3">
          </b-step-item>
        </b-steps>
      </div>
    </section>
  </section>
</template>
