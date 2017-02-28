import got from "got"
import jsdom from "jsdom"
import jQuery from "jquery"
import jsonfile from "jsonfile"

const WIKI_URL = "http://grimdawn.gamepedia.com/Category:Item_Skills"

let skills = []

got(WIKI_URL)
    .then(res => {
        console.log("Parsing", WIKI_URL)
        let env = jsdom.env

        env(res.body, (err, window) => {
            if (err) {
                throw err
            }

            let $ = jQuery(window)

            let $skills = $(".mw-category > .mw-category-group > ul > li")

            $skills.each((i, el) => {
                let $el = $(el)
                let skillName = $el.children("a").text().replace(" (Granted by Item)", "")

                skills.push(skillName)
            })

            jsonfile.writeFile("./skills-item.json", skills.sort(), { spaces: 2 }, err => {
                if (err) {
                    throw err
                }
                console.log("json written")
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
