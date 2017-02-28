import * as lower from "array-lowercase"
import mean from "didyoumean2"

const builds = require("./builds.json")
// const skills = require("./skills.json")
const allSkills = require("./skills-all.json")
const itemSkillsParsed = require("./skills-item.json")

lower.extend()

function createMap(obj) {
    return Object.keys(obj).reduce((map, key) => map.set(key, obj[key]), new Map())
}

let typos = [
    //["Flash\\s?ban(g|d)s?", "Flashbang"], // Flash Bang, Flashband, Flashbangs
    ["(ABB|^blade burst)", "Amarasta's Blade Burst"], // ABB, blade burst
    ["BWC", "Blackwater Cocktail"],
    [" High Potency", ""] // BWC Modifier
]

// Skills not on wiki list
let itemSkills = [
    "Obsidian Tremors", // Real is called 'Obsidian Tremor'
    "Final Stop",
    "Necrosis",
    "Dreeg's Afflicted Spines",
    "Clairvoyance",
    "Ground Smash",
    "Plague of Shattered Souls",
    "Call of the Beast",
    "Sovereign",
    "Icechill",
    "Bloodbath",
    "Living Fortress",
    "Gaze of Beronath",
    "Winter King's Might",
    "Poison Bolt",
    "Summon Nemesis",
    "Shard of Beronath", // Beronath's Fury
    "Oleron's Blood", // Oleron's Might
    "Summon Revenant of Og'Napesh",
    "Invocation to Chaos"
].concat(itemSkillsParsed)

let buildMap = createMap(builds)

for (let [name, list] of buildMap.entries()) {
    // console.log(name)

    for (let build of list) {
        // console.log("  " + build.name)

        for (let skill of build.data["Active Skills"]) {
            // console.log("    " + skill)

            for (let typo of typos) {
                skill = skill.replace(new RegExp(typo[0], "i"), typo[1])

                // Remove trailing dots
                skill = skill.replace(/\.$/, "")
            }

            let lowerCaseSkills = allSkills.toLowerCase()

            //  = mean(skill, allSkills)
            if (!lowerCaseSkills.includes(skill.toLowerCase())) {
                let matched = ""

                if (itemSkills.toLowerCase().includes(skill.toLowerCase())) {
                    matched = skill
                } else {
                    matched = mean(skill, allSkills, {
                        threshold: 0.8 // Higher = stricter
                    })

                    if (matched === null) {
                        console.log("!!! " + skill + " is not on any list")
                    } else {
                        console.log("Matched " + skill + " with " + matched)
                    }
                }
            }
        }
    }
}
