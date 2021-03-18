const app = {

  player: {
    x: 0,
    y: 3,
    direction: 'right'
  },

  targetCell: {
    x: 5,
    y: 0,
  },

  grid: {
    width: 10,
    height: 6
  },

  moves: 0,

  gameOver: false,


  init: function () {
    console.log('init !');
    app.board = document.querySelector('#board');
    app.drawBoard();
    app.listenKeyboardEvents();
  },

  createMessageBox: () => {
    app.messageBox = document.createElement('div');
    app.messageBox.classList.add('message');
    app.board.appendChild(app.messageBox);
  },

  showMessage: (message) => {
    app.messageBox.textContent = message;
    app.messageBox.style.display = "block";
  },

  drawBoard: (message) => {
    app.createMessageBox();
    if (message) {
      app.showMessage(message);
    }
    // Je prépare l'élément DOM de mon joueur au tout debut, afin de pouvoir le mofidier n'importe où dans la méthode
    const playerDOM = document.createElement('div');
    playerDOM.classList.add('player');
    // On modifie le joueur (son apparence) en fonction de sa direction
    playerDOM.classList.add('player--' + app.player.direction);

    // on génère nos lignes

    //for (let iRow = 0; iRow < app.grid.height; iRow++) {
    // On a décidé d'inverser l'axe des Y contrairement au challenge
    for (let iRow = (app.grid.height - 1); iRow >= 0; iRow--) {
      // iRow correspond à l'axe des Y
      const row = document.createElement('div');
      row.classList.add('row');

      // On ajoute la ligne courante au plateau de jeu
      app.board.appendChild(row);

      // on créer nos cases/cellules
      // ici c'est la création des cases 
      for (let iCell = 0; iCell < app.grid.width; iCell++) {
        // iCell correspond à l'axe des X
        // Ici c'est la création d'une case (on est dans la case courante)
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // ce qui représente les y ce sont les index de boucle pour générer une ligne, on va donc comparer le Y de la targetCell avec l'index de ligne
        // Ce qui représente les x ce sont les index de cellules pour générer les cellules à l'intérieur d'une ligne, on va donc comparer le X dfe la targetCell avec les index de cellules
        // Les 2 doivent correspondre afin de définir une cas ecomme étant la targetCell
        if (app.targetCell.y === iRow && app.targetCell.x === iCell) {
          cell.classList.add('cell--target');
        }

        // Même principe pour le joueur, sauf qu'ici on ajoute une élémentDom pour représenter le joueur
        if (app.player.y === iRow && app.player.x === iCell) {
          // Il ne faut oublier d'ajouter le joueur à la case
          cell.appendChild(playerDOM);
        }

        // On ajoute la case courante à la ligne courante
        row.appendChild(cell);
        //debugger;
      }
    }
    app.isGameOver();
  },

  clearBoard: () => {
    app.board.textContent = '';
  },

  redrawBoard: (message) => {
    app.clearBoard();
    app.drawBoard(message);
  },

  turnLeft: () => {

    if (app.gameover) {
      return;
      // >Tout ce qui est après ne sera pas exécuté
    }
    app.moves++;
    // On va tester la direction actuelle du joueur
    // en fonction de sa direction, considérant qu'il tourne à gauche
    // On va redeterminer une nouvelle direction pour celui-ci
    if (app.player.direction === 'right') {
      app.player.direction = 'up';
    } else if (app.player.direction === 'up') {
      app.player.direction = 'left';
    } else if (app.player.direction === 'left') {
      app.player.direction = 'down';
    } else if (app.player.direction === 'down') {
      app.player.direction = 'right';
    }
    app.redrawBoard();
  },

  turnRight: () => {
    if (app.gameover) {
      return;
    }
    app.moves++;
    // C'est exactement pareil mais dans l'autre sens
    if (app.player.direction === 'right') {
      app.player.direction = 'down';
    } else if (app.player.direction === 'up') {
      app.player.direction = 'right';
    } else if (app.player.direction === 'left') {
      app.player.direction = 'up';
    } else if (app.player.direction === 'down') {
      app.player.direction = 'left';
    }
    app.redrawBoard();
  },

  moveForward: () => {

    if (app.gameover) {
      return;
    }
    app.moves++;
    // Il va falloir jouer avec les propriété x et y de player afin de changer sa position dans la grille

    // afin de savoir si on va pouvoir bouger dans le sens demander
    // On va d'abord stocker les futur coordonnées dauns des variables temporaire
    let xTemp = app.player.x,
      yTemp = app.player.y;

    // Le switch case permet d'ecrire plus simplement un bloc conditionnel simple (une seule valeur à vérifier)
    // Mais il est du coup limiter dans ses conditions
    switch (app.player.direction) {
      case 'right':
        // liste d'instructions
        // Quand on est dûr d'avoir rencontré le cas à traiter et qu'on ne veut plus rien faire on break (on sort du switch)
        // Ici comme on va vers la droite on augmente la propriété x de 1
        xTemp++;
        break;
      case 'down':
        // On décrémente le y
        yTemp--;
        break;
      case 'left':
        // On décrémente le x
        xTemp--;
        break;
      case 'up':
        // On incrémente le y
        yTemp++;
        break;
    }

    // Le variable temporaire nous sert à lire dans l'avenir de de savoir SI le mouvement est confirmé est ce qu'il va sortir de la grille ?
    // Si oui on applique le mouvement

    // Je me retrouve avec 2 valeurs qui ont potentiellement évolués
    // Je vais vérifier si une de ces valeurs sort du cadre de la grille
    if (
      xTemp >= 0 && xTemp < app.grid.width
      && yTemp >= 0 && yTemp < app.grid.height
    ) {
      // Je peux appliquer la nouvelle valeur de x et y au joueur
      app.player.x = xTemp;
      app.player.y = yTemp;
      app.redrawBoard();
    } else {
      app.redrawBoard('Mouvement impossible');
    }
  },

  listenKeyboardEvents: () => {
    // Info keyup VS keydown
    // Au delà du fait que le keydown soit déclenché au moins de relacher une touche et que keyup soit déclenché au moins d'appuyer sur une touche
    // Keydown lui se déclenche à intervalle régulier, tant que la touche est appuyer, donc il permet de faire avancer le joueur de plusieurs cases sans relever le doigt
    document.addEventListener('keyup', app.keyupHandler)
  },

  keyupHandler: (event) => {
    //console.log(event);
    // On a vue que evt contenait 3 propriétés définissant la touche utilisé pour l'évenement
    // On a appris que keyCode est deprécié (amené à disparaître)
    // Il ne nous reste donc que "key" et "code"
    // key est moins précis que "code" par ex pour la touche shift de gauche il ne précise que "shift", alors que "code" précise "ShiftLeft"
    // De plus "code" ne prend pas encompte les modifications de clavier (Si on est en azerty il affichera quand même le code qwerty)
    // Touche "A" donne "KeyQ" dans la propriété "code"
    // On va donc utiliser evt.code
    switch (event.code) {

      case "ArrowUp":
      case "KeyW":
        app.moveForward();
        break;
      case "ArrowLeft":
      case "KeyA":
        app.turnLeft();
        break;
      case "ArrowRight":
      case "KeyD":
        app.turnRight();

    }

  },

  isGameOver: () => {
    //On vérifie que les coordonnées du joueur et de la cellule d'arrivé correspondent
    if (app.player.x === app.targetCell.x && app.player.y === app.targetCell.y) {
      // C'est gagné
      app.gameover = true;
      app.showMessage(`
        Bravo, 
        c'est gagné 
        en ${app.moves} mouvements !!
      `);
      /*
      app.showMessage(
        "Bravo, " +
        "c'est gagné " +
        "en " + app.moves + " !!"
      );
      */
    }
  }

};


document.addEventListener('DOMContentLoaded', app.init);
