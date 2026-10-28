-- The homepage's "Recent projects" list (index.qmd). index.qmd loads projects.yml with
-- metadata-files, and this filter turns its `projects` into the list, in place of the
-- empty #projects div. (A second Quarto listing would be simpler, but it joins the
-- category filter, so picking a category hid every project.)

local str = pandoc.utils.stringify
local label = { live = "live", wip = "in progress", released = "released" }
local projects = {}

local function esc(s)
  s = s:gsub("&", "&amp;"):gsub("<", "&lt;"):gsub(">", "&gt;"):gsub('"', "&quot;")
  return s
end

local function item(p)
  local href, status = esc(str(p.path)), str(p.status or "live")
  local name = label[status] or status
  local links = {}
  for _, l in ipairs(p.links or {}) do
    local to = str(l.href)
    local arrow = to:match("^https?:") and "↗" or "→"
    table.insert(links, string.format('<a href="%s">%s %s</a>', esc(to), esc(str(l.text)), arrow))
  end
  return string.format(
    '<li data-post="%s"><a class="proj-name" href="%s">%s <span class="proj-status %s" title="%s"><span class="visually-hidden">%s</span></span></a>'
      .. '<span class="proj-line">%s</span><span class="proj-links">%s</span></li>',
    href, href, esc(str(p.title)), esc(status), esc(name), esc(name), esc(str(p.description)), table.concat(links))
end

return {
  { Meta = function(m) projects = m.projects or {} end },
  { Div = function(d)
      if d.identifier ~= "projects" then return nil end
      local out = { '<ul class="proj-list">' }
      for _, p in ipairs(projects) do table.insert(out, item(p)) end
      table.insert(out, "</ul>")
      return pandoc.RawBlock("html", table.concat(out, "\n"))
    end },
}
