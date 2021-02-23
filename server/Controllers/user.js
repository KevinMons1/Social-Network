const db = require("../db")
const publications = require("./publications")

//
// Functions exports 
//

// Publication when your modify a statu as profile image
const publicationsDefault = async (id, type, imageUrl, txt) => {
    let hashtag, publiId;

    if (type === "profile") {
        hashtag = "newProfileImage"
    } else if (type === "banner") {
        hashtag = "newBannerImage"
    } 

    await db.query("INSERT INTO publications (userId, text, hashtag) VALUES (?, ?, ?)",
    [id, txt, hashtag], async (err, result) => {
        if (err) {
            throw err
        } else {
            publiId = result.insertId
            await db.query("INSERT INTO publicationImages (publicationId, publicationImageUrl) VALUES (?, ?)",
            [publiId, imageUrl], async (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    await db.query("UPDATE users SET publicationsTotal = publicationsTotal + 1 WHERE userId = ?",
                    [id], (err3, result3) => {
                        if (err3) {
                            throw err3
                        }
                    })
                }
            })
        }
    })
}

// Get account informations
exports.getAccountInformations = async (req, res) => {
    const id = req.params.id
    let regex = /^[0-9]*$/

    if (id != null && id.match(regex) != null) {
        const queryUser = "u.lastName, u.firstName, u.bio, u.likesTotal, u.publicationsTotal, u.friendsTotal"
        const queryImgProfile = "ip.profileImageUrl"
        const queryImgBanner = "ib.bannerImageUrl"

        await db.query(`SELECT ${queryUser}, ${queryImgProfile}, ${queryImgBanner}
                        FROM users u
                        LEFT JOIN profileImages ip ON ip.userId = ?
                        LEFT JOIN bannerImages ib ON ib.userId = ?
                        WHERE u.userId = ?`, [id, id, id], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length > 0) {
                    res.send({
                        alert: false,
                        userData: {
                            lastName: result[0].lastName,
                            firstName: result[0].firstName,
                            bio: result[0].bio,
                            likesTotal: result[0].likesTotal,
                            publicationsTotal: result[0].publicationsTotal,
                            friendsTotal: result[0].friendsTotal,
                            profileImageUrl: result[0].profileImageUrl,
                            bannerImageUrl: result[0].bannerImageUrl
                        }
                    })
                } else {
                    res.send({alert: true})
                }
            }
        })
    } else {
        res.send({alert: true})
    }
}

// Update informations
exports.updateAccountInformations = async (req, res) => {
    const { lastName, firstName, bio } = req.body
    const id = req.params.id
    const regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/

    if (lastName != null && firstName != null) {
        if (lastName.match(regex) && firstName.match(regex)) {
            await db.query("UPDATE users SET lastName = ?, firstName = ?, bio = ? WHERE userId = ?",
            [lastName, firstName, bio, id], (err, result) => {
                if (err) {
                    res.send({message: "An error has occurred !", alert: true})
                    throw err
                } else {
                    res.send({message: "Modified information !", alert: false})
                }
            })
        } else {
            res.send({message: "Your name and surname must contain at least 2 characters !", alert: true})
            
        }
    } else {
        res.send({message: "You have not modified any information !", alert: true})
    }
}

// Update image profile
exports.uploadImageProfile = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt

    
    db.query("UPDATE profileImages SET profileImageUrl = ? WHERE userId = ?",
    [imageUrl, id], async (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            await publicationsDefault(id, "profile", imageUrl, txt)
            res.send({message: "Modified information !", alert: false})
        }
    })
}
//! Avoir car répétition avec les 2 fonctions
// Update image banner
exports.uploadImageBanner = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt
    
    db.query("UPDATE bannerImages SET bannerImageUrl = ? WHERE userId = ?",
    [imageUrl, id], async (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            await publicationsDefault(id, "banner", imageUrl, txt)
            res.send({message: "Modified information !", alert: false})
        }
    })
}