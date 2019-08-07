const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

const Mutation = {
    async createItem(parent, args, ctx, info) {
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },
    updateItem(parent, args, ctx, info) {
        // Copy updates
        const updates = { ...args };
        // Remove ID from updates
        delete updates.id;
        // Update
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            },
        }, info);
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // Find item, check if user owns item, delete
        const item = await ctx.db.query.item({ where }, `{ id title }`);
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        // lowercase email
        args.email = args.email.toLowerCase();
        // hash password
        const password = await bcrypt.hash(args.password, 10);
        // create user in db
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);
        // create JWT token 
        const token = JWT.sign({ userId: user.id }, process.env.APP_SECRET);
        // set jwt as cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        return user;
    }
};

module.exports = Mutation;
