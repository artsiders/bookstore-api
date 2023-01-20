module.exports.popExtension = (filename) => {
    filename = filename.split(".")
    filename.pop()
    return filename.join('_')
}

