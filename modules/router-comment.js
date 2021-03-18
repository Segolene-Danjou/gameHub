const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.render('index');
});

router.get('/game/:gameName', (request, response) => {
    // L'information variable est fourni par le client, donc celle-ci est accessible à l'intérieur de l'objet "request". Cet objet contien par défaut un autre objet stocké dans une propriété "params" dans lequel il va remplacer les segments dynamiques par les valeurs situés au même endroits que ces segments. on va donc se retrouver avec un objet renseigné avec des clé/valeur correspondant à tous les segments dynamiques.
    const gameName = request.params.gameName;
    // On a déouvert que l'on pouvait récupérer notre application (app) dans l'objet request (de toutes les routes), ce qui va nous permmettre de récupérer nos jeux qui sont stocké dans les "locals" de l'"app"
    const games = request.app.locals.games;
    // Maintenant je vais pouvoir récupérer l'objet du jeu courant en allant le chercher avec son nom (celui passé en paramètre de route)
    /*const game = games.find((currentGame) => {
        return currentGame.name === gameName
    });*/
    const game = games.find(currentGame => currentGame.name === gameName);

    /*
    pour l'exemple game peut ressembler à
    avant 
    {
        games: […]
    }
    
    {
    name: 'diceRoller',
    title: 'Dice Roller',
    cssFile: 'diceRoller.css',
    jsFile: 'diceRoller.js'
    }

    au final la vue recoit 

    {
    games: […]
    name: 'diceRoller',
    title: 'Dice Roller',
    cssFile: 'diceRoller.css',
    jsFile: 'diceRoller.js'
    }

    */
    //console.log(game);
    // On vérifie que le jeu existe
    if (game) {
        response.render(gameName, game);
    }else{
        // S'il n'existe pas on met le status de la page a 404 et on affiche un message personnalisé
        response.status(404).render('error404', {title: 'Error 404 Page not found'});
    }

});

// Pour mettre en place un page 404, on doit toujours la mettre à la fin de la chaine des middleware chargés de répondre aux routes référencés. Car si aucun de ces middlewares conditionné par une route ne répond, alors c'est le middleware non-conditionné de 404 qui répondra.
router.use((_, response) => {
    response.status(404).render('error404', {title: 'Error 404 Page not found'});
});

/*
router.get('/game/fourchette', (request, response) => {
    response.render('fourchette');
});
router.get('/game/diceRoller', (request, response) => {
    //La méthode render prend 2 arguments
    // 1. le chemin du fichier de la vue par rapport au dossier racine défini dans le app.set('views'…
    // 2. un objet qui contient des informations à "passer à la vue"
    // C'est à dire que chaque propriété de cet objet sera disponible sous forme de variable du coté du fiochier .ejs.
    // Cette variable est également accessible à travers un objet nommé "locals". En fait l'objhet dans le 2eme argument est stocké dans une variable "locals".
    response.render('diceRoller', {
        cssFile: '/css/diceRoller.css'
    });
    // la méthode render va faire :
    // const locals = {css: 'diceRoller.css'};
    // Mais en plus les différentes propriétés de locals seront accessibles sous forme de variable direct.
    // Donc on pourra apperler directement "css"
    // Cela corresponderai a un : 
    // const css = 'diceRoller.css';
    //! tips : cet objet est automatiquement fourni à tous les "include" de la vue principale en cascade
    
        //diceRoller.ejs ----> header.ejs ----> potentiellement à un //autre include à l'intérieur de header.ejs
     
});
*/


module.exports = router;