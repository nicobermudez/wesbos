const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')
const { randomBytes } = require('crypto');
const { promisify } = require('util');

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
    },
    async signin(parent, { email, password }, ctx, info) {
        // check if there is a user with that login info
        const user = await ctx.db.query.user({ where: { email }});
        if(!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        // check if password is correct
        const valid = await bcrypt.compare(password, user.password)
        if(!valid) {
            throw new Error('Invalid Password!');
        }
        // create JWT token 
        const token = JWT.sign({ userId: user.id }, process.env.APP_SECRET);
        // set jwt as cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        return user;
    },
    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Goodbye' }
    },
    async requestReset(parent, args, ctx, info) {
        // check if this is a real user
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if(!user) {
            throw new Error(`No such user found for email ${args.email}`);
        }
        // set reset token and expiry
        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry }
        })
        console.log(res)
        return { message: "Thanks"}
        // email them reset token
    },
    async resetPassword(parent, args, ctx, info) {
        // 1. check if the passwords match
        if (args.password !== args.confirmPassword) {
          throw new Error("Yo Passwords don't match!");
        }
        // 2. check if its a legit reset token
        // 3. Check if its expired
        const [user] = await ctx.db.query.users({
          where: {
            resetToken: args.resetToken,
            resetTokenExpiry_gte: Date.now() - 3600000,
          },
        });
        if (!user) {
          throw new Error('This token is either invalid or expired!');
        }
        // 4. Hash their new password
        const password = await bcrypt.hash(args.password, 10);
        // 5. Save the new password to the user and remove old resetToken fields
        const updatedUser = await ctx.db.mutation.updateUser({
          where: { email: user.email },
          data: {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        // 6. Generate JWT
        const token = JWT.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        // 7. Set the JWT cookie
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        // 8. return the new user
        return updatedUser;
      },
};

module.exports = Mutation;
