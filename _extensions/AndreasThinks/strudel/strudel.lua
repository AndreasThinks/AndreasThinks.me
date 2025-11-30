local function ensureHtmlDeps()
  quarto.doc.addHtmlDependency({
    name = 'strudel',
    version = '1.2.6',
    scripts = {'strudel.js'},
    stylesheets = {'strudel.css'},
  })
end

function Meta(m)
  ensureHtmlDeps()
  return m
end
