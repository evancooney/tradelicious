

const songsContext = {
    key: '',
    values: {
        shareLink: () => (`${process.env.SHARE_LINK_BASE}/collections/${key}`),
        songs: []
    }
};
