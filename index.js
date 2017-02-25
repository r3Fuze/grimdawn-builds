import got from "got"

got("grimdawn.com")
    .then(res => {
        console.log(res.body)
    })
    .catch(error => {
        console.log(error.response.body)
    })
