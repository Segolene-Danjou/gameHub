module.exports = (request, response, next) => {
    // Afin de n'exécuter le log qu'a la fin de la requête (car on désire le veritable code http de status), on peut utiliser un écouteur d'évenement
    // C'est l'équivalent du addEventListener côté front (navigateur)
    // On place cet écouteur sur la requête, et on déclenche notre callback à la fin du traitement de la requête (écouteur "end")
    request.on('end', () => {
        const dateIso = new Date().toISOString();
        // Ici afin de récupérer l'ip on utilise une notation d'assignation "||". Cette notation permet d'assigné des valeurs en fallback a une variable. C'est à dire, si la première valeur founi est undefined, il passe à la suivante, jusqu'a trouvé une valeur qui n'est pas undefined
        // Ici le x-forwarded-for est l'ip fourni par un potential proxy (serveur de cache de votre provider)
        const ip = 
            request.headers['x-forwarded-for'] 
            || request.connection.remoteAddress 
            || request.socket.remoteAddress 
            || request.ip;
        // La route requêté est disponible dans l'objet de requête.
        const path = request.path;
        console.log(`[${dateIso} ${ip}] ${response.statusCode} ${path}`);
    });
    next();
};