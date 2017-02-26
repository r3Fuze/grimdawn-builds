import got from "got"
import jsonfile from "jsonfile"
import _ from "lodash"
import stripTags from "striptags"
//import cheerio from "cheerio"
import jQuery from "jquery"
import jsdom from "jsdom"

const BUILDS_URL = "http://www.grimdawn.com/forums/showthread.php?t=48165"

let classList = []
let classes = {}

function buildMap(obj) {
    return Object.keys(obj).reduce((map, key) => map.set(key, obj[key]), new Map())
}

got(BUILDS_URL)
    .then(res => {
        let env = jsdom.env

        env(res.body, (err, window) => {
            if (err) {
                throw err
            }

            let $ = jQuery(window)//cheerio.load(res.body)

            let classTitleSelector = "font > blockquote > b > font[color='#999900']"
            let classSingleTitleSelector = "font > blockquote > b > u > font[color='#999900']"
            let $classList = $(classTitleSelector + ", " + classSingleTitleSelector)

            $classList.each((i, el) => {
                let $el = $(el)
                let className = $el.text()
                classList.push(className)
                classes[className] = undefined
            })

            let buildSelector = "blockquote > ul > li"
            let $builds = $(buildSelector)

            $builds.each((i, el) => {
                let $el = $(el)
                //console.log("------")
                //console.log($el.find("a").text().trim())

                let $buildData = $($el.get(0))

                //console.log($($buildData.get(0)).find("font > a").text())

                // Some builds have messed up formatting so we fix it
                // Don't ask how it works
                // TODO: Make it better
                if ($el.children("font").length > 1) {
                    $el.children("font").first().append($el.children("font").last())
                    $el.find("a").insertBefore($el.find("> font > font"))
                    $el.find("> font > font").text(" " + $el.find("> font > font").text())
                    $el.find("> font > font").contents().unwrap()
                }

                let buildName = $el.find("a").text().trim()

                if (buildName === "") {
                    // The first build might be the example so just skip it
                    return true
                }

                let $parent = $el.parent().parent()
                let parentBuild
                let $parentTitleSelector
                let $parentTitleElement // .find("blockquote > b > font")

                // .prevUntil() can't be used on the build just after a class title so we need another selector
                if ($parent.prevUntil("font").length > 0) {
                    $parentTitleElement = $parent.prevUntil("font").last().prev()
                } else {
                    $parentTitleElement = $parent.prev()
                }

                // Single-class build titles are underlined so we need a different selector
                // They will have one more element than multi-class titles so we use the depth to figure out which is which
                if ($parentTitleElement.find("*").length > 3) {
                    $parentTitleSelector = "blockquote > b > u > font"
                } else {
                    $parentTitleSelector = "blockquote > b > font"
                }

                parentBuild = $parentTitleElement.find($parentTitleSelector).text()

                //classes[parentBuild][buildName] = {}
                //

                if (classes[parentBuild] === undefined) {
                    classes[parentBuild] = []
                }

                let url = stripTags($el.find("a").attr("href"))

                if (url.startsWith("showthread")) {
                    url = "http://www.grimdawn.com/forums/" + url
                }

                classes[parentBuild].push({
                    name: buildName,
                    $data: $buildData,
                    data: {
                        url: url
                    }
                })

                //console.log(Object.keys(classes).includes(parentBuild))
                //console.log(buildName)
                //console.log(parentBuild)
            })

            let onlyText = el => {
                return el.clone().children().remove().end().text().trim()
            }

            let classMap = buildMap(classes)

            for (let buildList of classMap.values()) {
                if (buildList === undefined) {
                    // console.log(className, "has no builds. Skipping.")
                    continue
                }

                buildList.forEach(build => {
                    build.$data.find("ul > li").each((i, el) => {
                        let $el = $(el)

                        let propType = $el.find("font").text().trim().replace(":", "")
                        let propValue = onlyText($el)
                        let propValues = propValue.split(", ")

                        propValues = _.compact(propValues)

                        build.description = build.$data.find("font").first().text()

                        build.data[propType] = propValues
                    })

                    // We don't need any more jQuery data
                    delete build.$data
                })
            }

            let testDesc = classes["Battlemage (Arcanist + Soldier)"][3].description
            let descSplit = testDesc.split("(")

            // Remove author
            descSplit.pop()

            //console.log(testDesc)

            for (let i = 1; i < descSplit.length; i++) {
                console.log("(" + descSplit[i].split(")")[0] + ")")
            }

            jsonfile.writeFile("./builds.json", classes, { spaces: 2}, err => {
                if (err) {
                    throw err
                }
                console.log("json written")
            })
        })

        // console.log(classList.join("\n"))
    })
    .catch(err => {
        console.log(err)
    })
