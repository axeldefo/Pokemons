exports.search = function (nom, types, hp, pokedex) {
    
    console.log('types')
    console.log(types)
    console.log('types')
    const resultatsFiltres = pokedex.filter(pokemon => {
        // Filtrer par nom (si spécifié)
        if (nom && !pokemon.name.french.includes(nom)) {
            return false;
        }

        // Filtrer par types (si spécifiés)
        if (types && types.length > 0 && !types.every(type => pokemon.type.includes(type))) {
            return false;
        }

        // Filtrer par HP (si spécifié)
        if (hp && pokemon.base.HP !== hp) {
            return false;
        }

        return true;
    });

    return resultatsFiltres;
};