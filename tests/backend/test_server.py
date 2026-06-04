import unittest
from datetime import datetime, timedelta, timezone

import server


class ServerMappingTests(unittest.TestCase):
    def test_team_aliases_cover_common_names(self):
        self.assertEqual(server.team_id("Mexico"), "mex")
        self.assertEqual(server.team_id("United States"), "usa")
        self.assertEqual(server.team_id("Czech Republic"), "cze")

    def test_american_odds_to_decimal(self):
        self.assertEqual(server.american_to_decimal("+150"), 2.5)
        self.assertEqual(server.american_to_decimal("-200"), 1.5)
        self.assertIsNone(server.american_to_decimal("bad"))

    def test_official_roster_fallback_shape(self):
        roster = server.official_team_roster("arg")
        self.assertEqual(roster["status"], "live")
        self.assertGreaterEqual(len(roster["athletes"]), 20)
        self.assertIn("nameZh", roster["athletes"][0])

    def test_weather_not_due_outside_72h_window(self):
        event = {
            "venue": "Estadio Banorte",
            "commenceTime": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat().replace("+00:00", "Z"),
        }
        payload = server.weather_forecast_for_event(event)
        self.assertEqual(payload["status"], "not_due")
        self.assertEqual(payload["mode"], "baseline")

    def test_enrich_payload_adds_source_status(self):
        payload = {"status": "live", "events": [{"matchId": "gA1"}], "odds": {"gA1": {"h2h": [1.8, 3.2, 4.0]}}}
        server.enrich_payload(payload)
        self.assertIn("sourceStatus", payload)
        self.assertEqual(payload["sourceStatus"][0]["id"], "schedule")


if __name__ == "__main__":
    unittest.main()
