const db = require('../database/models');


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({include:['genre']})
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,{include:['genre']})
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('../views/moviesAdd.ejs')
    },
    create: async function (req, res) {
        try {
            delete req.body.id
            let movie = await db.Movie.create({
                ...req.body})
            res.redirect('/movies')
        }catch(err) {
                res.send('err')
        }
},
    edit: async function(req, res) {
        try {
            let movie = await db.Movie.findByPk(req.params.id);
            res.render('../views/moviesEdit', {Movie: movie})
        }catch(err) {
            res.send(err)
        } 
    },
    update: async function (req,res) {
        try {
            let movie = await db.Movie.update(
                {
                    ...req.body
                },
                {where:{id:req.params.id}}
            );
            res.redirect('/movies')
        }catch(err) {
            res.send(err)
        }

    },
    delete: async function (req, res) {
        try {
            let movie = db.Movie.destroy(
                {
                    where: {id: req.params.id}
                }
            );
            res.redirect('/movies');
        } catch (err) {
            res.send(err)
        }
    },
    //destroy: function (req, res) {
        // TODO
    //}

}

module.exports = moviesController;


