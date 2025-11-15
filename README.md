# Terms of service scanning AI Chrome extension

[inspiration](https://mymodernmet.com/social-media-policy-infographics-dima-yarovinsky/)

Planning:

background.js file listens for extension click and runs content.js on click
popup.html shows on click, shows a loading icon while the cloudflare agent is being called
content.js fetches highlighted text (the ToS), checks if it's non-empty and then sends it to cloudflare AI
Cloudflare AI logs usage, sends back any suspicious content, along with an estimated percentage of your soul you give up when you agree
Display this information in the popup.html