def resolve_static_root(root, configured_static_dir):
    return configured_static_dir if configured_static_dir.exists() else root


def enrich_payload(payload):
    payload.setdefault("warnings", [])
    payload["sourceStatus"] = [
        {
            "id": "schedule",
            "label": "赛程/赛果",
            "status": payload.get("status") if payload.get("events") else "estimated",
            "detail": f"{len(payload.get('events') or [])} 场已映射" if payload.get("events") else "使用本地小组赛骨架",
        },
        {
            "id": "odds",
            "label": "市场赔率",
            "status": "live" if payload.get("odds") else "estimated",
            "detail": f"{len(payload.get('odds') or {})} 场带赔率" if payload.get("odds") else "使用模型基线赔率",
        },
        {
            "id": "weather",
            "label": "天气",
            "status": "mixed",
            "detail": "赛前 72 小时使用 Open-Meteo，否则用球场气候基线",
        },
    ]
    if payload.get("status") == "error":
        payload["warnings"].append(payload.get("message") or "自动数据源异常")
    return payload


def attach_missing_weather_forecasts(payload, forecast_for_event):
    for event in payload.get("events", []):
        if "weatherForecast" not in event:
            event["weatherForecast"] = forecast_for_event(event)
    return payload
