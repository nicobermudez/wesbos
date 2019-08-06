const Query = {
    users(parent, args, ctx, info) {
        return [{ name: 'Nico'}, {name: 'Diana'}, {name: 'Carlos'}, {name: 'Cata'}]
    }

};

module.exports = Query;
