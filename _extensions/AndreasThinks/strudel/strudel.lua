local function ensureHtmlDeps()
  quarto.doc.addHtmlDependency({
    name = 'strudel',
    version = '1.2.6',
    scripts = {'strudel.js'},
    stylesheets = {'strudel.css'},
  })
end

function Meta(m)
  if not quarto.doc.isFormat("html") then
    return m
  end
  ensureHtmlDeps()
  return m
end
