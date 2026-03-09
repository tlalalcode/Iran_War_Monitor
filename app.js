
const $ = (id) => document.getElementById(id);

const fmtDate = (value) => {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const safe = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const badgeClass = (v) => {
  v = String(v || "").toLowerCase();
  if (v.includes("red")) return "regime-red";
  if (v.includes("yellow") || v.includes("amber")) return "regime-yellow";
  if (v.includes("green")) return "regime-green";
  return "regime-neutral";
};
const eventClass = (v) => {
  v = String(v || "").toLowerCase();
  if (v.includes("red")) return "event-red";
  if (v.includes("amber") || v.includes("yellow")) return "event-amber";
  return "event-green";
};

async function loadJson(url, fallback) {
  try {
    const res = await fetch(url + "?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    return await res.json();
  } catch {
    return fallback;
  }
}

async function main() {
  const [daily, market] = await Promise.all([
    loadJson("./data/daily-analysis.json", {}),
    loadJson("./data/market-data.json", [])
  ]);

  $("runAt").textContent = fmtDate(daily.runAt);
  $("runLabel").textContent = daily.runLabel || "Daily auto refresh";
  $("regimePill").textContent = daily.regime || "N/A";
  $("regimePill").className = "regime-pill " + badgeClass(daily.regime);
  $("taco4").textContent = daily.tacoPct4wk || "—";
  $("taco6").textContent = daily.tacoPct6wk || "—";
  $("regimeSummary").textContent = daily.regimeSummary || "No summary yet.";
  $("footerStamp").textContent = "Rendered " + new Date().toLocaleString();

  const tickerItems = (daily.headlineTicker || []).length ? daily.headlineTicker : ["Daily refresh pipeline ready"];
  $("headlineTicker").innerHTML = tickerItems.map(t => `<span style="margin-right:40px;">${safe(t)}</span>`).join("");

  $("watchItems").innerHTML = (daily.watchItems || []).map(item => `
    <div class="watch-item">
      <div class="num">${safe(item.num || "")}</div>
      <div class="headline-title">${safe(item.title || "")}</div>
      <div class="headline-meta">${safe(item.detail || "")}</div>
    </div>
  `).join("") || `<div class="watch-item">No watch items yet.</div>`;

  $("indicators").innerHTML = (daily.indicators || []).map(ind => {
    const score = Number(ind.score || 0);
    return `
      <div class="indicator">
        <div class="indicator-top">
          <div>
            <div class="indicator-name">${safe(ind.name || "")}</div>
            <div class="indicator-dir">${safe(ind.direction || "")}</div>
          </div>
          <div class="score">${safe(score)}</div>
        </div>
        <div class="bar"><div class="fill" style="width:${Math.max(0, Math.min(score * 10, 100))}%"></div></div>
        <p>${safe(ind.rationale || "")}</p>
        ${(ind.sources || []).length ? `<div class="sources">Sources: ${(ind.sources || []).map(safe).join(" · ")}</div>` : ""}
      </div>
    `;
  }).join("") || `<div class="indicator">No indicator data yet.</div>`;

  $("keyEvents").innerHTML = (daily.keyEvents || []).map(ev => `
    <div class="event-item">
      <div class="event-date">${safe(ev.date || "")}<span class="event-pill ${eventClass(ev.type)}">${safe(ev.type || "update")}</span></div>
      <div class="headline-title">${safe(ev.event || "")}</div>
    </div>
  `).join("") || `<div class="event-item">No event data yet.</div>`;

  $("topHeadlines").innerHTML = (daily.topHeadlines || []).map(h => `
    <div class="headline-item">
      <div class="headline-title">${safe(h.title || "")}</div>
      <div class="headline-meta">${safe(h.source || "Unknown source")} · ${safe(h.publishedAt || "")} ${h.sentiment ? "· " + safe(h.sentiment) : ""} ${typeof h.score === "number" ? "· score " + safe(h.score) : ""}</div>
    </div>
  `).join("") || `<div class="headline-item">No headline data yet.</div>`;

  $("marketRows").innerHTML = (market || []).map(row => {
    const chg = Number(row.changePct || 0);
    const cls = chg > 0 ? "pos" : chg < 0 ? "neg" : "neu";
    const price = row.price == null ? "—" : `${row.unit || ""}${Number(row.price).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
    const changeText = row.changePct == null ? "—" : `${chg > 0 ? "+" : ""}${chg.toFixed(2)}%`;
    return `
      <tr>
        <td>${safe(row.label || row.name || "")}</td>
        <td>${safe(row.symbol || "")}</td>
        <td>${safe(row.category || "")}</td>
        <td>${safe(price)}</td>
        <td class="${cls}">${safe(changeText)}</td>
        <td>${safe(row.bloomberg || "")}</td>
      </tr>
    `;
  }).join("");
}

main();
