import requests
import sys

BASE_URL = "http://localhost:4321"
TIMEOUT = 30


def find_value_by_variants(obj, variants):
    """
    Recursively search for a key matching any of the variants (case-insensitive)
    and return its value. Returns None if not found.
    """
    if isinstance(obj, dict):
        # direct key match (case-insensitive)
        lower_variants = [v.lower() for v in variants]
        for k, v in obj.items():
            if k.lower() in lower_variants:
                return v
        # recurse into values
        for v in obj.values():
            res = find_value_by_variants(v, variants)
            if res is not None:
                return res
    elif isinstance(obj, list):
        for item in obj:
            res = find_value_by_variants(item, variants)
            if res is not None:
                return res
    return None


def test_get_api_health_json_returns_operational_status_app_name_and_version():
    url = f"{BASE_URL}/api/health.json"
    headers = {"Accept": "application/json"}
    try:
        resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.exceptions.RequestException as e:
        raise AssertionError(f"HTTP request to {url} failed: {e}")

    assert resp.status_code == 200, f"Expected HTTP 200 from {url}, got {resp.status_code}. Response body: {resp.text}"

    content_type = resp.headers.get("Content-Type", "")
    if "application/json" not in content_type:
        # allow JSON-like bodies even if content-type is missing/misconfigured
        text_preview = resp.text.strip()[:200]
        assert resp.text.strip().startswith("{") or resp.text.strip().startswith("["), (
            f"Response does not appear to be JSON. Content-Type: {content_type}. Body starts with: {text_preview}"
        )

    try:
        data = resp.json()
    except ValueError as e:
        raise AssertionError(f"Response body is not valid JSON: {e}. Raw body: {resp.text}")

    # Look for status, app name, and version anywhere in the JSON structure
    status_value = find_value_by_variants(data, ["status", "health", "operational", "state"])
    name_value = find_value_by_variants(data, ["name", "appName", "app", "application", "applicationName"])
    version_value = find_value_by_variants(data, ["version", "ver", "appVersion"])

    assert status_value is not None, f"Health status key not found in response JSON. Keys: {list(data.keys()) if isinstance(data, dict) else 'non-dict root'}"
    assert name_value is not None, f"Application name key not found in response JSON. Keys: {list(data.keys()) if isinstance(data, dict) else 'non-dict root'}"
    assert version_value is not None, f"Version key not found in response JSON. Keys: {list(data.keys()) if isinstance(data, dict) else 'non-dict root'}"

    # Validate status indicates healthy/operational
    status_str = str(status_value).lower()
    healthy_indicators = ["ok", "operational", "healthy", "up", "running"]
    assert any(ind in status_str for ind in healthy_indicators), f"Status value does not indicate healthy/operational: {status_value}"

    # Validate name is a non-empty string
    assert isinstance(name_value, (str,)), f"App name should be a string, got: {type(name_value).__name__}"
    assert name_value.strip(), "App name is empty"

    # Validate version is present and non-empty when converted to string
    assert version_value is not None, "Version value is null"
    assert str(version_value).strip(), f"Version value is empty or invalid: {version_value}"

    print("TC001 passed: /api/health.json returned operational status, app name, and version.")


if __name__ == "__main__":
    try:
        test_get_api_health_json_returns_operational_status_app_name_and_version()
    except AssertionError as e:
        print(f"TC001 FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"TC001 ERROR: Unexpected exception: {e}")
        sys.exit(2)
    sys.exit(0)