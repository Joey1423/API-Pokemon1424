const express = require('express')
const app = express()
const port = 3003
const pokemons = require('../db-pokemons')
const { success } = require('../helper')

app.get('/', (req, res) => {
  const cards = pokemons
    .map(
      (pokemon) => `
      <article style="border:1px solid #ddd;border-radius:10px;padding:12px;text-align:center;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <img src="${pokemon.picture}" alt="${pokemon.name}" width="96" height="96" style="display:block;margin:0 auto 8px;object-fit:contain" />
        <h3 style="margin:0 0 6px;font-size:16px">${pokemon.name}</h3>
        <p style="margin:0;color:#666;font-size:13px">Type: ${pokemon.types.join(', ')}</p>
      </article>
    `
    )
    .join('')

  res.send(`
    <main style="font-family:Verdana,Geneva,Tahoma,sans-serif;max-width:960px;margin:24px auto;padding:0 16px">
      <h1 style="margin-bottom:16px">Liste des Pokemons</h1>
      <section style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px">
        ${cards}
      </section>
    </main>
  `)
})

app.get('/api/pokemons', (req, res) => {
  const message = 'La liste des pokemons a bien ete recuperee.'
  const pokemonsWithImages = pokemons.map((pokemon) => ({
    ...pokemon,
    image: pokemon.picture
  }))

  res.json(success(message, pokemonsWithImages))
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
