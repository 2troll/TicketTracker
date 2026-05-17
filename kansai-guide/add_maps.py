#!/usr/bin/env python3
import json

BASE = '/home/user/TicketTracker/kansai-guide/'
DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

CITIES = [
    dict(
        file='osaka.html', dark=True, tile=DARK, col='#e53030',
        lat=34.665, lng=135.503, zoom=14,
        title='The <span class="acc">Osaka circuit</span>',
        stops=[
            dict(ll=[34.6662,135.5009],n='Namba',k='難波駅',t='9:00 AM · Start',d='Meeting point for your Osaka day'),
            dict(ll=[34.6687,135.5065],n='Kuromon Market',k='黒門市場',t='9:20 AM · 10 min walk',d="Osaka's kitchen — fresh fish &amp; street food"),
            dict(ll=[34.6686,135.5021],n='Dotonbori',k='道頓堀',t='10:45 AM · 12 min walk',d='The canal district, Glico Man, real Osaka energy'),
            dict(ll=[34.6525,135.5062],n='Shinsekai',k='新世界',t='12:30 PM · 20 min south',d='Retro 1950s neighbourhood, kushikatsu, Tsutenkaku Tower'),
            dict(ll=[34.6614,135.4980],n='Standing Sake Bar',k='立ち飲み',t='4:00 PM · Finish',d='40 sake labels, the perfect close to the day'),
        ]
    ),
    dict(
        file='kobe.html', dark=True, tile=DARK, col='#1a6bba',
        lat=34.691, lng=135.188, zoom=13,
        title='The <span class="acc">Kobe circuit</span>',
        stops=[
            dict(ll=[34.6941,135.1961],n='Sannomiya',k='三宮駅',t='10:00 AM · Start',d="Kobe's central hub — start here"),
            dict(ll=[34.6984,135.1892],n='Kitano Ijinkan',k='北野異人館',t='10:20 AM · 15 min walk',d='19th-century foreigner residences, Western architecture'),
            dict(ll=[34.6874,135.1853],n='Wagyu Lunch',k='神戸牛',t='12:00 PM · 10 min walk',d='Kobe beef at a local restaurant, not a tourist trap'),
            dict(ll=[34.7121,135.2102],n='Nada Sake Brewery',k='灘の酒',t='2:00 PM · bus 20 min',d="Japan's most famous sake district, free tastings"),
            dict(ll=[34.6853,135.1826],n='Meriken Park',k='メリケンパーク',t='4:00 PM · Finish',d='The harbour at golden hour, Port Tower in red steel'),
        ]
    ),
    dict(
        file='nara.html', dark=True, tile=DARK, col='#2a9d5c',
        lat=34.686, lng=135.840, zoom=14,
        title='The <span class="acc">Nara circuit</span>',
        stops=[
            dict(ll=[34.6866,135.8295],n='Nara Station',k='奈良駅',t='9:00 AM · Start',d='Arrive by JR or Kintetsu from Osaka or Kyoto'),
            dict(ll=[34.6888,135.8398],n='Todai-ji Temple',k='東大寺',t='9:30 AM · 10 min walk',d="World's largest wooden building, Great Buddha inside"),
            dict(ll=[34.6842,135.8395],n='Nara Deer Park',k='奈良公園',t='11:00 AM · 5 min walk',d='1,200 sacred deer roam free — they bow for crackers'),
            dict(ll=[34.6815,135.8481],n='Kasuga Grand Shrine',k='春日大社',t='1:00 PM · 15 min walk',d='3,000 stone lanterns line the forest path to the shrine'),
            dict(ll=[34.6863,135.8371],n='Isuien Garden',k='依水園',t='3:00 PM · 10 min walk',d='Meiji-era garden with Todai-ji as borrowed scenery'),
        ]
    ),
    dict(
        file='koyasan.html', dark=True, tile=DARK, col='#8b3fbf',
        lat=34.2135, lng=135.585, zoom=15,
        title='Osaka to the <span class="acc">sacred mountain</span>',
        stops=[
            dict(ll=[34.2130,135.5851],n='Danjogaran',k='壇上伽藍',t='11:30 AM · After cable car',d='The sacred precinct Kobo Daishi founded in 819'),
            dict(ll=[34.2128,135.5814],n='Kongobu-ji Temple',k='金剛峯寺',t='12:00 PM · 5 min walk',d='Head temple of Shingon Buddhism, stone rock garden'),
            dict(ll=[34.2153,135.5945],n='Ichinohashi Gate',k='一の橋',t='3:00 PM · 20 min walk',d='The entrance gate to Okunoin — cross into another world'),
            dict(ll=[34.2148,135.5961],n='Okunoin Cemetery',k='奥院',t='3:30 PM · 10 min walk',d='200,000 moss-covered stone lanterns under cedar giants'),
            dict(ll=[34.2155,135.5975],n='Torodo Lantern Hall',k='燈籠堂',t='4:00 PM · Finish',d='10,000 lanterns burning continuously since the 11th century'),
        ]
    ),
    dict(
        file='kyoto.html', dark=False, tile=LIGHT, col='#A8281A',
        lat=34.985, lng=135.770, zoom=13,
        title='The <span class="acc">Kyoto arc</span>',
        stops=[
            dict(ll=[34.9858,135.7588],n='Kyoto Station',k='京都駅',t='8:30 AM · Start',d='JR gateway to the old capital'),
            dict(ll=[34.9671,135.7727],n='Fushimi Inari',k='伏見稲荷',t='9:00 AM · JR 5 min',d='10,000 vermilion torii before the crowds arrive'),
            dict(ll=[35.0226,135.7930],n="Philosopher's Path",k='哲学の道',t='11:00 AM · bus 30 min',d='2km canal walk lined with cherry trees &amp; hidden temples'),
            dict(ll=[35.0036,135.7756],n='Gion and Tea Ceremony',k='祇園',t='2:30 PM · walk 20 min',d='Machiya streets, geiko district, private tea ceremony'),
            dict(ll=[35.0044,135.7698],n='Nishiki Market',k='錦市場',t='5:00 PM · walk 10 min',d="Kyoto's kitchen — pickles, tofu, seasonal delicacies"),
            dict(ll=[35.0059,135.7684],n='Riverside Dinner',k='鴨川',t='8:00 PM · Finish',d='Dinner on wooden platforms above the Kamo river'),
        ]
    ),
]

LEAFLET_CSS = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>'


def make_section(title, dark):
    border = 'rgba(255,255,255,.06)' if dark else 'rgba(44,35,32,.08)'
    return '\n'.join([
        '<section class="dest-map">',
        '  <div class="wrap">',
        '    <div class="sec-head">',
        '      <span class="sec-label">Route Map</span>',
        '      <h2 class="sec-h2">' + title + '</h2>',
        '    </div>',
        '  </div>',
        '  <div id="route-map" style="height:480px;width:100%;margin-top:2rem;border-top:1px solid ' + border + '"></div>',
        '</section>',
    ])


def make_js(cfg):
    stops_json = json.dumps(cfg['stops'], ensure_ascii=False)
    nc = '#fff' if cfg['dark'] else '#2C2320'
    kc = 'rgba(255,255,255,.38)' if cfg['dark'] else 'rgba(44,35,32,.38)'
    dc = 'rgba(255,255,255,.62)' if cfg['dark'] else 'rgba(44,35,32,.62)'

    js = []
    js.append('<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>')
    js.append('<script>')
    js.append('(function(){')
    js.append('  var m=L.map("route-map",{scrollWheelZoom:false}).setView([' + str(cfg['lat']) + ',' + str(cfg['lng']) + '],' + str(cfg['zoom']) + ');')
    js.append('  L.tileLayer("' + cfg['tile'] + '",{attribution:"© <a href=\'https://carto.com/attributions\'>CARTO</a>",maxZoom:19}).addTo(m);')
    js.append('  var stops=' + stops_json + ';')
    js.append('  var col="' + cfg['col'] + '",nc="' + nc + '",kc="' + kc + '",dc="' + dc + '";')
    js.append('  var pts=[];')
    js.append('  stops.forEach(function(s,i){')
    # divIcon: the html string uses single quotes as outer delimiter, double quotes for style attrs
    js.append(
        "    var ic=L.divIcon({className:\"\",html:'<div style=\"width:36px;height:36px;border-radius:50%;"
        "background:'+col+';border:3px solid rgba(255,255,255,.9);display:flex;align-items:center;"
        "justify-content:center;color:#fff;font-weight:700;font-size:14px;"
        "box-shadow:0 2px 10px rgba(0,0,0,.5)\">'+(i+1)+'</div>',"
        "iconSize:[36,36],iconAnchor:[18,18],popupAnchor:[0,-20]});"
    )
    # bindPopup: outer single-quoted JS string, double-quoted style attrs
    js.append(
        "    L.marker(s.ll,{icon:ic}).addTo(m)"
        ".bindPopup('<b style=\"color:'+nc+';font-size:.9rem\">'+s.n+'</b>"
        " <span style=\"color:'+kc+';font-size:.7rem\">'+s.k+'</span>"
        "<br><span style=\"color:'+col+';font-size:.72rem;font-weight:600\">'+s.t+'</span>"
        "<br><span style=\"color:'+dc+';font-size:.78rem;line-height:1.5\">'+s.d+'</span>',"
        "{maxWidth:260});"
    )
    js.append('    pts.push(s.ll);')
    js.append('  });')
    js.append('  L.polyline(pts,{color:col,weight:2,opacity:.5,dashArray:"7,9"}).addTo(m);')
    js.append('})();')
    js.append('</script>')
    return '\n'.join(js)


def replace_section(html, new_section):
    marker = '<section class="dest-map">'
    idx = html.find(marker)
    if idx == -1:
        return html, False
    before = html[:idx]
    start = idx
    for comment in ['<!-- ROUTE FLOW MAP -->', '<!-- MAP -->']:
        ci = before.rfind(comment)
        if ci != -1 and (idx - ci) < 200:
            start = ci
            break
    end = html.find('</section>', idx) + len('</section>')
    return html[:start] + new_section + '\n' + html[end:], True


for cfg in CITIES:
    path = BASE + cfg['file']
    with open(path, encoding='utf-8') as f:
        html = f.read()

    if 'leaflet.css' not in html:
        html = html.replace('</head>', LEAFLET_CSS + '\n</head>', 1)

    html, ok = replace_section(html, make_section(cfg['title'], cfg['dark']))
    if not ok:
        print('WARNING: no dest-map section in', cfg['file'])

    if 'leaflet.js' not in html:
        html = html.replace('</body>', make_js(cfg) + '\n</body>', 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('✓', cfg['file'])

print('All done!')
