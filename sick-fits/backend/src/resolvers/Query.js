const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // check if current user
        if (!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user({where: { id: ctx.request.userId }, 
        }, info);
    },
    async users(parent, args, ctx, info) {
        // check user permissions
        if(!ctx.request.userId) {
            throw new Error("Youn must be logged in")
        }
        hasPermission(ctx.request.user, ['ADMIN', 'PREMISSIONUPDATE']);

        return ctx.db.query.users({}, info);
    },
    async order(parent, args, ctx, info) {
        // make sure they are logged in
        if(!ctx.request.userId) {
            throw new Error("You are not logged in")
        }
        // query current order
        const order = await ctx.db.query.order({
            where: { id: args.id },
        }, info);
        // check if they have permissions to see order
        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermissionToSeeOrder = ctx.request.user.permissions.includes("ADMIN")
        if(!ownsOrder || !hasPermissionToSeeOrder) throw new Error("Can't see this")
        // return order
        return order;
    },
    async orders(parent, args, ctx, info) {
        const {userId } = ctx.request;
        if(!userId) throw new Error("you are not signed in")
        return ctx.db.query.orders({
            where: {
                user: { id: userId }
            }
        }, info)
    }
};

module.exports = Query;
