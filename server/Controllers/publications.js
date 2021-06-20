const db = require("../Utils/db")
const fs = require("fs")
const path = require("path")
const { cloudinary } = require('../Utils/cloudinary')
const urlMetadata = require('url-metadata')

//
// Functions globale
//

const requestQuery = async (query, params) => {
    return await new Promise ((resolve) => {
        db.query(query, params, (err, result) => {
            if (err) {
                throw err
            } else {
                resolve(result)
            }
        })
    })
}

const getMetaDataUrl = async text => {
    return await new Promise ((resolve) => {
        const reg = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i') // fragment locator
        
        if (text.includes("https://")) {
            if (text.indexOf(" https://") >= 0) { // url have a space before url
                const indexStart = text.indexOf(" https://")
                const indexEnd = text.indexOf(" ", indexStart + 1)
                let findUrl = ""

                // know if url is at the end or not
                if (indexEnd === -1) findUrl = text.slice(indexStart)
                else findUrl = text.slice(indexStart, indexEnd)
        
                if (!!reg.test(findUrl.trim())) {

                    urlMetadata(findUrl)
                        .then(async metadata => resolve(metadata))
                        .catch(() => {
                            resolve(false)
                        })
                } else resolve(false)  

            } else {
                // know is url is alone
                if (text.indexOf(" ") === -1) {
                    if (!!reg.test(text.trim())) {
                        urlMetadata(text)
                            .then(async metadata => resolve(metadata))
                            .catch(() => {
                                resolve(false)
                            })
                    } else resolve(false)
                } else { // url have a space after url
                    const indexSpace = text.indexOf(" ")
                    const findUrl = text.slice(0, indexSpace)

                    if (!!reg.test(findUrl)) {
                        urlMetadata(findUrl)
                            .then(async metadata => resolve(metadata))
                            .catch(() => {
                                resolve(false)
                            })
                    } else resolve(false)
                }
            } 
        } else resolve(false)  
    })
}

const addMetaData = async (array) => {
    let newArray = []
    const getArray = await Promise.all(array.map(async (arr) => await getMetaDataUrl(arr.text)))
      .then((arrIsUrl) => {
        array.forEach((publication, index) => {
          newArray.push({
            ...publication,
            metaData: arrIsUrl[index],
          })
        })
      })
      .then(() => {
        return newArray
      })
    return getArray
}

// Add a new publication
exports.addNewPublication = async (req, res) => {
    const id = req.params.id
    const {text, hashtag} = req.body
    let hashtagTxt = hashtag === undefined ? null : hashtag.join(";")

    const result = await requestQuery("INSERT INTO publications (userId, text, hashtag) VALUES (?, ?, ?)", [id, text, hashtagTxt])
    res.send({alert: true, publicationId: result.insertId})  
}

// Add image of new publication
exports.addPublicationImage = async (req, res) => {
    const file = req.file
    const { id } = req.body

    cloudinary.uploader.upload(file.path, {
        upload_preset: "publications_images"
    }, async (err, result) => {
        if (err) {
            throw err
        } else {
            const pathStorage = path.join(__dirname, `../Images/${file.filename}`)
            const resultQuery = await requestQuery(`INSERT INTO publicationContent (publicationId, cloudinaryPublicId, text, type) VALUES (?, ?, ?, "image")`, [id, result.public_id, result.url])

            // Delete image storage in folder Images
            fs.unlink(pathStorage, (err) => {
                console.log(err)
                return
            })
            res.send({message: "Publications published !", alert: false})
        }
    })
}

// Add video of new publication
exports.addPublicationVideo = async (req, res) => {
    const file = req.file
    const { id } = req.body

    cloudinary.uploader.upload_large(file.path, {
        ressource_type: "video",
        upload_preset: "publications_videos"
    }, async (err, result) => {
        if (err) {
            throw err
        } else {
            const pathStorage = path.join(__dirname, `../Videos/${file.filename}`)
            const resultQuery = await requestQuery(`INSERT INTO publicationContent (publicationId, cloudinaryPublicId, text, type) VALUES (?, ?, ?, "video")`, [id, result.public_id, result.url])

            // Delete video storage in folder Videos
            fs.unlink(pathStorage, (err) => {
                console.log(err)
                return
            })
            res.send({message: "Publications published !", alert: false})
        }
    })
}

// Add new comments in publication
exports.addNewComments = async (req, res) => {
    const {userId, text} = req.body
    const publicationId = req.params.id

    const result = await requestQuery(`INSERT INTO publicationContent (publicationId, userId, text, type) VALUES (?, ?, ?, "comment")`, [publicationId, userId, text])
    const result2 = await requestQuery("UPDATE publications SET commentsTotal = commentsTotal + 1 WHERE publicationId = ?", [publicationId])
    res.send({message: "Comments published !"})

}

// Add like
exports.addLike = async (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    const result = await requestQuery("INSERT INTO likes (userId, publicationId) VALUES (?, ?)", [userId, publicationId])
    res.send(result)
}

// Get like 
exports.getLikes = async (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    const result = await requestQuery("SELECT COUNT(*) likesTotal FROM likes WHERE publicationId = ?", [publicationId])
    const result2 = await requestQuery("SELECT userId FROM likes WHERE userId = ? AND publicationId = ?", [userId, publicationId])     
    res.send({like: result[0],isLike: result2})
}

// Get one publication
exports.getOnePublication = async (req, res) => {
    const id = req.params.id
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"

    const result = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
        LEFT JOIN users u ON u.userId = p.userId 
        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
        LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
        WHERE p.publicationId = ?`, [id])

        const isUrl = await getMetaDataUrl(result[0].text)
        if (isUrl) {
            res.send([{
                ...result[0],
                metaData: isUrl
            }])
        } else res.send(newResult)
}

// Get all publication by all users
exports.getPublicationsHome = async (req, res) => {
    const maxCount = parseInt(req.params.id)
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"
    let minCount = maxCount - 3
    let countPublication

    // Verify if there is no more publication
    const result = await requestQuery(`SELECT COUNT(publicationId) as countPublication FROM publications`, null)
    countPublication = result[0].countPublication
    if (maxCount <= countPublication - 3) {
        //Order by id DESC to sort from new to oldest
        const result2 = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
            LEFT JOIN users u ON u.userId = p.userId 
            LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
            LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
            ORDER BY p.publicationId DESC LIMIT ?, ?`, [minCount, maxCount])

        const result3 = await addMetaData(result2)
        res.send(result3)
    } else res.send(false)
}

// Get all publication by hashtag
exports.getPublicationsHashtag = async (req, res) => {
    const maxCount = parseInt(req.params.id)
    const hashtag = req.query.hashtag
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"
    let minCount = maxCount - 3
    let countPublication

    // Verify if there is no more publication
    const result = await requestQuery(`SELECT COUNT(publicationId) as countPublication FROM publications`, null)
    countPublication = result[0].countPublication
    if (maxCount <= countPublication - 3) {
        //Order by id DESC to sort from new to oldest
        const result2 = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
            LEFT JOIN users u ON u.userId = p.userId 
            LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
            LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
            WHERE p.hashtag LIKE ? ORDER BY p.publicationId DESC LIMIT ?, ?`, ["%" + hashtag + "%", minCount, maxCount])
            
        const result3 = await addMetaData(result2)
        res.send(result3)
    } else res.send(false)
}

// Get all comments in this publication
exports.getComments = async (req, res) => {
    const publicationId = req.params.id
    const queryComments = "pc.text, pc.publicationId, pc.userId, pc.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"

    const result = await requestQuery(`SELECT ${queryComments}, ${queryUsers}, ${queryImg} FROM publicationContent pc
        LEFT JOIN users u ON u.userId = pc.userId
        LEFT JOIN userImages ui ON ui.userId = pc.userId AND ui.type = "profile"
        WHERE pc.publicationId = ? AND pc.type = "comment"`, [publicationId])
    res.send(result)
}

// Get all publications in this account
exports.getAccountPublications = async (req, res) => {
    const id = req.params.id
    const queryPublications = "p.publicationId, p.userId, p.text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"

    //Order by id DESC to sort from new to oldest
    let result = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
        LEFT JOIN users u ON u.userId = p.userId 
        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
        LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
        WHERE p.userId = ? ORDER BY p.publicationId DESC `, [id])

    const result2 = await addMetaData(result)
    res.send(result2)
}

// Delete publications
exports.deletePublication = async (req, res) => {
    const { file, publicationId } = req.body
    
    const result = await requestQuery("DELETE FROM publications WHERE publicationId = ?", [publicationId])
    const result2 = await requestQuery(`DELETE FROM publicationContent WHERE publicationId = ? AND type="comment"`, [publicationId])

    if (file !== null) {
        const result3 = await requestQuery(`SELECT cloudinaryPublicId, type FROM publicationContent WHERE publicationId = ? AND (type="image" OR type="video")`, [publicationId])
        const result4 = await requestQuery(`DELETE FROM publicationContent WHERE publicationId = ? AND (type="image" OR type="video")`, [publicationId])
        cloudinary.uploader.destroy(result3[0].cloudinaryPublicId, {
            resource_type: result3[0].type
        }, (err) => {
            if (err) throw err 
        })
    }
    res.send({message: "Publications deleted !", alert: true})
}

// Delete like
exports.deleteLike = async (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id
    const result = await requestQuery('DELETE FROM likes WHERE userId = ? AND publicationId = ?', [userId, publicationId])
    res.send(result)
}