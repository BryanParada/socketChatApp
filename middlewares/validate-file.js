const { response } = require("express")


const validateUploadFile = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUp) {
        return res.status(400).json({ msg: 'No files were uploaded. - validateUploadfile Cotnroller'});
      }

      next();

}

module.exports = {
    validateUploadFile
}