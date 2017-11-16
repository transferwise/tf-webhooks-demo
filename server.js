const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const parseWebhook = require('./webhook')

const channelWebhookUrl = process.env.SLACK_INCOMING_WEBHOOK

const app = express()


app.use(bodyParser.json())

app.post("/", (req, res) => {
  const webhook = parseWebhook(req.body)
  console.log("webhook received", webhook)

  postInSlackChannel(webhook);

  res.end()
})

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`✅  The server is running at http://localhost:${port}/`)
})


function postInSlackChannel (webhook) {
  
  if (webhook.description === null) {
    return;
  }
  
  let message = ``;
  if (webhook.score == 2) {
    message += `:rocket:`;
  }
  if (webhook.score == 1) {
    message += `:muscle:`;
  }
  if (webhook.score == 0) {
    message += `:no_mouth:`;
  }
  if (webhook.score == -1) {
    message += `:headbang:`;
  }
  if (webhook.score == -2) {
    message += `:poop:`;
  }
 
  let profileId = webhook.profile_id.replace(new RegExp(',', 'g'), '');
  message += `Profile: *${profileId}*\nScore: *${webhook.score}*\n>${webhook.description}`;

  request(channelWebhookUrl, {
    method: "POST",
    form: {
      payload: JSON.stringify({
        text: message
      })
    }
  }, (err, httpResponse, body) => {
    console.log("Response from Slack", err, body)
  })
}
