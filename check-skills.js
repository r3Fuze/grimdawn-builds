const builds = require("./builds.json")
const skills = require("./skills.json")
const allSkills = require("./skills-all.json")

function createMap(obj) {
    return Object.keys(obj).reduce((map, key) => map.set(key, obj[key]), new Map())
}

let typos = [
    ["Warcry", "War Cry"],
    ["Forcewawe", "Forcewave"],
    ["Nulfication", "Nullification"],
    ["Pnuematic Burst", "Pneumatic Burst"],
    ["Firestrike", "Fire Strike"],
    ["Doombolt", "Doom Bolt"],
    ["Bloody Pox", "Blood Pox"],
    ["Curse of Fraility", "Curse of Frailty"],
    ["Cure of Frailty", "Curse of Frailty"],
    ["Wind Devils", "Wind Devil"],
    ["Wendingo Totem", "Wendigo Totem"],
    ["mirr?or of er(oa|eo)ctes", "Mirror of Ereoctes"], // Mirror of Eroactes, miror of ereoctes
    ["Cannister Bomb", "Canister Bomb"],
    ["Flash\\s?ban(g|d)s?", "Flashbang"], // Flash Bang, Flashband, Flashbangs
    ["Sigil of Comsumption", "Sigil of Consumption"],
    ["BWC High Potency", "Blackwater Cocktail"],
    ["Black Water Cocktail", "Blackwater Cocktail"],
    ["Thermite Mines", "Thermite Mine"],
    ["Shadow-?strike", "Shadow Strike"], // Shadowstrike, Shadow-Strike
    ["Vindictive Flame", "Vindicative Flame"],
    ["Callidor Tempest", "Callidor's Tempest"],
    ["Phantasmal Blades?", "Phantasmal Blades"],
    ["(ABB|Amarata's Blade Burst|^blade burst)", "Amarasta's Blade Burst"], // ABB, Amarata's Blade Burst, blade burst
    ["Dreeg Evil Eye", "Dreeg's Evil Eye"],
    ["Bladte Trap", "Blade Trap"],
    ["Blood of dreegs", "Blood of Dreeg"]
]

let itemSkills = [
    "Final Stop",
    "Aether Tendril",
    "Blooddrinker",
    "Beronath's Fury",
    "Shard of Beronath", // Beronath's Fury
    "Gaze of Beronath",
    "Bloodthirster",
    "Poison Bolt",
    "Summon Nemesis",
    "Chaos Strike",
    "Solael's Flame",
    "Invocation to Chaos",
    "Demon's Breath",
    "Obsidian Tremors", // Real is called 'Obsidian Tremor'
    "Oleron's Might",
    "oleron's might", // TODO: Case insensitive (create .toLowerCase on prototype?)
    "Oleron's Blood", // Oleron's Might
    "Winter King's Might",
    "Necrosis",
    "Icechill",
    "Bloodbath",
    "Living Fortress",
    "Ground Smash",
    "Call of the Beast",
    "Sovereign",
    "Summon Revenant of Og'Napesh",
    "Dreeg's Infinite Gaze",
    "Dreeg's infinite Gaze",
    "Dreeg's Afflicted Spines",
    "Clairvoyance",
    "Plague of Shattered Souls",
    "Silver Spread"
]

let buildMap = createMap(builds)

for (let [name, list] of buildMap.entries()) {
    console.log(name)

    for (let build of list) {
        // console.log("  " + build.name)

        let lowerCaseSkills = allSkills.map(v => {
            return v.toLowerCase()
        })

        for (let skill of build.data["Active Skills"]) {
            // console.log("    " + skill)

            for (let typo of typos) {
                skill = skill.replace(new RegExp(typo[0], "i"), typo[1])

                // Remove trailing dots
                skill = skill.replace(/\.$/, "")
            }

            if (!lowerCaseSkills.includes(skill.toLowerCase()) && !itemSkills.includes(skill)) {
                console.log("!!! " + skill + " is not on the list")
            }
        }
    }
}
