# ToS;DR a Terms of Service (ToS) scanning AI Chrome extension

## Summary
ToS;DR (short for Terms of Service Didn't Read) is an AI chrome extension that lets you scan Terms of Service agreements for suspicious phrasing to protect your digital autonomy, transparency, and privacy. 

## Introduction and overview
**The problem**
Who even reads those long droning (ToS) agreements anymore? I know I sure don't. And turns out neither do [87%](https://www.pewresearch.org/internet/2019/11/15/americans-attitudes-and-experiences-with-privacy-policies-and-laws/)  of Americans, although if we're being honest that's an underestimate.

Some of these agreements are growing to extreme lengths, deterring their reading even further. A good visualization of this (and an inspiration for this project) is this [art piece by Dima Yarovinsky](https://mymodernmet.com/social-media-policy-infographics-dima-yarovinsky/).

![I Agree Art Piece | 500](https://mymodernmet.com/wp/wp-content/uploads/2018/05/i-agree-dima-yarovinsky-1.jpg)

The one of the far right is Instagram, with estimated reading time of 86 minutes! Ouch!

On April Fools day in 2010 the company Gamestation [ran an experiment](https://www.pinsentmasons.com/out-law/news/nobody-reads-terms-and-conditions-its-official) on this topic by inserting a clause in their terms of service that granted them a "non transferable option to claim, for now and for ever more, your immortal soul". Of the 7,500 customers who made a purchase on that day, none of them saw the clause.

**The solution**
AI is great at rapidly processing amounts of natural language data that humans cannot. Reading the entire Instagram ToS is a matter of seconds for an AI model (although the entire agreement all at once is currently too much for my free tier LLM), and finding malicious clauses hidden in legal jargon is a trivial task.

What we need is an easy way to send agreements to a specialized AI model for grading, and production of a summary of key points. And we need this solution to be available on any website. The solution I came up with is a chrome extension.

## Setup and installation
Note that you will need to be using the Chrome web browser.

To use the extension follow these instructions:

1. Download the GitHub repository as a zip file and extract it.
2. The file structure will be `cf_ai_tos_extension-main > cf_ai_tos_extension-main > manifest.json ...`
3. Navigate to `chrome://extensions` in your chrome browser and ensure that developer mode is turned on in the top right corner.
4. In the top left click the `load unpacked` button and then select the second "cf_ai_tos_extension-main" folder down in the file structure you just unzipped (the folder with the manifest.json file inside it). 
5. To make usage easier click the puzzle piece in the top right of the browser, and select the pin to pin the ToS;DR extension.
6. To open up the extension popup click the orange magnifying glass.

## Usage
After you have the chrome extension installed, highlight your ToS agreement (for examples of ToS agreements to try see below), click the orange magnifying glass icon in the top right, and then click SCAN.

The extension will then take the selected text, and send it to my Workers AI instance of llama 3.3 for processing. The system prompt has a variety of analysis metrics, including transparency, privacy, content ownership, and contract termination. It also provides examples of green flags and red flags in a user agreement.

If the amount of text you selected is too large, you will be notified with an error message. In the future it would be nice to get a better model that can handle larger input, but for now the 24000 context limit is still pretty good.

The output of the model is a grade from 0 to 100, where 100 is the best user agreement, and 0 is the worst, and a summary of the key findings of the scan.

**The soul meter**
To make the app more fun (and add a callback to the [Gamestation experiment](https://www.pinsentmasons.com/out-law/news/nobody-reads-terms-and-conditions-its-official)) I decided to rate each ToS agreement by the estimated percentage of your soul you give up if you sign. A good user agreement might only require you to sign over 15% of your soul, whereas a bad one might require 85%. To calculate this number I just take the complement of the more traditional grade that the LLM produces.

To read more on losing your soul in an agreement this check out the Wikipedia page on [deals with the devil](http://en.wikipedia.org/wiki/Deal_with_the_Devil).

After a score is produced, the extension also allows you to input whether you accept or reject the agreement, and tracks what percentage of your soul you have remaining.

If you lose your entire soul, don't worry, you can also reset the soul meter back to 100%.

## Some good ToS to try it out on
Here is a list of ToS agreements (and other types of documents) that I tried the extension out on during development. Your individual mileage may vary.

1. [Instagram Terms of Use](https://help.instagram.com/581066165581870/?locale=en_GB)
2. [Google Privacy and Terms](https://policies.google.com/terms?hl=en-US)
3. [Squarespace Terms of Service](https://www.squarespace.com/terms-of-service)
4. [iTunes Terms and Conditions](https://www.apple.com/legal/internet-services/itunes/us/terms.html)

For fun you can try scanning the section of the Gamestation agreement I mentioned earlier:

```
By placing an order via this web site on the first day of the fourth month of the year 2010 Anno Domini, you agree to grant Us a non transferable option to claim, for now and for ever more, your immortal soul.

Should We wish to exercise this option, you agree to surrender your immortal soul, and any claim you may have on it, within 5 (five) working days of receiving written notification from gamesation.co.uk or one of its duly authorised minions. We reserve the right to serve such notice in 6 (six) foot high letters of fire, however we can accept no liability for any loss or damage caused by such an act. If you a) do not believe you have an immortal soul, b) have already given it to another party, or c) do not wish to grant Us such a license, please click the link below to nullify this sub-clause and proceed with your transaction.
```

Scanning this should result in a score of 100%.

---
Disclaimer: AI is NOT an attorney. These analyses are for informational purposes only and do not constitute legal advice. The rating produced by AI reflects an assessment of how 'user-friendly' the terms are, not their legal enforceability. You should consult a legal professional for advice on any agreement.
