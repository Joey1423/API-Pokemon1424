const express = require('express')
const path = require('path')
const app = express()
const port = 3003
const pokemons = require('../db-pokemons')
const { success } = require('../helper')

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildQuery = ({
  q = '',
  view = 'gallery',
  element = 'all',
  types = [],
  hpMin = '',
  hpMax = '',
  cpMin = '',
  cpMax = '',
  sort = 'id-asc'
}) => {
  const params = new URLSearchParams()

  if (q) params.set('q', q)
  if (view && view !== 'gallery') params.set('view', view)
  if (element && element !== 'all') params.set('element', element)
  types.forEach((type) => params.append('types', type))
  if (hpMin !== '') params.set('hpMin', String(hpMin))
  if (hpMax !== '') params.set('hpMax', String(hpMax))
  if (cpMin !== '') params.set('cpMin', String(cpMin))
  if (cpMax !== '') params.set('cpMax', String(cpMax))
  if (sort && sort !== 'id-asc') params.set('sort', sort)

  return params.toString()
}

app.get('/', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const selectedView = req.query.view === 'table' ? 'table' : 'gallery'
  const selectedElement =
    typeof req.query.element === 'string' ? req.query.element.trim() : 'all'
  const selectedTypes = Array.isArray(req.query.types)
    ? req.query.types.map((type) => String(type).trim()).filter(Boolean)
    : typeof req.query.types === 'string'
      ? req.query.types
          .split(',')
          .map((type) => type.trim())
          .filter(Boolean)
      : []
  const hpMinRaw = typeof req.query.hpMin === 'string' ? req.query.hpMin.trim() : ''
  const hpMaxRaw = typeof req.query.hpMax === 'string' ? req.query.hpMax.trim() : ''
  const cpMinRaw = typeof req.query.cpMin === 'string' ? req.query.cpMin.trim() : ''
  const cpMaxRaw = typeof req.query.cpMax === 'string' ? req.query.cpMax.trim() : ''
  const requestedSort =
    typeof req.query.sort === 'string' ? req.query.sort.trim() : 'id-asc'
  const allowedSorts = ['id-asc', 'id-desc', 'name-asc', 'name-desc', 'hp-desc', 'cp-desc']
  const selectedSort = allowedSorts.includes(requestedSort)
    ? requestedSort
    : 'id-asc'

  const toNumberOrEmpty = (value) => {
    if (value === '') return ''

    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? '' : parsed
  }

  const hpMin = toNumberOrEmpty(hpMinRaw)
  const hpMax = toNumberOrEmpty(hpMaxRaw)
  const cpMin = toNumberOrEmpty(cpMinRaw)
  const cpMax = toNumberOrEmpty(cpMaxRaw)

  const elements = [...new Set(pokemons.flatMap((pokemon) => pokemon.types))].sort(
    (a, b) => a.localeCompare(b, 'fr')
  )

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesName = q
      ? pokemon.name.toLowerCase().includes(q.toLowerCase())
      : true
    const matchesElement =
      selectedElement !== 'all' ? pokemon.types.includes(selectedElement) : true
    const matchesTypes =
      selectedTypes.length > 0 ? selectedTypes.every((type) => pokemon.types.includes(type)) : true
    const matchesHpMin = hpMin !== '' ? pokemon.hp >= hpMin : true
    const matchesHpMax = hpMax !== '' ? pokemon.hp <= hpMax : true
    const matchesCpMin = cpMin !== '' ? pokemon.cp >= cpMin : true
    const matchesCpMax = cpMax !== '' ? pokemon.cp <= cpMax : true

    return (
      matchesName &&
      matchesElement &&
      matchesTypes &&
      matchesHpMin &&
      matchesHpMax &&
      matchesCpMin &&
      matchesCpMax
    )
  })

  const sortedPokemons = [...filteredPokemons].sort((a, b) => {
    if (selectedSort === 'id-desc') return b.id - a.id
    if (selectedSort === 'name-asc') return a.name.localeCompare(b.name, 'fr')
    if (selectedSort === 'name-desc') return b.name.localeCompare(a.name, 'fr')
    if (selectedSort === 'hp-desc') return b.hp - a.hp
    if (selectedSort === 'cp-desc') return b.cp - a.cp

    return a.id - b.id
  })

  const cards = sortedPokemons
    .map((pokemon, index) => {
      const payload = encodeURIComponent(
        JSON.stringify({
          id: pokemon.id,
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types
        })
      )

      return `
      <article class="pokemon-card reveal" style="--delay:${index * 50}ms" data-pokemon="${payload}">
        <div class="pokemon-image-wrap">
          <img src="${pokemon.picture}" alt="${pokemon.name}" width="110" height="110" loading="lazy" />
        </div>
        <p class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</p>
        <h3>${pokemon.name}</h3>
        <p class="pokemon-type">${pokemon.types.join(' • ')}</p>
      </article>
    `
    })
    .join('')

  const rows = sortedPokemons
    .map((pokemon, index) => {
      const payload = encodeURIComponent(
        JSON.stringify({
          id: pokemon.id,
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types
        })
      )

      return `
      <tr class="reveal" style="--delay:${index * 30}ms">
        <td>#${pokemon.id.toString().padStart(3, '0')}</td>
        <td>${pokemon.name}</td>
        <td>${pokemon.types.join(', ')}</td>
        <td class="stat">${pokemon.hp}</td>
        <td class="stat">${pokemon.cp}</td>
        <td class="action-cell">
          <button class="open-details" type="button" data-pokemon="${payload}">Voir fiche</button>
        </td>
      </tr>
    `
    })
    .join('')

  const galleryLink = buildQuery({
    q,
    view: 'gallery',
    element: selectedElement,
    types: selectedTypes,
    hpMin,
    hpMax,
    cpMin,
    cpMax,
    sort: selectedSort
  })
  const tableLink = buildQuery({
    q,
    view: 'table',
    element: selectedElement,
    types: selectedTypes,
    hpMin,
    hpMax,
    cpMin,
    cpMax,
    sort: selectedSort
  })
  const escapedQ = escapeHtml(q)
  const escapedView = escapeHtml(selectedView)
  const escapedElement = escapeHtml(selectedElement)
  const escapedSort = escapeHtml(selectedSort)
  const escapedHpMin = hpMin === '' ? '' : escapeHtml(String(hpMin))
  const escapedHpMax = hpMax === '' ? '' : escapeHtml(String(hpMax))
  const escapedCpMin = cpMin === '' ? '' : escapeHtml(String(cpMin))
  const escapedCpMax = cpMax === '' ? '' : escapeHtml(String(cpMax))
  const isAnyTypeSelected = selectedTypes.length > 0
  const activeCount = filteredPokemons.length
  const totalCount = pokemons.length
  const selectedTypeSummary = selectedTypes.length ? selectedTypes.join(', ') : 'Tous les types'
  const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
  const randomPokemonPayload = encodeURIComponent(
    JSON.stringify({
      id: randomPokemon.id,
      name: randomPokemon.name,
      hp: randomPokemon.hp,
      cp: randomPokemon.cp,
      picture: randomPokemon.picture,
      types: randomPokemon.types
    })
  )

  res.send(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pokedex dynamique</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;500;700&display=swap');

          :root {
            --bg: #f4f5f7;
            --surface: #ffffff;
            --surface-2: #fdf1da;
            --text: #191c22;
            --muted: #586074;
            --line: #d6dae2;
            --brand: #ed6a2f;
            --brand-dark: #cc4f1f;
            --brand-soft: #ffe5d4;
            --radius: 18px;
            --shadow: 0 18px 40px rgba(29, 32, 43, 0.13);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            font-family: 'IBM Plex Sans', sans-serif;
            color: var(--text);
            background:
              radial-gradient(circle at 14% -4%, #ffd3bd 0, transparent 42%),
              radial-gradient(circle at 91% 18%, #ffe6a9 0, transparent 33%),
              linear-gradient(160deg, #f8f9fb 0%, #edf0f7 100%);
          }

          .app-shell {
            max-width: 1120px;
            margin: 30px auto 40px;
            padding: 0 18px;
          }

          .layout-grid {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 14px;
            align-items: start;
          }

          .sidebar {
            position: sticky;
            top: 14px;
          }

          .filters-title {
            margin: 0 0 10px;
            font-family: 'Bricolage Grotesque', sans-serif;
            font-size: 22px;
          }

          .filters-subtitle {
            margin: 0 0 14px;
            color: #616a7d;
            font-size: 13px;
          }

          .filter-block {
            margin-bottom: 14px;
          }

          .filter-block:last-child {
            margin-bottom: 0;
          }

          .filter-block label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            margin: 0 0 6px;
            color: #374057;
          }

          .filter-hint {
            margin: 6px 0 0;
            color: #697284;
            font-size: 12px;
          }

          .filter-input,
          .filter-select {
            width: 100%;
            border: 1px solid var(--line);
            border-radius: 10px;
            padding: 9px 10px;
            font-size: 14px;
            background: #fff;
          }

          .range-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .sidebar-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .btn-secondary {
            border: 1px solid #d3d8e3;
            border-radius: 10px;
            padding: 10px 12px;
            text-decoration: none;
            color: #3f4759;
            background: #fff;
            text-align: center;
            font-weight: 700;
            font-size: 14px;
          }

          .stats-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 14px;
          }

          .stat-mini {
            padding: 10px;
            border-radius: 14px;
            background: linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%);
            border: 1px solid #e4e7ef;
          }

          .stat-mini strong {
            display: block;
            font-family: 'Bricolage Grotesque', sans-serif;
            font-size: 22px;
            line-height: 1;
            margin-bottom: 2px;
          }

          .stat-mini span {
            color: #697284;
            font-size: 12px;
            font-weight: 700;
          }

          .type-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .type-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            border-radius: 12px;
            border: 1px solid #e4e7ef;
            background: #fff;
            font-size: 13px;
            color: #2f3645;
          }

          .type-option input {
            accent-color: var(--brand);
          }

          .type-option.active {
            border-color: #f1b184;
            background: #fff3ec;
            color: #9d4220;
          }

          .content-stack {
            min-width: 0;
          }

          .hero {
            position: relative;
            overflow: hidden;
            border-radius: 26px;
            padding: 30px clamp(18px, 4vw, 34px);
            margin-bottom: 18px;
            background: linear-gradient(120deg, #18233f 0%, #202d52 56%, #31457c 100%);
            color: #f9fbff;
            box-shadow: var(--shadow);
          }

          .hero::after {
            content: '';
            position: absolute;
            width: 280px;
            height: 280px;
            right: -90px;
            top: -70px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.34) 0%, transparent 70%);
            border-radius: 999px;
            animation: float 8s ease-in-out infinite;
          }

          .hero h1 {
            margin: 0 0 8px;
            font-family: 'Bricolage Grotesque', sans-serif;
            font-size: clamp(30px, 4.6vw, 48px);
            letter-spacing: 0.3px;
          }

          .hero p {
            margin: 0;
            color: #d3defe;
            font-size: 15px;
          }

          .panel {
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(4px);
            border: 1px solid #e6e9ef;
            border-radius: 22px;
            padding: 16px;
            margin-bottom: 14px;
            box-shadow: 0 10px 30px rgba(28, 31, 41, 0.08);
          }

          .search-form {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
          }

          .search-form input[type='search'] {
            flex: 1;
            min-width: 220px;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 12px 14px;
            font-size: 15px;
            background: #fff;
            color: var(--text);
          }

          .search-form button,
          .open-details {
            border: 0;
            border-radius: 12px;
            background: linear-gradient(130deg, var(--brand), #f29142 72%);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            padding: 11px 14px;
            transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          }

          .search-form button:hover,
          .open-details:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 18px rgba(237, 106, 47, 0.32);
            filter: saturate(1.05);
          }

          .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .chip {
            padding: 7px 11px;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: #fff;
            color: #2f3645;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: 0.2s ease;
          }

          .chip.active {
            border-color: #f3a476;
            background: var(--brand-soft);
            color: #9b3f1d;
          }

          .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
          }

          .count {
            margin: 0;
            color: var(--muted);
            font-weight: 600;
            font-size: 14px;
          }

          .views {
            display: inline-flex;
            gap: 8px;
          }

          .view-btn {
            text-decoration: none;
            border: 1px solid var(--line);
            color: #384054;
            background: #fff;
            border-radius: 10px;
            padding: 8px 11px;
            font-weight: 700;
            font-size: 14px;
          }

          .view-btn.active {
            border-color: #f4a277;
            background: #fff2e9;
            color: #9c411e;
          }

          .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 12px;
          }

          .pokemon-card {
            border: 1px solid #e4e7ef;
            border-radius: var(--radius);
            padding: 14px 12px;
            background: linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%);
            text-align: center;
            cursor: pointer;
            transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
            box-shadow: 0 5px 14px rgba(34, 40, 57, 0.06);
          }

          .pokemon-card:hover {
            transform: translateY(-6px) rotate(-0.4deg);
            border-color: #f0b18f;
            box-shadow: 0 16px 28px rgba(34, 40, 57, 0.16);
          }

          .pokemon-image-wrap {
            width: 108px;
            height: 108px;
            margin: 0 auto 8px;
            border-radius: 16px;
            display: grid;
            place-items: center;
            background: radial-gradient(circle at 24% 24%, #fff4d3 0, #ffe7ce 48%, #f6d1be 100%);
          }

          .pokemon-image-wrap img {
            width: 96px;
            height: 96px;
            object-fit: contain;
            filter: drop-shadow(0 6px 4px rgba(0, 0, 0, 0.17));
          }

          .pokemon-id {
            margin: 0;
            font-size: 11px;
            color: #8b92a4;
            letter-spacing: 0.7px;
            font-weight: 700;
          }

          .pokemon-card h3 {
            margin: 4px 0 6px;
            font-family: 'Bricolage Grotesque', sans-serif;
            font-size: 20px;
          }

          .pokemon-type {
            margin: 0;
            color: #5f6678;
            font-size: 13px;
            font-weight: 600;
          }

          .table-wrap {
            overflow: auto;
            border: 1px solid #e4e6ed;
            border-radius: 16px;
            background: #fff;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 10px;
            border-bottom: 1px solid #eef1f5;
            font-size: 14px;
          }

          th {
            text-align: left;
            background: #f9fafc;
            color: #4a5467;
            font-size: 13px;
            letter-spacing: 0.2px;
          }

          tr:hover td {
            background: #fcf6f2;
          }

          td.stat {
            text-align: right;
            font-weight: 700;
          }

          td.action-cell {
            text-align: right;
          }

          .empty {
            text-align: center;
            padding: 28px 10px;
            color: #5d6577;
            font-weight: 600;
          }

          .pokemon-modal {
            position: fixed;
            inset: 0;
            background: rgba(9, 13, 21, 0.58);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 90;
            padding: 20px;
          }

          .pokemon-modal.is-open {
            display: flex;
          }

          .modal-card {
            width: min(760px, 100%);
            border-radius: 20px;
            background: #fff;
            box-shadow: 0 24px 44px rgba(16, 18, 25, 0.28);
            overflow: hidden;
            animation: pop 0.26s ease;
          }

          .modal-head {
            position: relative;
            background: linear-gradient(140deg, #1f2e55, #304880 60%, #4763a7);
            color: #fff;
            padding: 18px 18px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .modal-head h2 {
            margin: 0;
            font-family: 'Bricolage Grotesque', sans-serif;
            font-size: clamp(24px, 4vw, 34px);
          }

          .close-btn {
            width: 36px;
            height: 36px;
            border: 0;
            border-radius: 10px;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.18);
            color: #fff;
            font-size: 20px;
          }

          .modal-body {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 20px;
            padding: 20px;
          }

          .modal-body img {
            width: 180px;
            height: 180px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
            filter: drop-shadow(0 8px 8px rgba(0, 0, 0, 0.18));
          }

          .meta {
            margin: 0 0 10px;
            color: #4f5769;
            font-weight: 700;
          }

          .types-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
          }

          .type-pill {
            border-radius: 999px;
            background: #ffe7da;
            color: #9e461f;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 700;
          }

          .stat-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(120px, 1fr));
            gap: 8px;
            margin-bottom: 12px;
          }

          .stat-card {
            background: #f7f8fb;
            border: 1px solid #e5e8ef;
            border-radius: 12px;
            padding: 10px;
          }

          .stat-card strong {
            display: block;
            font-size: 22px;
            font-family: 'Bricolage Grotesque', sans-serif;
            line-height: 1;
            margin-bottom: 2px;
          }

          .stat-card span {
            color: #636d80;
            font-size: 12px;
            font-weight: 700;
          }

          .description {
            margin: 0;
            color: #3d4353;
            line-height: 1.5;
          }

          .reveal {
            opacity: 0;
            transform: translateY(12px);
            animation: reveal 0.6s ease forwards;
            animation-delay: var(--delay, 0ms);
          }

          @keyframes reveal {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pop {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(10px);
            }
          }

          @media (max-width: 860px) {
            .layout-grid {
              grid-template-columns: 1fr;
            }

            .stats-strip {
              grid-template-columns: 1fr;
            }

            .type-grid {
              grid-template-columns: 1fr;
            }

            .sidebar {
              position: static;
            }

            .modal-body {
              grid-template-columns: 1fr;
              gap: 10px;
            }

            .modal-body img {
              width: 150px;
              height: 150px;
            }
          }
        </style>
      </head>
      <body>
        <main class="app-shell">
          <header class="hero reveal">
            <h1>Pokedex interactif</h1>
            <p>Recherche rapide, filtres avancés et fiche détaillée animée au clic.</p>
          </header>

          <div class="layout-grid">
            <aside class="panel reveal sidebar" style="--delay:50ms">
              <h2 class="filters-title">Filtres</h2>
              <p class="filters-subtitle">Affinez la liste par type, stats et ordre de tri.</p>
              <div class="stats-strip">
                <div class="stat-mini">
                  <strong>${activeCount}</strong>
                  <span>Résultats</span>
                </div>
                <div class="stat-mini">
                  <strong>${elements.length}</strong>
                  <span>Types</span>
                </div>
                <div class="stat-mini">
                  <strong>${selectedTypes.length}</strong>
                  <span>Choisis</span>
                </div>
              </div>

              <form method="get" action="/" class="sidebar-form">
                <input type="hidden" name="view" value="${escapedView}" />

                <div class="filter-block">
                  <label for="q">Nom</label>
                  <input
                    id="q"
                    class="filter-input"
                    type="search"
                    name="q"
                    value="${escapedQ}"
                    placeholder="Ex: pika"
                  />
                </div>

                <div class="filter-block">
                  <label for="element">Element</label>
                  <select id="element" class="filter-select" name="element">
                    <option value="all" ${selectedElement === 'all' ? 'selected' : ''}>Tous</option>
                    ${elements
                      .map(
                        (element) =>
                          `<option value="${escapeHtml(element)}" ${
                            element === selectedElement ? 'selected' : ''
                          }>${element}</option>`
                      )
                      .join('')}
                  </select>
                  <p class="filter-hint">Le filtre élément reste pratique pour une sélection rapide.</p>
                </div>

                <div class="filter-block">
                  <label>Types multiples</label>
                  <div class="type-grid">
                    ${elements
                      .map(
                        (element) => `<label class="type-option ${
                          selectedTypes.includes(element) ? 'active' : ''
                        }">
                          <input
                            type="checkbox"
                            name="types"
                            value="${escapeHtml(element)}"
                            ${selectedTypes.includes(element) ? 'checked' : ''}
                          />
                          ${element}
                        </label>`
                      )
                      .join('')}
                  </div>
                  <p class="filter-hint">Cochez plusieurs types pour réduire la liste.</p>
                </div>

                <div class="filter-block">
                  <label>HP</label>
                  <div class="range-grid">
                    <input class="filter-input" type="number" name="hpMin" value="${escapedHpMin}" min="0" placeholder="Min" />
                    <input class="filter-input" type="number" name="hpMax" value="${escapedHpMax}" min="0" placeholder="Max" />
                  </div>
                </div>

                <div class="filter-block">
                  <label>CP</label>
                  <div class="range-grid">
                    <input class="filter-input" type="number" name="cpMin" value="${escapedCpMin}" min="0" placeholder="Min" />
                    <input class="filter-input" type="number" name="cpMax" value="${escapedCpMax}" min="0" placeholder="Max" />
                  </div>
                </div>

                <div class="filter-block">
                  <label for="sort">Tri</label>
                  <select id="sort" class="filter-select" name="sort">
                    <option value="id-asc" ${selectedSort === 'id-asc' ? 'selected' : ''}>ID croissant</option>
                    <option value="id-desc" ${selectedSort === 'id-desc' ? 'selected' : ''}>ID decroissant</option>
                    <option value="name-asc" ${selectedSort === 'name-asc' ? 'selected' : ''}>Nom A-Z</option>
                    <option value="name-desc" ${selectedSort === 'name-desc' ? 'selected' : ''}>Nom Z-A</option>
                    <option value="hp-desc" ${selectedSort === 'hp-desc' ? 'selected' : ''}>HP plus eleve</option>
                    <option value="cp-desc" ${selectedSort === 'cp-desc' ? 'selected' : ''}>CP plus eleve</option>
                  </select>
                </div>

                <div class="sidebar-actions">
                  <button type="submit">Appliquer</button>
                  <a class="btn-secondary" href="/?view=${escapedView}">Reinitialiser</a>
                  <button class="btn-secondary" type="button" id="randomPokemonBtn">Pokemon au hasard</button>
                </div>
              </form>
            </aside>

            <section class="content-stack">
              <section class="panel reveal toolbar" style="--delay:80ms">
                <p class="count">${activeCount} / ${totalCount} pokemon(s)</p>
                <div class="views">
                  <a href="/?${galleryLink}" class="view-btn ${
    selectedView === 'gallery' ? 'active' : ''
  }">Galerie</a>
                  <a href="/?${tableLink}" class="view-btn ${
    selectedView === 'table' ? 'active' : ''
  }">Tableau</a>
                </div>
              </section>

              <section class="panel reveal" style="--delay:110ms">
                <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
                  <div>
                    <p style="margin:0 0 4px;font-size:13px;color:#667083;font-weight:700">Filtres actifs</p>
                    <p style="margin:0;font-size:14px;font-weight:700">${selectedTypeSummary}${selectedElement !== 'all' ? ' • ' + selectedElement : ''}${hpMin !== '' || hpMax !== '' ? ' • HP ' + (hpMin === '' ? '0' : hpMin) + ' - ' + (hpMax === '' ? '∞' : hpMax) : ''}${cpMin !== '' || cpMax !== '' ? ' • CP ' + (cpMin === '' ? '0' : cpMin) + ' - ' + (cpMax === '' ? '∞' : cpMax) : ''}</p>
                  </div>
                </div>
                ${
                  selectedView === 'table'
                    ? `<div class="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Nom</th>
                              <th>Elements</th>
                              <th>HP</th>
                              <th>CP</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            ${rows || `<tr><td class="empty" colspan="6">Aucun pokemon ne correspond a la recherche.</td></tr>`}
                          </tbody>
                        </table>
                      </div>`
                    : `<div class="gallery">${cards || `<p class="empty">Aucun pokemon ne correspond a la recherche.</p>`}</div>`
                }
              </section>
            </section>
          </div>
        </main>

        <aside class="pokemon-modal" id="pokemonModal" aria-hidden="true">
          <article class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalName">
            <header class="modal-head">
              <h2 id="modalName">Pokemon</h2>
              <button class="close-btn" type="button" aria-label="Fermer">×</button>
            </header>
            <div class="modal-body">
              <img id="modalImage" src="" alt="" />
              <div>
                <p class="meta" id="modalMeta"></p>
                <div class="types-row" id="modalTypes"></div>
                <div class="stat-grid">
                  <div class="stat-card">
                    <strong id="modalHp">0</strong>
                    <span>HP</span>
                  </div>
                  <div class="stat-card">
                    <strong id="modalCp">0</strong>
                    <span>CP</span>
                  </div>
                </div>
                <p class="description" id="modalDescription"></p>
              </div>
            </div>
          </article>
        </aside>

        <script>
          const modal = document.getElementById('pokemonModal')
          const closeBtn = document.querySelector('.close-btn')
          const modalName = document.getElementById('modalName')
          const modalImage = document.getElementById('modalImage')
          const modalMeta = document.getElementById('modalMeta')
          const modalTypes = document.getElementById('modalTypes')
          const modalHp = document.getElementById('modalHp')
          const modalCp = document.getElementById('modalCp')
          const modalDescription = document.getElementById('modalDescription')
          const randomPokemonBtn = document.getElementById('randomPokemonBtn')
          const randomPokemon = JSON.parse(decodeURIComponent('${randomPokemonPayload}'))

          const getDescription = (pokemon) => {
            if (/mewtwo/i.test(pokemon.name)) {
              return 'Pokemon legendaire extremement rare, Mewtwo concentre une puissance psy hors norme et une intelligence redoutable.'
            }

            const powerLabel = pokemon.cp >= 8 ? 'tres eleve' : pokemon.cp >= 6 ? 'eleve' : 'modere'
            const staminaLabel = pokemon.hp >= 26 ? 'impressionnante' : pokemon.hp >= 20 ? 'solide' : 'plus fragile'
            const mainType = Array.isArray(pokemon.types) && pokemon.types.length ? pokemon.types[0] : 'mysterieux'

            return pokemon.name + ' est de type ' + mainType + '. Son potentiel offensif est ' + powerLabel + ' et son endurance est ' + staminaLabel + '. Cliquez sur un autre pokemon pour comparer son profil.'
          }

          const decodePokemon = (payload) => {
            try {
              return JSON.parse(decodeURIComponent(payload))
            } catch (error) {
              return null
            }
          }

          const openModal = (pokemon) => {
            if (!pokemon) return

            modalName.textContent = pokemon.name
            modalImage.src = pokemon.picture
            modalImage.alt = pokemon.name
            modalMeta.textContent = '#' + String(pokemon.id).padStart(3, '0') + ' - ' + pokemon.name
            modalHp.textContent = pokemon.hp
            modalCp.textContent = pokemon.cp
            modalDescription.textContent = getDescription(pokemon)
            modalTypes.innerHTML = ''

            pokemon.types.forEach((type) => {
              const pill = document.createElement('span')
              pill.className = 'type-pill'
              pill.textContent = type
              modalTypes.appendChild(pill)
            })

            modal.classList.add('is-open')
            modal.setAttribute('aria-hidden', 'false')
            document.body.style.overflow = 'hidden'
          }

          const closeModal = () => {
            modal.classList.remove('is-open')
            modal.setAttribute('aria-hidden', 'true')
            document.body.style.overflow = ''
          }

          document.querySelectorAll('[data-pokemon]').forEach((node) => {
            node.addEventListener('click', () => {
              const pokemon = decodePokemon(node.getAttribute('data-pokemon'))
              openModal(pokemon)
            })
          })

          closeBtn.addEventListener('click', closeModal)
          modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal()
          })

          document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeModal()
          })

          randomPokemonBtn.addEventListener('click', () => {
            openModal(randomPokemon)
          })
        </script>
      </body>
    </html>
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

app.get('/bonus', (req, res) => {
  res.sendFile(path.join(__dirname, 'bonus.html'))
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
