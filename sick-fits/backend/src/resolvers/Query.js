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
    }
};

module.exports = Query;
