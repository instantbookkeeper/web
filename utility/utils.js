function formatSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"); // Replace spaces with hyphen
}

module.exports = { formatSlug };