let buildData = require("./builds.json")

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

console.log(testBuild.name)
console.log(`  Damage types: ${testBuild.data.Damage.join(", ")}`)
