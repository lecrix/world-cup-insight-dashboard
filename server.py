import json
import os
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("WC_DASHBOARD_PORT", "4174"))
CACHE_TTL_SECONDS = int(os.environ.get("WC_LIVE_CACHE_SECONDS", "60"))
INTEL_CACHE_SECONDS = int(os.environ.get("WC_INTEL_CACHE_SECONDS", "300"))
WEATHER_CACHE_SECONDS = int(os.environ.get("WC_WEATHER_CACHE_SECONDS", "1800"))
ESPN_SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard"
ESPN_SUMMARY_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary"
ESPN_TEAMS_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams"
OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php"
GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"
SNAPSHOT_PATHS = [
    ROOT / "live-data-check.json",
    ROOT.parent / "live-data-check.json",
    ROOT.parent.parent / "work" / "live-data-check.json",
]
OFFICIAL_ROSTER_PATHS = [
    ROOT / "official-rosters.json",
    ROOT.parent / "official-rosters.json",
]

GROUPS = {
    "A": ["mex", "rsa", "kor", "cze"],
    "B": ["can", "bih", "qat", "sui"],
    "C": ["bra", "mar", "hai", "sco"],
    "D": ["usa", "par", "aus", "tur"],
    "E": ["civ", "ecu", "ger", "cur"],
    "F": ["ned", "jpn", "swe", "tun"],
    "G": ["irn", "nzl", "bel", "egy"],
    "H": ["ksa", "uru", "esp", "cpv"],
    "I": ["fra", "sen", "irq", "nor"],
    "J": ["arg", "alg", "aut", "jor"],
    "K": ["por", "cod", "uzb", "col"],
    "L": ["gha", "pan", "eng", "cro"],
}

PAIRINGS = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]]

TEAM_ALIASES = {
    "mexico": "mex",
    "south africa": "rsa",
    "south korea": "kor",
    "korea republic": "kor",
    "czechia": "cze",
    "czech republic": "cze",
    "canada": "can",
    "bosnia and herzegovina": "bih",
    "bosnia-herzegovina": "bih",
    "qatar": "qat",
    "switzerland": "sui",
    "brazil": "bra",
    "morocco": "mar",
    "haiti": "hai",
    "scotland": "sco",
    "united states": "usa",
    "usa": "usa",
    "paraguay": "par",
    "australia": "aus",
    "turkey": "tur",
    "türkiye": "tur",
    "ivory coast": "civ",
    "côte d'ivoire": "civ",
    "ecuador": "ecu",
    "germany": "ger",
    "curaçao": "cur",
    "curacao": "cur",
    "netherlands": "ned",
    "japan": "jpn",
    "sweden": "swe",
    "tunisia": "tun",
    "iran": "irn",
    "new zealand": "nzl",
    "belgium": "bel",
    "egypt": "egy",
    "saudi arabia": "ksa",
    "uruguay": "uru",
    "spain": "esp",
    "cape verde islands": "cpv",
    "cape verde": "cpv",
    "france": "fra",
    "senegal": "sen",
    "iraq": "irq",
    "norway": "nor",
    "argentina": "arg",
    "algeria": "alg",
    "austria": "aut",
    "jordan": "jor",
    "portugal": "por",
    "dr congo": "cod",
    "democratic republic of the congo": "cod",
    "congo dr": "cod",
    "uzbekistan": "uzb",
    "colombia": "col",
    "ghana": "gha",
    "panama": "pan",
    "england": "eng",
    "croatia": "cro",
}

MATCH_BY_PAIR = {}
for group, ids in GROUPS.items():
    for index, (home_index, away_index) in enumerate(PAIRINGS, start=1):
        home_id = ids[home_index]
        away_id = ids[away_index]
        MATCH_BY_PAIR[frozenset([home_id, away_id])] = {
            "match_id": f"g{group}{index}",
            "app_home": home_id,
            "app_away": away_id,
            "group": group,
        }

cache = {
    "expires_at": 0,
    "payload": None,
}
intel_cache = {}
weather_cache = {}

STADIUM_WEATHER = {
    "Estadio Banorte": {"name": "墨西哥城 / 阿兹特克", "lat": 19.3029, "lon": -99.1505, "altitude": 2240},
    "Estadio Akron": {"name": "瓜达拉哈拉 / 阿克伦", "lat": 20.6818, "lon": -103.4627, "altitude": 1560},
    "Estadio BBVA": {"name": "蒙特雷 / BBVA", "lat": 25.6681, "lon": -100.2444, "altitude": 540},
    "BMO Field": {"name": "多伦多 / BMO Field", "lat": 43.6332, "lon": -79.4186, "altitude": 76},
    "BC Place": {"name": "温哥华 / BC Place", "lat": 49.2768, "lon": -123.1119, "altitude": 15},
    "Lumen Field": {"name": "西雅图 / Lumen Field", "lat": 47.5952, "lon": -122.3316, "altitude": 20},
    "SoFi Stadium": {"name": "洛杉矶 / SoFi", "lat": 33.9535, "lon": -118.3392, "altitude": 38},
    "Levi's Stadium": {"name": "旧金山湾区 / Levi's", "lat": 37.4030, "lon": -121.9700, "altitude": 5},
    "MetLife Stadium": {"name": "纽约新泽西 / MetLife", "lat": 40.8135, "lon": -74.0745, "altitude": 2},
    "Gillette Stadium": {"name": "波士顿郊区 / Gillette", "lat": 42.0909, "lon": -71.2643, "altitude": 88},
    "Lincoln Financial Field": {"name": "费城 / Lincoln Financial", "lat": 39.9008, "lon": -75.1675, "altitude": 12},
    "Hard Rock Stadium": {"name": "迈阿密 / Hard Rock", "lat": 25.9580, "lon": -80.2389, "altitude": 2},
    "AT&T Stadium": {"name": "达拉斯 / AT&T", "lat": 32.7473, "lon": -97.0945, "altitude": 184},
    "NRG Stadium": {"name": "休斯顿 / NRG", "lat": 29.6847, "lon": -95.4107, "altitude": 15},
    "Mercedes-Benz Stadium": {"name": "亚特兰大 / Mercedes-Benz", "lat": 33.7554, "lon": -84.4008, "altitude": 320},
    "GEHA Field at Arrowhead Stadium": {"name": "堪萨斯城 / Arrowhead", "lat": 39.0489, "lon": -94.4839, "altitude": 265},
}

NATIONAL_TEAM_NAMES = {
    "argentina", "brazil", "england", "france", "mexico", "portugal", "south africa", "spain",
    "germany", "netherlands", "japan", "uruguay", "senegal", "morocco", "canada", "switzerland",
}

PLAYER_CURRENT_CLUB_ZH = {
    "Lionel Messi": "迈阿密国际",
    "Rodrigo De Paul": "迈阿密国际",
    "Alexis Mac Allister": "利物浦",
    "Julián Álvarez": "马德里竞技",
    "Emiliano Martínez": "阿斯顿维拉",
    "Cristian Romero": "托特纳姆热刺",
    "Lisandro Martínez": "曼彻斯特联",
    "Enzo Fernández": "切尔西",
    "Kylian Mbappe": "皇家马德里",
    "Kylian Mbappé": "皇家马德里",
    "Ousmane Dembélé": "巴黎圣日耳曼",
    "Marcus Thuram": "国际米兰",
    "Randal Kolo Muani": "尤文图斯",
    "Bradley Barcola": "巴黎圣日耳曼",
    "Jean-Philippe Mateta": "水晶宫",
    "Désiré Doué": "巴黎圣日耳曼",
    "Michael Olise": "拜仁慕尼黑",
    "Antoine Griezmann": "马德里竞技",
    "Eduardo Camavinga": "皇家马德里",
    "Aurélien Tchouaméni": "皇家马德里",
    "William Saliba": "阿森纳",
    "Ibrahima Konaté": "利物浦",
    "Mike Maignan": "AC米兰",
    "Brice Samba": "雷恩",
    "Lucas Digne": "阿斯顿维拉",
    "Lucas Hernández": "巴黎圣日耳曼",
    "Dayot Upamecano": "拜仁慕尼黑",
    "Jules Koundé": "巴塞罗那",
    "Theo Hernández": "AC米兰",
    "Maxence Lacroix": "水晶宫",
    "Neymar": "桑托斯",
    "Vinícius Júnior": "皇家马德里",
    "Vinicius Junior": "皇家马德里",
    "Rodrygo": "皇家马德里",
    "Raphinha": "巴塞罗那",
    "Richarlison": "托特纳姆热刺",
    "Matheus Cunha": "曼彻斯特联",
    "Gabriel Martinelli": "阿森纳",
    "Endrick": "皇家马德里",
    "Casemiro": "曼彻斯特联",
    "Bruno Guimarães": "纽卡斯尔联",
    "Lucas Paquetá": "西汉姆联",
    "Marquinhos": "巴黎圣日耳曼",
    "Éder Militão": "皇家马德里",
    "Alisson Becker": "利物浦",
    "Ederson": "费内巴切",
    "Harry Kane": "拜仁慕尼黑",
    "Ivan Toney": "吉达国民",
    "Ollie Watkins": "阿斯顿维拉",
    "Marcus Rashford": "巴塞罗那",
    "Anthony Gordon": "纽卡斯尔联",
    "Bukayo Saka": "阿森纳",
    "Noni Madueke": "阿森纳",
    "Jude Bellingham": "皇家马德里",
    "Declan Rice": "阿森纳",
    "Phil Foden": "曼彻斯特城",
    "Cole Palmer": "切尔西",
    "Trent Alexander-Arnold": "皇家马德里",
    "John Stones": "曼彻斯特城",
    "Kyle Walker": "伯恩利",
    "Jordan Pickford": "埃弗顿",
    "Dean Henderson": "水晶宫",
    "James Trafford": "曼彻斯特城",
    "Reece James": "切尔西",
    "Dan Burn": "纽卡斯尔联",
    "Ezri Konsa": "阿斯顿维拉",
    "Marc Guéhi": "水晶宫",
    "Djed Spence": "托特纳姆热刺",
    "Jarell Quansah": "勒沃库森",
    "Cristiano Ronaldo": "利雅得胜利",
    "Gonçalo Ramos": "巴黎圣日耳曼",
    "Pedro Neto": "切尔西",
    "Rafael Leão": "AC米兰",
    "João Félix": "利雅得胜利",
    "Bruno Fernandes": "曼彻斯特联",
    "Bernardo Silva": "曼彻斯特城",
    "Vitinha": "巴黎圣日耳曼",
    "Rúben Dias": "曼彻斯特城",
    "João Cancelo": "利雅得新月",
    "Diogo Costa": "波尔图",
}

PLAYER_OVERRIDES = {
    "fra": {
        "Brice Samba": {"nameZh": "桑巴", "clubZh": "雷恩", "number": 1},
        "Malo Gusto": {"nameZh": "古斯托", "clubZh": "切尔西", "number": 2},
        "Lucas Digne": {"nameZh": "迪涅", "clubZh": "阿斯顿维拉", "number": 3},
        "Dayot Upamecano": {"nameZh": "于帕梅卡诺", "clubZh": "拜仁慕尼黑", "number": 4},
        "Jules Koundé": {"nameZh": "孔德", "clubZh": "巴萨", "number": 5},
        "Manu Koné": {"nameZh": "科内", "clubZh": "罗马", "number": 6},
        "Ousmane Dembélé": {"nameZh": "登贝莱", "clubZh": "巴黎圣日耳曼", "number": 7},
        "Aurélien Tchouaméni": {"nameZh": "琼阿梅尼", "clubZh": "皇马", "number": 8},
        "Marcus Thuram": {"nameZh": "图拉姆", "clubZh": "国米", "number": 9},
        "Kylian Mbappé": {"nameZh": "姆巴佩", "clubZh": "皇马", "number": 10},
        "Michael Olise": {"nameZh": "奥利塞", "clubZh": "拜仁", "number": 11},
        "Bradley Barcola": {"nameZh": "巴尔科拉", "clubZh": "巴黎圣日耳曼", "number": 12},
        "N'Golo Kanté": {"nameZh": "坎特", "clubZh": "费内巴切", "number": 13},
        "Adrien Rabiot": {"nameZh": "拉比奥", "clubZh": "米兰", "number": 14},
        "Ibrahima Konaté": {"nameZh": "科纳特", "clubZh": "利物浦", "number": 15},
        "Mike Maignan": {"nameZh": "迈尼昂", "clubZh": "米兰", "number": 16},
        "William Saliba": {"nameZh": "萨利巴", "clubZh": "阿森纳", "number": 17},
        "Warren Zaïre-Emery": {"nameZh": "埃梅里", "clubZh": "巴黎圣日耳曼", "number": 18},
        "Theo Hernández": {"nameZh": "特奥", "clubZh": "利雅得新月", "number": 19},
        "Désiré Doué": {"nameZh": "杜埃", "clubZh": "巴黎圣日耳曼", "number": 20},
        "Lucas Hernández": {"nameZh": "卢卡斯", "clubZh": "巴黎圣日耳曼", "number": 21},
        "Jean-Philippe Mateta": {"nameZh": "马特塔", "clubZh": "水晶宫", "number": 22},
        "Robin Risser": {"nameZh": "里塞", "clubZh": "朗斯", "number": 23},
        "Rayan Cherki": {"nameZh": "谢尔基", "clubZh": "曼城", "number": 24},
        "Maghnes Akliouche": {"nameZh": "阿克利乌舍", "clubZh": "摩纳哥", "number": 25},
        "Maxence Lacroix": {"nameZh": "拉克鲁瓦", "clubZh": "水晶宫", "number": 26},
    }
}


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/live-data":
            self.send_json(live_data())
            return
        if path == "/api/match-intel":
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            self.send_json(match_intel((query.get("matchId") or [""])[0]))
            return
        if path == "/api/team-roster":
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            self.send_json(team_roster((query.get("team") or [""])[0]))
            return
        if path == "/api/health":
            self.send_json({"ok": True, "service": "world-cup-dashboard"})
            return
        super().do_GET()

    def send_json(self, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def live_data():
    now = time.time()
    if cache["payload"] and cache["expires_at"] > now:
        return cache["payload"]

    payload = fetch_odds_api()
    attach_weather_forecasts(payload)
    cache["payload"] = payload
    cache["expires_at"] = now + CACHE_TTL_SECONDS
    return payload


def cached_intel(key, fetcher):
    now = time.time()
    item = intel_cache.get(key)
    if item and item["expires_at"] > now:
        return item["payload"]
    payload = fetcher()
    intel_cache[key] = {"expires_at": now + INTEL_CACHE_SECONDS, "payload": payload}
    return payload


def match_intel(match_id):
    if not match_id:
        return {"status": "error", "message": "缺少 matchId"}

    def fetcher():
        live = live_data()
        event = next((item for item in live.get("events", []) if item.get("matchId") == match_id), None)
        if not event or not event.get("sourceEventId"):
            return {"status": "unavailable", "matchId": match_id, "message": "当前比赛尚未映射到 ESPN summary 事件。"}
        try:
            url = f"{ESPN_SUMMARY_URL}?{urllib.parse.urlencode({'event': event['sourceEventId']})}"
            summary = fetch_json(url)
        except Exception as exc:
            return {"status": "error", "matchId": match_id, "message": f"ESPN summary 拉取失败：{exc}"}
        return parse_match_summary(match_id, event, summary)

    return cached_intel(f"match:{match_id}", fetcher)


def team_roster(app_team_id):
    if not app_team_id:
        return {"status": "error", "message": "缺少 team"}

    def fetcher():
        official = official_team_roster(app_team_id)
        if official:
            return official

        directory = team_directory()
        item = directory.get(app_team_id)
        if not item:
            return {"status": "unavailable", "team": app_team_id, "message": "ESPN 球队目录未找到该队。"}
        try:
            url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/{item['espnId']}/roster"
            data = fetch_json(url)
        except Exception as exc:
            return {"status": "error", "team": app_team_id, "message": f"ESPN roster 拉取失败：{exc}"}
        return parse_roster_payload(app_team_id, item, data)

    return cached_intel(f"roster:{app_team_id}", fetcher)


def official_rosters():
    def fetcher():
        for path in OFFICIAL_ROSTER_PATHS:
            if path.exists():
                return json.loads(path.read_text(encoding="utf-8"))
        return {}

    return cached_intel("official-rosters", fetcher)


def official_team_roster(app_team_id):
    item = official_rosters().get(app_team_id)
    if not item or not item.get("athletes"):
        return None
    athletes = []
    for index, athlete in enumerate(item.get("athletes") or [], start=1):
        athletes.append({
            "id": athlete.get("id") or f"official-{app_team_id}-{index}",
            "name": athlete.get("nameZh"),
            "nameZh": athlete.get("nameZh"),
            "number": athlete.get("number") or "",
            "age": athlete.get("age") or "",
            "position": athlete.get("position"),
            "positionGroup": athlete.get("positionGroup"),
            "positionAbbr": None,
            "headshot": athlete.get("headshot") or "",
            "club": athlete.get("clubZh") or "",
            "clubZh": athlete.get("clubZh") or "",
            "status": athlete.get("status") if athlete.get("status") not in (None, "", "??") else "可用",
            "statusType": "active",
            "injuries": athlete.get("injuries") or [],
            "profile": None,
        })
    return {
        "status": "live",
        "provider": item.get("provider") or "official roster",
        "team": app_team_id,
        "sourceUrl": item.get("sourceUrl"),
        "sourceTitle": item.get("sourceTitle"),
        "lastUpdated": current_iso(),
        "athletes": athletes,
        "injuryCount": 0,
        "message": f"已载入 {len(athletes)} 名中文大名单球员。",
    }


def team_directory():
    def fetcher():
        data = fetch_json(ESPN_TEAMS_URL)
        directory = {}
        leagues = data.get("sports", [{}])[0].get("leagues", [])
        for league in leagues:
            for wrapper in league.get("teams", []):
                team = wrapper.get("team") or {}
                app_id = team_id(team.get("displayName"))
                if not app_id:
                    continue
                directory[app_id] = {
                    "appId": app_id,
                    "espnId": team.get("id"),
                    "displayName": team.get("displayName"),
                    "abbreviation": team.get("abbreviation"),
                    "logo": ((team.get("logos") or [{}])[0]).get("href") or team.get("logo"),
                }
        return directory

    return cached_intel("team-directory", fetcher)


def parse_match_summary(match_id, event, summary):
    forms = {}
    for block in ((summary.get("boxscore") or {}).get("form") or []):
        app_id = team_id((block.get("team") or {}).get("displayName"))
        if not app_id:
            continue
        forms[app_id] = [parse_form_event(item) for item in (block.get("events") or [])[:6]]

    h2h = []
    for block in summary.get("headToHeadGames") or []:
        for item in block.get("events") or []:
            h2h.append(parse_form_event(item))

    h2h_summary = summarize_results(h2h)
    return {
        "status": "live",
        "provider": "ESPN summary",
        "matchId": match_id,
        "sourceEventId": event.get("sourceEventId"),
        "lastUpdated": current_iso(),
        "forms": forms,
        "headToHead": h2h[:8],
        "headToHeadSummary": h2h_summary,
        "message": "已自动同步 ESPN summary：近期战绩和历史交手；球队名单由 /api/team-roster 按球队单独同步。",
    }


def parse_form_event(item):
    return {
        "id": item.get("id"),
        "date": item.get("gameDate"),
        "score": item.get("score"),
        "result": item.get("gameResult"),
        "competition": item.get("competitionName") or item.get("leagueName"),
        "round": item.get("roundName"),
        "opponent": (item.get("opponent") or {}).get("displayName"),
        "homeScore": item.get("homeTeamScore"),
        "awayScore": item.get("awayTeamScore"),
    }


def summarize_results(events):
    summary = {"wins": 0, "draws": 0, "losses": 0, "games": len(events)}
    for item in events:
        result = item.get("result")
        if result == "W":
            summary["wins"] += 1
        elif result == "D":
            summary["draws"] += 1
        elif result == "L":
            summary["losses"] += 1
    return summary


def parse_roster_payload(app_team_id, team_item, data):
    club_refs = []
    for athlete in data.get("athletes", [])[:60]:
        ref = (athlete.get("defaultTeam") or {}).get("$ref")
        if ref:
            club_refs.append(ref)
    club_map = hydrate_clubs(club_refs)

    raw_athletes = data.get("athletes", [])[:60]
    zh_map = hydrate_player_zh(raw_athletes, club_map)

    athletes = []
    for athlete in raw_athletes:
        ref = (athlete.get("defaultTeam") or {}).get("$ref")
        club = club_map.get(ref)
        name = athlete.get("displayName") or athlete.get("fullName")
        zh = zh_map.get(name or "", {})
        override = (PLAYER_OVERRIDES.get(app_team_id) or {}).get(name or "", {})
        athletes.append({
            "id": athlete.get("id"),
            "name": name,
            "nameZh": override.get("nameZh") or zh.get("nameZh"),
            "number": override.get("number"),
            "age": athlete.get("age"),
            "position": (athlete.get("position") or {}).get("displayName"),
            "positionAbbr": (athlete.get("position") or {}).get("abbreviation"),
            "headshot": (athlete.get("headshot") or {}).get("href"),
            "club": club,
            "clubZh": override.get("clubZh") or zh.get("clubZh"),
            "status": (athlete.get("status") or {}).get("name"),
            "statusType": (athlete.get("status") or {}).get("type"),
            "injuries": [injury.get("shortComment") or injury.get("details") or injury.get("type") for injury in athlete.get("injuries", [])],
            "profile": next((link.get("href") for link in athlete.get("links", []) if "playercard" in (link.get("rel") or [])), None),
        })
    injury_count = sum(1 for athlete in athletes if athlete.get("injuries") or athlete.get("statusType") not in (None, "active"))
    return {
        "status": "live",
        "provider": "ESPN roster",
        "team": app_team_id,
        "espnId": team_item.get("espnId"),
        "name": team_item.get("displayName"),
        "logo": team_item.get("logo"),
        "lastUpdated": current_iso(),
        "athletes": athletes,
        "injuryCount": injury_count,
        "message": f"已同步 {len(athletes)} 名球员，伤病/status 异常 {injury_count} 项。",
    }


def hydrate_clubs(refs):
    unique_refs = list(dict.fromkeys(refs))
    result = {}
    if not unique_refs:
        return result
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(resolve_team_ref, ref): ref for ref in unique_refs}
        for future in as_completed(future_map):
            ref = future_map[future]
            try:
                result[ref] = future.result()
            except Exception:
                result[ref] = None
    return result


def resolve_team_ref(ref):
    if not ref:
        return None


def hydrate_player_zh(athletes, club_map=None):
    club_map = club_map or {}
    player_clubs = {}
    for athlete in athletes:
        name = athlete.get("displayName") or athlete.get("fullName")
        if name:
            ref = (athlete.get("defaultTeam") or {}).get("$ref")
            player_clubs[name] = club_map.get(ref)
    names = list(player_clubs.keys())
    result = {}
    if not names:
        return result
    with ThreadPoolExecutor(max_workers=6) as executor:
        future_map = {executor.submit(resolve_player_zh, name, player_clubs.get(name)): name for name in names}
        for future in as_completed(future_map):
            name = future_map[future]
            try:
                result[name] = future.result()
            except Exception:
                result[name] = {}
    return result


def resolve_player_zh(name, club=None):
    def fetcher():
        club_zh = PLAYER_CURRENT_CLUB_ZH.get(name)
        if not club_zh and club and not is_national_team_label(club):
            club_zh = translate_to_zh(club)
        return {
            "nameZh": translate_to_zh(name),
            "clubZh": club_zh,
        }

    return cached_intel(f"translate-player:{name}:{club or ''}", fetcher)


def translate_to_zh(text):
    if not text:
        return None
    query = urllib.parse.urlencode({
        "client": "gtx",
        "sl": "en",
        "tl": "zh-CN",
        "dt": "t",
        "q": text,
    })
    try:
        data = cached_intel(f"translate:{text}", lambda: fetch_json(f"{GOOGLE_TRANSLATE_URL}?{query}", timeout=8, retries=2))
        pieces = data[0] if data and isinstance(data, list) else []
        translated = "".join(piece[0] for piece in pieces if piece and piece[0])
        return translated or None
    except Exception:
        return None


def wikidata_entity(entity_id):
    query = urllib.parse.urlencode({
        "action": "wbgetentities",
        "format": "json",
        "ids": entity_id,
        "props": "labels|claims",
        "languages": "zh|zh-cn|zh-hans|en",
    })
    data = fetch_json(f"{WIKIDATA_API_URL}?{query}", timeout=8)
    return (data.get("entities") or {}).get(entity_id, {})


def wikidata_labels(entity_ids):
    entity_ids = [item for item in dict.fromkeys(entity_ids) if item]
    if not entity_ids:
        return {}
    query = urllib.parse.urlencode({
        "action": "wbgetentities",
        "format": "json",
        "ids": "|".join(entity_ids),
        "props": "labels",
        "languages": "zh|zh-cn|zh-hans|en",
    })
    data = fetch_json(f"{WIKIDATA_API_URL}?{query}", timeout=8)
    labels = {}
    for entity_id, entity in (data.get("entities") or {}).items():
        label_block = entity.get("labels") or {}
        label = (
            (label_block.get("zh-cn") or {}).get("value")
            or (label_block.get("zh-hans") or {}).get("value")
            or (label_block.get("zh") or {}).get("value")
            or (label_block.get("en") or {}).get("value")
        )
        if label:
            labels[entity_id] = label
    return labels


def current_club_from_entity(entity):
    claims = (entity.get("claims") or {}).get("P54") or []
    current_ids = []
    historical_ids = []
    for claim in claims:
        value = (((claim.get("mainsnak") or {}).get("datavalue") or {}).get("value") or {})
        team_id = value.get("id")
        if not team_id:
            continue
        qualifiers = claim.get("qualifiers") or {}
        if "P582" in qualifiers:
            historical_ids.append(team_id)
        else:
            current_ids.append(team_id)
    labels = wikidata_labels(current_ids or historical_ids[:4])
    for entity_id in current_ids:
        label = labels.get(entity_id)
        if label and not is_national_team_label(label):
            return label
    for entity_id in current_ids:
        label = labels.get(entity_id)
        if label:
            return label
    return None


def is_national_team_label(label):
    lowered = label.lower()
    return lowered in NATIONAL_TEAM_NAMES or "国家" in label or "國家" in label or "national" in lowered or "u-" in lowered
    public_ref = ref.replace("http://sports.core.api.espn.pvt", "https://sports.core.api.espn.com")
    try:
        data = cached_intel(f"club:{public_ref}", lambda: fetch_json(public_ref, timeout=6))
        return data.get("displayName") or data.get("shortDisplayName")
    except Exception:
        return None


def fetch_odds_api():
    espn_payload = fetch_espn_public()
    if espn_payload["status"] == "error":
        snapshot = load_success_snapshot()
        if snapshot:
            snapshot["status"] = "cached"
            snapshot["lastUpdated"] = current_iso()
            snapshot["nextRefreshSeconds"] = CACHE_TTL_SECONDS
            snapshot["message"] = f"{snapshot.get('message', '已加载本地成功快照')} 当前 ESPN 拉取失败，暂用最近一次成功缓存。"
            return snapshot

    if espn_payload["odds"] or espn_payload["events"] or not os.environ.get("ODDS_API_KEY"):
        return espn_payload

    api_key = os.environ.get("THE_ODDS_API_KEY") or os.environ.get("ODDS_API_KEY")
    sport_key = os.environ.get("WC_ODDS_SPORT_KEY", "soccer_fifa_world_cup")
    regions = os.environ.get("WC_ODDS_REGIONS", "eu,us")
    markets = os.environ.get("WC_ODDS_MARKETS", "h2h")

    base_payload = {
        "provider": "The Odds API",
        "status": "unconfigured",
        "lastUpdated": current_iso(),
        "nextRefreshSeconds": CACHE_TTL_SECONDS,
        "odds": {},
        "events": [],
        "message": "未检测到 ODDS_API_KEY/THE_ODDS_API_KEY；当前页面使用模型基线赔率。配置 API key 后，后端会自动采集并缓存真实赔率。",
    }

    if not api_key:
        return base_payload

    query = urllib.parse.urlencode(
        {
            "apiKey": api_key,
            "regions": regions,
            "markets": markets,
            "oddsFormat": "decimal",
            "dateFormat": "iso",
        }
    )
    url = f"https://api.the-odds-api.com/v4/sports/{sport_key}/odds/?{query}"

    try:
        with urllib.request.urlopen(url, timeout=15) as response:
            raw_events = json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        return {
            **base_payload,
            "status": "error",
            "message": f"赔率 API 拉取失败：{exc}",
        }

    events = []
    for event in raw_events:
        h2h = first_h2h_market(event)
        events.append(
            {
                "id": event.get("id"),
                "homeTeam": event.get("home_team"),
                "awayTeam": event.get("away_team"),
                "commenceTime": event.get("commence_time"),
                "bookmakers": len(event.get("bookmakers", [])),
                "h2h": h2h,
            }
        )

    return {
        "provider": "The Odds API",
        "status": "live",
        "lastUpdated": current_iso(),
        "nextRefreshSeconds": CACHE_TTL_SECONDS,
        "odds": {},
        "events": events,
        "message": f"已自动拉取 {len(events)} 场赔率事件。若未映射到看板赛程，请在后端增加球队英文名映射。",
    }


def fetch_espn_public():
    events = []
    odds = {}
    source_count = 0
    errors = []

    query = urllib.parse.urlencode({"dates": "20260611-20260627", "limit": 200})
    url = f"{ESPN_SCOREBOARD_URL}?{query}"
    try:
        data = fetch_json(url)
    except Exception as exc:
        errors.append(str(exc))
        data = {"events": []}

    for event in data.get("events", []):
        mapped = map_espn_event(event)
        if not mapped:
            continue
        events.append(mapped["event"])
        if mapped.get("odds"):
            odds[mapped["match_id"]] = mapped["odds"]
            source_count += 1

    status = "live" if source_count else "cached"
    message = (
        f"ESPN 公共数据源已同步 {len(events)} 场赛程，其中 {source_count} 场带 DraftKings 赔率。"
        if events
        else "ESPN 公共数据源当前未返回世界杯小组赛事件，页面暂用模型基线赔率。"
    )
    if errors and not events:
        status = "error"
        message = f"ESPN 公共数据源拉取失败：{'; '.join(errors[:3])}"

    payload = {
        "provider": "ESPN / DraftKings",
        "status": status,
        "lastUpdated": current_iso(),
        "nextRefreshSeconds": CACHE_TTL_SECONDS,
        "odds": odds,
        "events": events,
        "message": message,
    }
    attach_weather_forecasts(payload)
    return payload


def attach_weather_forecasts(payload):
    for event in payload.get("events", []):
        event["weatherForecast"] = weather_forecast_for_event(event)


def weather_forecast_for_event(event):
    kickoff = parse_iso_datetime(event.get("commenceTime"))
    stadium = STADIUM_WEATHER.get(event.get("venue"))
    if not kickoff or not stadium:
        return {"status": "unavailable", "mode": "baseline", "message": "球场或开球时间未映射，使用气候基线。"}

    seconds_to_kickoff = (kickoff - datetime.now(timezone.utc)).total_seconds()
    if seconds_to_kickoff > 72 * 3600:
        return {
            "status": "not_due",
            "mode": "baseline",
            "source": "历史气候基线",
            "message": "尚未进入赛前 72 小时窗口，暂用球场城市气候基线。",
        }
    if seconds_to_kickoff < -6 * 3600:
        return {"status": "elapsed", "mode": "result", "message": "比赛已结束，天气预报不再刷新。"}

    cache_key = f"{event.get('venue')}:{kickoff.strftime('%Y%m%d%H')}"
    now = time.time()
    item = weather_cache.get(cache_key)
    if item and item["expires_at"] > now:
        return item["payload"]

    try:
        payload = fetch_open_meteo_forecast(stadium, kickoff)
    except Exception as exc:
        payload = {"status": "error", "mode": "baseline", "source": "Open-Meteo", "message": f"赛前天气拉取失败：{exc}"}
    weather_cache[cache_key] = {"expires_at": now + WEATHER_CACHE_SECONDS, "payload": payload}
    return payload


def fetch_open_meteo_forecast(stadium, kickoff):
    query = urllib.parse.urlencode({
        "latitude": stadium["lat"],
        "longitude": stadium["lon"],
        "hourly": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m",
        "forecast_days": 7,
        "timezone": "UTC",
    })
    data = fetch_json(f"{OPEN_METEO_FORECAST_URL}?{query}", timeout=10, retries=2)
    hourly = data.get("hourly") or {}
    times = hourly.get("time") or []
    if not times:
        return {"status": "unavailable", "mode": "baseline", "source": "Open-Meteo", "message": "天气源未返回小时级预报。"}

    target = kickoff.replace(minute=0, second=0, microsecond=0)
    nearest_index = min(
        range(len(times)),
        key=lambda index: abs((parse_iso_datetime(times[index]) - target).total_seconds()) if parse_iso_datetime(times[index]) else 10**9,
    )
    forecast_time = parse_iso_datetime(times[nearest_index])
    if not forecast_time or abs((forecast_time - target).total_seconds()) > 90 * 60:
        return {"status": "unavailable", "mode": "baseline", "source": "Open-Meteo", "message": "72 小时窗口内暂未匹配到开球小时预报。"}

    def hourly_value(key):
        values = hourly.get(key) or []
        return values[nearest_index] if nearest_index < len(values) else None

    return {
        "status": "live",
        "mode": "forecast72h",
        "source": "Open-Meteo",
        "updatedAt": current_iso(),
        "forecastTime": forecast_time.isoformat().replace("+00:00", "Z"),
        "stadium": stadium["name"],
        "temperature": hourly_value("temperature_2m"),
        "humidity": hourly_value("relative_humidity_2m"),
        "apparentTemperature": hourly_value("apparent_temperature"),
        "precipitationProbability": hourly_value("precipitation_probability"),
        "windSpeed": hourly_value("wind_speed_10m"),
        "message": "已进入赛前 72 小时窗口，使用 Open-Meteo 小时级预报覆盖气候基线。",
    }


def parse_iso_datetime(value):
    if not value:
        return None
    try:
        normalized = value.replace("Z", "+00:00")
        if "T" in normalized and "+" not in normalized[10:] and "-" not in normalized[10:]:
            normalized = f"{normalized}+00:00"
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def load_success_snapshot():
    for path in SNAPSHOT_PATHS:
        try:
            if not path.exists():
                continue
            with path.open("r", encoding="utf-8") as file:
                payload = json.load(file)
        except Exception:
            continue
        if payload.get("odds") or payload.get("events"):
            return payload
    return None


def fetch_json(url, timeout=20, retries=3):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json,text/plain,*/*",
        },
    )
    last_error = None
    for _ in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            last_error = exc
            time.sleep(0.5)
    raise last_error


def map_espn_event(event):
    competitions = event.get("competitions") or []
    if not competitions:
        return None
    competition = competitions[0]
    competitors = competition.get("competitors") or []
    home = next((item for item in competitors if item.get("homeAway") == "home"), None)
    away = next((item for item in competitors if item.get("homeAway") == "away"), None)
    if not home or not away:
        return None

    home_id = team_id(home.get("team", {}).get("displayName"))
    away_id = team_id(away.get("team", {}).get("displayName"))
    if not home_id or not away_id:
        return None

    pair = MATCH_BY_PAIR.get(frozenset([home_id, away_id]))
    if not pair:
        return None

    venue = competition.get("venue") or event.get("venue") or {}
    status = event.get("status") or {}
    status_type = status.get("type") or {}
    event_payload = {
        "matchId": pair["match_id"],
        "homeTeam": home.get("team", {}).get("displayName"),
        "awayTeam": away.get("team", {}).get("displayName"),
        "homeScore": parse_score(home.get("score")),
        "awayScore": parse_score(away.get("score")),
        "completed": bool(status_type.get("completed")),
        "status": status_type.get("state"),
        "statusName": status_type.get("name"),
        "statusDescription": status_type.get("description"),
        "statusDetail": status_type.get("detail") or status_type.get("shortDetail"),
        "commenceTime": event.get("date"),
        "venue": venue.get("fullName"),
        "city": (venue.get("address") or {}).get("city"),
        "country": (venue.get("address") or {}).get("country"),
        "broadcasts": broadcast_names(competition.get("broadcasts") or []),
        "sourceEventId": event.get("id"),
    }

    odds_payload = map_espn_odds(event, pair, home_id, away_id)
    return {
        "match_id": pair["match_id"],
        "event": event_payload,
        "odds": odds_payload,
    }


def parse_score(value):
    if value in (None, ""):
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        try:
            return float(value)
        except (TypeError, ValueError):
            return value


def team_id(display_name):
    if not display_name:
        return None
    return TEAM_ALIASES.get(display_name.strip().lower())


def broadcast_names(items):
    names = []
    for item in items:
        names.extend(item.get("names") or [])
    return list(dict.fromkeys(names))


def map_espn_odds(event, pair, espn_home_id, espn_away_id):
    competition = (event.get("competitions") or [{}])[0]
    odds_items = competition.get("odds") or []
    if not odds_items:
        return None
    item = odds_items[0]
    moneyline = item.get("moneyline") or {}
    h2h_by_espn_side = [
        american_to_decimal((moneyline.get("home") or {}).get("close", {}).get("odds") or (moneyline.get("home") or {}).get("open", {}).get("odds")),
        american_to_decimal((moneyline.get("draw") or {}).get("close", {}).get("odds") or (moneyline.get("draw") or {}).get("open", {}).get("odds")),
        american_to_decimal((moneyline.get("away") or {}).get("close", {}).get("odds") or (moneyline.get("away") or {}).get("open", {}).get("odds")),
    ]
    if any(value is None for value in h2h_by_espn_side):
        return None

    if pair["app_home"] == espn_home_id:
        h2h = h2h_by_espn_side
    else:
        h2h = [h2h_by_espn_side[2], h2h_by_espn_side[1], h2h_by_espn_side[0]]

    total = item.get("total") or {}
    over = (total.get("over") or {}).get("close") or (total.get("over") or {}).get("open") or {}
    under = (total.get("under") or {}).get("close") or (total.get("under") or {}).get("open") or {}

    return {
        "h2h": h2h,
        "source": f"ESPN / {((item.get('provider') or {}).get('displayName') or (item.get('provider') or {}).get('name') or 'Sportsbook')}",
        "lastUpdated": current_iso(),
        "details": item.get("details"),
        "overUnder": item.get("overUnder"),
        "total": {
            "over": {"line": over.get("line"), "odds": over.get("odds")},
            "under": {"line": under.get("line"), "odds": under.get("odds")},
        },
        "schedule": {
            "commenceTime": event.get("date"),
        },
    }


def american_to_decimal(value):
    if value is None:
        return None
    if isinstance(value, str):
        value = value.replace("−", "-").replace("+", "").strip()
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number > 0:
        return round(1 + number / 100, 2)
    return round(1 + 100 / abs(number), 2)


def first_h2h_market(event):
    for bookmaker in event.get("bookmakers", []):
        for market in bookmaker.get("markets", []):
            if market.get("key") != "h2h":
                continue
            outcomes = market.get("outcomes", [])
            return {
                outcome.get("name"): outcome.get("price")
                for outcome in outcomes
                if outcome.get("name") and outcome.get("price")
            }
    return None


def current_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), DashboardHandler)
    print(f"World Cup dashboard running at http://127.0.0.1:{PORT}")
    server.serve_forever()
