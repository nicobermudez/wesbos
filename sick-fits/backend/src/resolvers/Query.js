const Query = {
    async items(parent, args, ctx, info) {
        console.log(args)
        const items = await ctx.db.query.items();
        return items
    }
};

module.exports = Query;
