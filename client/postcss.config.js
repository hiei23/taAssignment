module.exports = (ctx) => {
    return {
        map: ctx.options.map,
        plugins: {
            'postcss-import': { root: ctx.file.dirname },
            "autoprefixer": {
                "browsers": "> 5%"
            }
        }
    }
};
