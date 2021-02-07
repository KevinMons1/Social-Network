const db = require("../db")
const publications = require("./publications")

//
// Functions exports 
//

// Publication when your modify a statu as profile image
const publicationsDefault = async (id, type, imageUrl, txt) => {
    let hashtag, publi_id;

    if (type === "profile") {
        hashtag = "newProfileImage"
    } else if (type === "banner") {
        hashtag = "newBannerImage"
    } 

    await db.query("INSERT INTO publications (user_id, text, hashtag) VALUES (?, ?, ?)",
    [id, txt, hashtag], async (err, result) => {
        if (err) {
            throw err
        } else {
            publi_id = result.insertId
            await db.query("INSERT INTO publication_images (publication_id, publication_image_url) VALUES (?, ?)",
            [publi_id, imageUrl], async (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    await db.query("UPDATE users SET publications_total = publications_total + 1 WHERE user_id = ?",
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
        const queryUser = "u.last_name, u.first_name, u.bio, u.likes_total, u.publications_total, u.friends_total"
        const queryImgProfile = "ip.profile_image_url"
        const queryImgBanner = "ib.banner_image_url"

        await db.query(`SELECT ${queryUser}, ${queryImgProfile}, ${queryImgBanner}
                        FROM users u
                        LEFT JOIN profile_images ip ON ip.user_id = ?
                        LEFT JOIN banner_images ib ON ib.user_id = ?
                        WHERE u.user_id = ?`, [id, id, id], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length > 0) {
                    res.send({
                        alert: false,
                        userData: {
                            last_name: result[0].last_name,
                            first_name: result[0].first_name,
                            bio: result[0].bio,
                            likes_total: result[0].likes_total,
                            publications_total: result[0].publications_total,
                            friends_total: result[0].friends_total,
                            profile_image_url: result[0].profile_image_url,
                            banner_image_url: result[0].banner_image_url
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
    const { last_name, first_name, bio } = req.body
    const id = req.params.id
    const regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/

    if (last_name != null && first_name != null) {
        if (last_name.match(regex) && first_name.match(regex)) {
            await db.query("UPDATE users SET last_name = ?, first_name = ?, bio = ? WHERE user_id = ?",
            [last_name, first_name, bio, id], (err, result) => {
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

    
    db.query("UPDATE profile_images SET profile_image_url = ? WHERE user_id = ?",
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

// Update image banner
exports.uploadImageBanner = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt
    
    db.query("UPDATE banner_images SET banner_image_url = ? WHERE user_id = ?",
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