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
        <b-steps
          size="is-medium"
        >
          <b-step-item
            label="Create a Store"
            step="1"
            icon="plus"
          >
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
          ></b-step-item>
          <b-step-item
            label="Share with others"
            step="3"
            icon="share-variant"
          ></b-step-item>
        </b-steps>
      </div>
    </section>
  </section>
</template>
