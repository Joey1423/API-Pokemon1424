const pokemons = [
  {
    id: 1,
    name: 'Bulbizarre',
    hp: 25,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
    types: ['Plante', 'Poison'],
    created: new Date()
  },
  {
    id: 2,
    name: 'Salamèche',
    hp: 28,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png',
    types: ['Feu'],
    created: new Date()
  },
  {
    id: 3,
    name: 'Carapuce',
    hp: 21,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/007.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 4,
    name: 'Aspicot',
    hp: 16,
    cp: 2,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/013.png',
    types: ['Insecte', 'Poison'],
    created: new Date()
  },
  {
    id: 5,
    name: 'Roucool',
    hp: 30,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/016.png',
    types: ['Normal', 'Vol'],
    created: new Date()
  },
  {
    id: 6,
    name: 'Rattata',
    hp: 18,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/019.png',
    types: ['Normal'],
    created: new Date()
  },
  {
    id: 7,
    name: 'Piafabec',
    hp: 14,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/021.png',
    types: ['Normal', 'Vol'],
    created: new Date()
  },
  {
    id: 8,
    name: 'Abo',
    hp: 16,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/023.png',
    types: ['Poison'],
    created: new Date()
  },
  {
    id: 9,
    name: 'Pikachu',
    hp: 21,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/025.png',
    types: ['Electrik'],
    created: new Date()
  },
  {
    id: 10,
    name: 'Sabelette',
    hp: 19,
    cp: 3,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/027.png',
    types: ['Normal'],
    created: new Date()
  },
  {
    id: 11,
    name: 'Mélofée',
    hp: 25,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/035.png',
    types: ['Fée'],
    created: new Date()
  },
  {
    id: 12,
    name: 'Groupix',
    hp: 17,
    cp: 8,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/037.png',
    types: ['Feu'],
    created: new Date()
  },
  {
    id: 13,
    name: 'Nosferapti',
    hp: 18,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/041.png',
    types: ['Poison', 'Vol'],
    created: new Date()
  },
  {
    id: 14,
    name: 'Mystherbe',
    hp: 19,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/043.png',
    types: ['Plante', 'Poison'],
    created: new Date()
  },
  {
    id: 15,
    name: 'Paras',
    hp: 17,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/046.png',
    types: ['Insecte', 'Plante'],
    created: new Date()
  },
  {
    id: 16,
    name: 'Mimitoss',
    hp: 18,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/048.png',
    types: ['Insecte', 'Poison'],
    created: new Date()
  },
  {
    id: 17,
    name: 'Taupiqueur',
    hp: 16,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/050.png',
    types: ['Sol'],
    created: new Date()
  },
  {
    id: 18,
    name: 'Miaouss',
    hp: 20,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/052.png',
    types: ['Normal'],
    created: new Date()
  },
  {
    id: 19,
    name: 'Psykokwak',
    hp: 22,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/054.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 20,
    name: 'Ferosinge',
    hp: 21,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/056.png',
    types: ['Combat'],
    created: new Date()
  },
  {
    id: 21,
    name: 'Caninos',
    hp: 24,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/058.png',
    types: ['Feu'],
    created: new Date()
  },
  {
    id: 22,
    name: 'Ptitard',
    hp: 20,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/060.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 23,
    name: 'Abra',
    hp: 15,
    cp: 8,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/063.png',
    types: ['Psy'],
    created: new Date()
  },
  {
    id: 24,
    name: 'Machoc',
    hp: 23,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/066.png',
    types: ['Combat'],
    created: new Date()
  },
  {
    id: 25,
    name: 'Chetiflor',
    hp: 20,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/069.png',
    types: ['Plante', 'Poison'],
    created: new Date()
  },
  {
    id: 26,
    name: 'Tentacool',
    hp: 19,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/072.png',
    types: ['Eau', 'Poison'],
    created: new Date()
  },
  {
    id: 27,
    name: 'Racaillou',
    hp: 24,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/074.png',
    types: ['Roche', 'Sol'],
    created: new Date()
  },
  {
    id: 28,
    name: 'Ponyta',
    hp: 22,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/077.png',
    types: ['Feu'],
    created: new Date()
  },
  {
    id: 29,
    name: 'Ramoloss',
    hp: 28,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/079.png',
    types: ['Eau', 'Psy'],
    created: new Date()
  },
  {
    id: 30,
    name: 'Magneti',
    hp: 18,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/081.png',
    types: ['Electrik', 'Acier'],
    created: new Date()
  },
  {
    id: 31,
    name: 'Doduo',
    hp: 20,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/084.png',
    types: ['Normal', 'Vol'],
    created: new Date()
  },
  {
    id: 32,
    name: 'Otaria',
    hp: 23,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/086.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 33,
    name: 'Tadmorv',
    hp: 22,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/088.png',
    types: ['Poison'],
    created: new Date()
  },
  {
    id: 34,
    name: 'Kokiyas',
    hp: 21,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/090.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 35,
    name: 'Fantominus',
    hp: 17,
    cp: 8,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/092.png',
    types: ['Spectre', 'Poison'],
    created: new Date()
  },
  {
    id: 36,
    name: 'Soporifik',
    hp: 20,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/096.png',
    types: ['Psy'],
    created: new Date()
  },
  {
    id: 37,
    name: 'Krabby',
    hp: 19,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/098.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 38,
    name: 'Voltorbe',
    hp: 18,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/100.png',
    types: ['Electrik'],
    created: new Date()
  },
  {
    id: 39,
    name: 'Osselait',
    hp: 21,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/104.png',
    types: ['Sol'],
    created: new Date()
  },
  {
    id: 40,
    name: 'Saquedeneu',
    hp: 24,
    cp: 4,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/114.png',
    types: ['Plante'],
    created: new Date()
  },
  {
    id: 41,
    name: 'Kangourex',
    hp: 30,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/115.png',
    types: ['Normal'],
    created: new Date()
  },
  {
    id: 42,
    name: 'Hypotrempe',
    hp: 20,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/116.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 43,
    name: 'Poissirene',
    hp: 19,
    cp: 5,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/118.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 44,
    name: 'Stari',
    hp: 18,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/120.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 45,
    name: 'Mr Mime',
    hp: 22,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/122.png',
    types: ['Psy', 'Fee'],
    created: new Date()
  },
  {
    id: 46,
    name: 'Insecateur',
    hp: 23,
    cp: 8,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/123.png',
    types: ['Insecte', 'Vol'],
    created: new Date()
  },
  {
    id: 47,
    name: 'Lippoutou',
    hp: 20,
    cp: 7,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/124.png',
    types: ['Glace', 'Psy'],
    created: new Date()
  },
  {
    id: 48,
    name: 'Elektek',
    hp: 22,
    cp: 8,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/125.png',
    types: ['Electrik'],
    created: new Date()
  },
  {
    id: 49,
    name: 'Magmar',
    hp: 24,
    cp: 8,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/126.png',
    types: ['Feu'],
    created: new Date()
  },
  {
    id: 50,
    name: 'Magicarpe',
    hp: 12,
    cp: 2,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/129.png',
    types: ['Eau'],
    created: new Date()
  },
  {
    id: 51,
    name: 'Metamorph',
    hp: 20,
    cp: 3,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/132.png',
    types: ['Normal'],
    created: new Date()
  },
  {
    id: 52,
    name: 'Evoli',
    hp: 21,
    cp: 6,
    picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/133.png',
    types: ['Normal'],
    created: new Date()
  }
]

module.exports = pokemons
