let AdmZip = require('adm-zip');

module.exports = (dataObj) => {
    let zip = new AdmZip();

    for (let key in dataObj) {
        const fileContent = dataObj[key];
        zip.addFile(, new Buffer(fileContent), key, 0o644);

    }
    return zip.toBuffer();
};
