local DEFAULT_VERSION = 'latest'

local function trim(value)
  if value == nil then
    return nil
  end
  return value:gsub('^%s+', ''):gsub('%s+$', '')
end

local function normalize_version(version)
  if version == nil then
    return DEFAULT_VERSION, 'missing'
  end

  if type(version) ~= 'string' then
    return DEFAULT_VERSION, 'not a string'
  end

  local cleaned = trim(pandoc.utils.stringify(version))
  if cleaned == nil or cleaned == '' then
    return DEFAULT_VERSION, 'empty'
  end

  if not cleaned:match('^[%w%._%-]+$') then
    return DEFAULT_VERSION, 'invalid characters'
  end

  return cleaned, nil
end

local function resolve_version(meta)
  local candidate = nil

  if meta.strudel and meta.strudel.version then
    candidate = meta.strudel.version
  end

  if meta['strudel-repl-version'] then
    candidate = meta['strudel-repl-version']
  end

  local normalized, reason = normalize_version(candidate)
  if reason and reason ~= 'missing' then
    quarto.log.warning(
      string.format(
        "Invalid Strudel REPL version '%s'; falling back to '%s' (reason: %s)",
        pandoc.utils.stringify(candidate),
        DEFAULT_VERSION,
        reason
      )
    )
  end

  return normalized
end

local function ensureHtmlDeps(version)
  quarto.doc.addHtmlDependency({
    name = 'strudel',
    version = version,
    scripts = {
      {
        path = 'strudel.js',
        attributes = {
          ['data-strudel-version'] = version,
        },
      },
    },
    stylesheets = {'strudel.css'},
  })
end

function Meta(m)
  if not quarto.doc.isFormat("html") then
    return m
  end

  local version = resolve_version(m)
  ensureHtmlDeps(version)
  return m
end
