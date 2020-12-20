<template>
  <section>
    <section class="section">
      <div class="container">
        <h2 class="title">Manual</h2>
        Click on a topic below to see how it works
        <hr>
      </div>
    </section>
    <div class="container">
      <b-tabs>
        <b-tab-item label="Introduction">
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
                  <ul>
                    <li>
                      <nuxt-link to="/stores">Login</nuxt-link>
                      and open the
                      <nuxt-link to="/stores">Store</nuxt-link>
                      page
                    </li>
                    <li>Click "New Store"</li>
                    <li>Fill out the form and send - your first Store is ready to go! 🎉</li>
                  </ul>
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
                  <ul>
                    <li>Click the "Add Item"
                      <b-icon icon="plus"></b-icon>
                      button
                    </li>
                    <li>Fill out the form and send</li>
                    <li>That's it 😎</li>
                  </ul>
                  <p>To find your saved Item, just click "View Items"
                    <b-icon icon="eye"></b-icon>
                    in the
                    <nuxt-link to="/stores">Store</nuxt-link>
                    overview
                  </p>
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
                  <p>Your Store belongs to a club? Or just want to share your Stores with friends and relatives? We got
                    this
                    covered 😃</p>
                  <div class="content">
                    <ul>
                      <li>Click the "View/Edit Store"
                        <b-icon icon="file-eye"></b-icon>
                        button
                      </li>
                      , this is also where you can view and update your Store's details, add comments and even print out
                      a
                      QR-Code containing the url to the Store
                      <li>Go to the "Share" tab and add users to share</li>
                      <li>Here we go 👍 now your Store is available to all shared users</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/howto-step-3.png" alt="howto-step-3">
                </b-step-item>

              </b-steps>
            </div>
          </section>
        </b-tab-item>

        <b-tab-item label="Stores">
          <section class="section">
            <div class="container">
              <h2 class="subtitle">Stores</h2>
              <div class="content">
                <ul>
                  <li>Stores are containers for Items (your everyday objects)</li>
                  <li>They can be shared with other users</li>
                </ul>
                <p>Quicklinks:</p>
                <ul>
                  <li><a href="#overview">Overview</a></li>
                  <li><a href="#viewedit">View/Edit</a></li>
                </ul>
              </div>
            </div>
          </section>
          <section id="overview" class="section has-background-white-bis">
            <div class="container">
              <h2 class="subtitle has-text-primary">Overview</h2>
              <b-steps size="is-medium">
                <b-step-item
                  label="Overview"
                  step="1"
                  icon="eye"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Overview</h2>
                  <div class="content">
                    <ul>
                      <li>The Store overview shows you all Stores in which you are the owner or a shared user</li>
                      <li>The buttons at the right side allow you to edit or open a Store</li>
                      <li>You can only edit or delete Stores of which you are the owner</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-01.png" alt="stores-01">
                </b-step-item>
                <b-step-item
                  label="Expand Store"
                  step="2"
                  icon="chevron-down"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Expand Store</h2>
                  <div class="content">
                    <ul>
                      <li>Stores can be expanded to show their included Items</li>
                      <li>Click on the expand chevron to do so</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-02.png" alt="stores-02">
                </b-step-item>
                <b-step-item
                  label="Create Store"
                  step="3"
                  icon="plus"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Create Store</h2>
                  <div class="content">
                    <ul>
                      <li>New Stores can be added with the "New Store" button in the overview</li>
                      <li>Fill out the form and click "Create Store"</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-03.png" alt="stores-03">
                </b-step-item>
              </b-steps>
            </div>
          </section>
          <section id="viewedit" class="section has-background-white">
            <div class="container">
              <h2 class="subtitle">View/Edit Store</h2>
              <b-steps size="is-medium">
                <b-step-item
                  label="View/Edit"
                  step="1"
                  icon="file-eye"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">View and Edit Store</h2>
                  <div class="content">
                    <ul>
                      <li>Opens up if you click on the "View/Edit Store" button in the overview</li>
                      <li>View/Edit Store gives you a detailed output of the Stores contents</li>
                      <li>Here Stores can be updated and collaboration functions like Comments are available</li>
                      <li>Certain options are only editable by the owner</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-viewedit-01.png" alt="stores-viewedit-01">
                </b-step-item>
                <b-step-item
                  label="Share"
                  step="2"
                  icon="share-variant"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Share Store</h2>
                  <div class="content">
                    <ul>
                      <li>Stores can be shared with other users, this means they can see, add and edit Items of this Store</li>
                      <li>Add the new shared users mail address in the Shared Users field and hit enter, then "Update Permissions"</li>
                      <li>If you did already share another Store with a user, he will appear as suggestion</li>
                      <li>You can transfer ownership of a store to another existing user</li>
                      <li>Sharing is only editable by the current Store owner</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-viewedit-02.png" alt="stores-viewedit-02">
                </b-step-item>
                <b-step-item
                  label="Comment"
                  step="3"
                  icon="comment-text"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Comment</h2>
                  <div class="content">
                    <ul>
                      <li>Comments are useful if you want to share additional information about a Store with other shared users</li>
                      <li>For example if someone took an Item for a longer period of time, or instructions how to handle things</li>
                      <li>To add a comment, just write it in the Comment field and click "Send Comment". It will appear immediately</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-viewedit-03.png" alt="stores-viewedit-03">
                </b-step-item>
                <b-step-item
                  label="Picture"
                  step="4"
                  icon="camera"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Picture upload</h2>
                  <div class="content">
                    <ul>
                      <li>To better identify a Store you can upload an image of it</li>
                      <li>Just click on the upload button and choose your image</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-viewedit-04.png" alt="stores-viewedit-04">
                </b-step-item>
                <b-step-item
                  label="QR Code"
                  step="5"
                  icon="qrcode"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">QR Code Generator</h2>
                  <div class="content">
                    <ul>
                      <li>If you want to immediately identify and find a physical Store you can generate QR codes with the link and ID embedded</li>
                      <li>This QR code can be printed out and put on the physical Store</li>
                      <li>To open the Store in VindThing, just use your phones camera app or any other QR code reader and follow the provided link</li>
                    </ul>
                  </div>
                  <br>
                  <img src="images/stores/stores-viewedit-05.png" alt="stores-viewedit-05">
                </b-step-item>
              </b-steps>
            </div>
          </section>
        </b-tab-item>

        <b-tab-item label="Items">
          <section class="section">
            <div class="container">
              <h2 class="subtitle">Items</h2>
              <div class="content">
                <ul>
                  <li>Items are your everyday objects</li>
                  <li>An Item always belongs to a Store</li>
                </ul>
                <p>To view and edit Items of a Store click the "View Items" button</p>
                <img src="images/button-panel.png" alt="button-panel">
              </div>
            </div>
          </section>
          <section class="section has-background-white-bis">
            <div class="container">
              <h2 class="subtitle has-text-primary">Overview</h2>
              <b-steps size="is-medium">
                <b-step-item
                  label="Overview"
                  step="1"
                  icon="eye"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Item Overview</h2>
                  <div class="content">
                    <ul>
                      <li>Click "View Items" in the Store overview</li>
                      <li>Here you can see all Items of a Store</li>
                      <li>e.g. how many of the same Items are in the Store or how often it was used</li>
                      <li>In Store indicates if an Item is in the Store currently. In this example the jacket was taken out</li>
                    </ul>
                  </div>
                  <img src="images/items/items-01.png" alt="items-01">
                </b-step-item>
                <b-step-item
                  label="Add Item"
                  step="2"
                  icon="text-box-plus"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Add new Item</h2>
                  <div class="content">
                    <ul>
                      <li>To add a new Item, click "New Item" in the Item or Store overview</li>
                      <li>Fill out the form and click "Create Item"</li>
                    </ul>
                  </div>
                  <img src="images/items/items-02.png" alt="items-02">
                </b-step-item>
                <b-step-item
                  label="Edit Item"
                  step="3"
                  icon="pencil"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Edit Item</h2>
                  <div class="content">
                    <ul>
                      <li>Click "Edit Item"</li>
                      <li>Fill out the form and click "Update Item"</li>
                    </ul>
                  </div>
                  <img src="images/items/items-04.png" alt="items-04">
                </b-step-item>
                <b-step-item
                  label="Move Item"
                  step="4"
                  icon="redo"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Move Item to other Store</h2>
                  <div class="content">
                    <ul>
                      <li>Click "Move Item to other Store"</li>
                      <li>Search the Store in which you want to move the Item and click "Move Item"</li>
                    </ul>
                  </div>
                  <img src="images/items/items-03.png" alt="items-03">
                </b-step-item>
              </b-steps>
            </div>
          </section>
        </b-tab-item>

        <b-tab-item label="Insights">
          <section class="section">
            <div class="container">
              <h2 class="subtitle">Insights</h2>
              <div class="content">
                <ul>
                  <li>Get Insights about your usage of Items</li>
                  <li>See when the most Items were created or updated</li>
                </ul>
              </div>
            </div>
          </section>
          <section class="section has-background-white-bis">
            <div class="container">
              <h2 class="subtitle has-text-primary">Items Usage</h2>
              <b-steps size="is-medium">
                <b-step-item
                  label="Items Usage"
                  step="1"
                  icon="chart-pie"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Items Usage</h2>
                  <div class="content">
                    <ul>
                      <li>Open the "Item Usage" tab</li>
                      <li>If an Item was used at least once, it will appear in the pie chart with it's use count</li>
                    </ul>
                  </div>
                  <img src="images/insights/insights-01.png" alt="insights-01">
                </b-step-item>
                <b-step-item
                  label="Items Creation"
                  step="2"
                  icon="chart-bar"
                  :clickable=true
                >
                  <hr>
                  <h2 class="subtitle">Items Creation/Update</h2>
                  <div class="content">
                    <ul>
                      <li>Open the "Item Creation" tab</li>
                      <li>The bar chart shows how many Items were created and updated in which month</li>
                    </ul>
                  </div>
                  <img src="images/insights/insights-02.png" alt="insights-02">
                </b-step-item>
              </b-steps>
            </div>
          </section>
        </b-tab-item>

        <b-tab-item label="Chat">
          <section class="section">
            <div class="container">
              <h2 class="subtitle">Chat</h2>
              <div class="content">
                <ul>
                  <li>Use the chat to message another active user directly</li>
                  <li>The user has to be logged in</li>
                  <li>You can message a user without him being in the chat himself. A notification will show</li>
                </ul>
              </div>
              <img src="images/chat.png" alt="chat">
            </div>
          </section>
        </b-tab-item>

        <b-tab-item label="Profile">
          <section class="section">
            <div class="container">
              <h2 class="subtitle">Profile</h2>
              <div class="content">
                <ul>
                  <li>To edit your profile, open the profile page in the dropdown at the upper right corner</li>
                  <li>You can fill out both or only either the name or password field</li>
                  <li>To change the password you must type it twice</li>
                  <li>Click "Update Profile"</li>
                </ul>
              </div>
              <img src="images/profile.png" alt="profile">
            </div>
          </section>
        </b-tab-item>
      </b-tabs>
    </div>
  </section>
</template>
