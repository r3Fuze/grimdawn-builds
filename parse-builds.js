let buildData = require("./builds.json")

const TAGS = {
    melee: "melee",
    ranged: "ranged",
    caster: "caster",
    pet: "pet",
    hardcore: "hc",
    ultimate: "u",
    crucible: "c",
    gladiator: "c+",
    download: "d",
    video: "vid",
    gear: "g[1-5]",
    leveling: "l"
}

const testBuild = {
    "name": "Deathmarked Blademaster Multi-Proc",
    "data": {
        "url": "http://www.grimdawn.com/forums/showthread.php?t=49710",
        "Damage": [
            "Pierce",
            "Cold"
        ],
        "Active Skills": [
            "Beronath's Fury",
            "Shadow Strike",
            "Amarasta's Blade Burst",
            "Blade Spirit",
            "Pneumatic Burst",
            "Ring of Steel",
            "Blade Barrier"
        ],
        "Passive Skills": [
            "Oleron's Rage",
            "Field Command",
            "Veil of Shadows"
        ],
        "WPS Skills": [
            "Amarasta's Quick Cut",
            "Execution"
        ]
    },
    "description": "[Melee] [v1.0.0.7.] Deathmarked Blademaster Multi-Proc (Superfluff)"
}

const isNumeric = str => !isNaN(str)

console.log(testBuild.name)
console.log(`  Damage types: ${testBuild.data.Damage.join(", ")}`)

let gameVersion = new RegExp(/\[v?((?:\d\.?){1,4}.?)\]/g).exec(testBuild.description)
let numericVersion = -1

if (gameVersion === null) {
    console.log("!!! version string not found")
} else {
    gameVersion = gameVersion[1].replace(/.$/gm, "")
    console.log("Version: " + gameVersion)

    let numericReplace = gameVersion.replace(/\./g, "")

    if (isNumeric(numericReplace)) {
        numericVersion = Number(numericReplace)

        console.log("Numeric version: " + numericVersion)
    }
}
