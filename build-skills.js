/* eslint no-unused-vars: off */

import got from "got"
import jsdom from "jsdom"
import jQuery from "jquery"

const WIKI_URL = "http://grimdawn.wikia.com/wiki/Masteries"
const CLASSES = ["Soldier", "Demolitionist", "Occultist", "Nightblade", "Arcanist", "Shaman"]

let tabs = []

got(WIKI_URL)
    .then(res => {
        console.log("Parsing", WIKI_URL)
        let env = jsdom.env

        env(res.body, (err, window) => {
            if (err) {
                throw err
            }

            let $ = jQuery(window)

            $(".tabberlive > .tabbertab").each((i, el) => {
                console.log(el)
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
