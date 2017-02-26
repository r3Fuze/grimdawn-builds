import got from "got"
import jsdom from "jsdom"
import jQuery from "jquery"
import jsonfile from "jsonfile"

const WIKI_URL = "http://grimdawn.gamepedia.com/Masteries"
const CLASSES = ["Soldier", "Demolitionist", "Occultist", "Nightblade", "Arcanist", "Shaman"]

const SKILL_TYPES = {
    ACTIVE: "Active Skills",
    PASSIVE: "Passive Skills",
    TOGGLE: "Toggle Skills",
    SUMMON: "Summons"
}

let classList = {}
let allSkills = []

// Populate classList
for (let cl of CLASSES) {
    classList[cl] = {}
}

got(WIKI_URL)
    .then(res => {
        console.log("Parsing", WIKI_URL)
        let env = jsdom.env

        env(res.body, (err, window) => {
            if (err) {
                throw err
            }

            let $ = jQuery(window)

            let classTabs = []

            for (let name of CLASSES) {
                classTabs.push($(`.tabbertab[title='${name}']`))
            }

            for (let $tab of classTabs) {
                let className = $tab.attr("title")
                let $tableRows = $tab.find("table > tbody > tr > td > a")

                // console.log(className)

                let skillList = {}

                $tableRows.each((i, el) => {
                    let $el = $(el)

                    let category = $el.parent().parent().prev().find("td > span > b").text()
                    let name = $el.text()

                    if (skillList[category] === undefined) {
                        skillList[category] = []
                    }

                    allSkills.push(name)
                    skillList[category].push(name)

                    // console.log(`${category} - ${name}`)
                })

                classList[className] = skillList

                //console.log($tableRows.parent().parent().prev().find("td > span > b").text())
                //console.log($tableRows.length)
            }

            for (let className in classList) {
                let skills = classList[className]

                // Move Summons into Active Skills and Toggle Skills into Passive Skills to match build list
                if (skills["Summons"] !== undefined) {
                    skills["Active Skills"] = skills["Active Skills"].concat(skills["Summons"])
                    console.log(className, "has Summons")
                }

                if (skills["Toggle Skills"] !== undefined) {
                    if (skills["Passive Skills"] === undefined) {
                        skills["Passive Skills"] = []
                    }

                    skills["Passive Skills"] = skills["Passive Skills"].concat(skills["Toggle Skills"])
                }
            }

            jsonfile.writeFile("./skills.json", classList, { spaces: 2 }, err => {
                if (err) {
                    throw err
                }
                console.log("json written")
            })

            jsonfile.writeFile("./skills-all.json", allSkills.sort(), { spaces: 2 }, err => {
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

/*

            fsp.writeFile("./tmp.html", res.body)
                .then(() => {
                    console.log("html written")
                })
                .catch(err => {
                    console.log(err)
                })
 */
