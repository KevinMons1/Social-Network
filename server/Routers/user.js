const express = require("express")
const router = express.Router()
const user = require("../Controllers/user")
const multer = require("../Middleware/multerImage")

// Routes

router.post('/friend/add/:id', user.addFriend)
router.post('/account/isFriend/:id', user.getIsFriend)

router.get('/account/informations/:id', user.getAccountInformations)
router.get('/simple/informations/:id', user.getSimpleUserInformations)
router.get('/userFriends/:id', user.getFriends)
router.get('/connected/friends/chat/:id', user.getFriendsChat)
router.get('/suggest/friend/:id', user.getSuggestFriend)
router.get('/search/:id', user.getSearchUser)

router.put('/account/informations/update/:id', user.updateAccountInformations)
router.put('/account/image/profile/:id', multer.single('file'), user.uploadImageProfile)
router.put('/account/image/banner/:id', multer.single('file'), user.uploadImageBanner)

router.delete('/account/friend/delete/:id', user.deleteFriend)

module.exports = router