const express = require('express');

const router = express.Router();

const fourchette = require('./ettehcruof');

const users = require('../data/users');

// Module permettant de chiffré et déchiffré un mot de passe ou tout autre chaine de caractère qui doit être sécurisé
const bcrypt = require('bcrypt');

// Afin de récupérer les informations fourni dans une requête de type POST, on a besxoin d'utilsier un middleware que va se charger de "parser" (parcourir) le corp de la requête (body) et de nous le fournir à l'intérieur de la requête sous forme d'objet (request.body)
router.use(express.urlencoded({ extended: true }));

router.get('/', (request, response) => {
    response.render('index');
});

/*
// Ce routeur gère l'affichage du login
router.get('/login', (request, response) => {
    response.render('login');
});

// Ce routeur gère la soummission du login ET l'affichage
router.post('/login', (request, response) => {
    console.log('post login');
    response.render('login');
});
*/

// Qui peut être factorisé de cette façon
// 1. on restreint d'abord sur la route
router.route('/login')
    // 2. on restreint sur la méthode HTTP
    .get((request, response) => {
        response.render('login');
    })
    .post((request, response) => {
        // ici on va pouvoir vérifier que la personne peut se connecter
        // Mais pour cela il faudrait déjà pouvoir récupérer les informations postés
        console.log(request.body);
        // maintenant on peut aller vérifier que le couple utilisateur/mot de passe existe dans notre json d'utilisateurs
        const user = users.find(currentUser => {
            const isUsernameValid = currentUser.username === request.body.username;
            // On compare le mot de passe non-chiffré avec le mot de passe chiffré stocké dans le json
            const isPasswordValid = bcrypt.compareSync(request.body.password, currentUser.password);
            return isUsernameValid && isPasswordValid;
        });

        let message;
        if (user) {
            // On peut connecter l'utilisateur
            // On redirige l'utilisateur sur la page d'accueil
            request.app.locals.user = user;
            response.redirect('/');
        } else {
            // On envoi un message d'erreur à l'utilisateur
            // On ne fais jamais de message explicite sur ce qui est erroné, on ne donne pas d'aide à celui qui tente de se connecter (cela peut être un pirate) on dit seulement qu'on ne peut pas le connecter
            message = `Désolé nous n'avons pas trouvé de compte associé, veuillez réessayer…`;
        }

        response.render('login', { message });
    });

router.get('/logout', (request, response) => {
    // Quand on veut vider/supprimer une propriété d'un objet on peut utiliser le mot clé "delete"
    //! attentiopn cela ne fonction QUE sur les propriété d'objet, on ne peut pas supprimer de variables
    delete request.app.locals.user;
    // Ensuite on a plus qu'a rediriger vers la page d'accueil
    response.redirect('/');
});

router.get('/game/ettehcruof', (request, response, next) => {
    // Ici je vais pouvoir inclure un traitement serveur particulier pour le jeu de la fourchette à l'envers
    // Les paramètres seront récupértés sous-forme de queryString 
    // La querystring permet de faire transité des information du client au serveur sans modifier la route orginal.
    // Afin de préciser un querystring dans une url on utilise le "?" chaqu'une des paires clé/valeur sont séparés par des "&"
    // Du coup notre route principal du jeu gardera le même schéma que les autres jeux (c'est à dire /game/:gameName mais on pourra y envoyer les actions du jours en tant que parmaètre de querystring.
    // Cette querystring est récupérable dans nos middleware à travers l'objet request, et plus précisémement à l'intérieur d'une de ses propriété : query
    // request.query va contenir un objet avec chaque paramètre du querystring et sa valeur associé

    // On initialise les variable nécessaire à l'affichage
    let message;
    let actionButtons = [
        'moins',
        'bravo',
        'plus',
    ];

    // On décide de spécifier l'action du jeu à travers un paramètre de querystring nommé action, il pourra contenir, plus, moins, bravo ou rien
    switch (request.query.action) {
        case 'plus':
            fourchette.plus();
            if (fourchette.isCheating()) {
                message = `J'aime pas les tricheurs, chao !`;
                // On n'affiche plus de boutons
                actionButtons = [];
            } else {
                message = `ok c'est plus, donc je propose ${fourchette.getProposition()}`;
            }
            break;
        case 'moins':
            fourchette.moins();
            if (fourchette.isCheating()) {
                message = `J'aime pas les tricheurs, chao !`;
                // On n'affiche plus de boutons
                actionButtons = [];
            } else {
                message = `ok c'est moins, donc je propose ${fourchette.getProposition()}`;
            }
            break;
        case 'bravo':
            fourchette.reset();
            message = `Super je suis trop fort !!`;
            actionButtons = ['replay'];
            break;
        default:
            fourchette.init();
            message = `Pensez à un nombre entre 0 et 100. Je propose ${fourchette.getProposition()}`;
            break;
    }

    // Je rend disponible les variable message et actionsButton (nécessaire à l'affichage) à travers l'output (response)
    // Response au même titre que app, contien une propriété locals ou l'on peut y stocker des informations, qui seront ensuite disponible dans les vues EJS.
    response.locals.message = message;
    response.locals.actionButtons = actionButtons;

    next();
});

router.get('/game/:gameName', (request, response, next) => {
    const gameName = request.params.gameName;
    const games = request.app.locals.games;
    const game = games.find(currentGame => currentGame.name === gameName);

    if (game) {
        return response.render(gameName, game);
    } else {
        //response.status(404).render('error404', {title: 'Error 404 Page not found'});
        // Désormais comme on a un middleware de bout de chaine des routes, on peut se contenter de passer la balle au middleware suivant si le jeu n'a pa été trouvé.
        next();
    }

});

router.use((_, response) => {
    response.status(404).render('error404', { title: 'Error 404 Page not found' });
});


module.exports = router;