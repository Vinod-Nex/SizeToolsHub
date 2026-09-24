import requests
import sys
from requests.exceptions import RequestException

BASE_URL = "http://localhost:4321"
TIMEOUT = 30


def _find_key_recursive(obj, candidate_keys):
    """
    Search nested dict/list structures for the first occurrence of any key in candidate_keys.
    Returns a tuple (found_key, value) or (None, None) if not found.
    """
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in candidate_keys:
                return k, v
            found_key, found_val = _find_key_recursive(v, candidate_keys)
            if found_key is not None:
                return found_key, found_val
    elif isinstance(obj, list):
        for item in obj:
            found_key, found_val = _find_key_recursive(item, candidate_keys)
            if found_key is not None:
                return found_key, found_val
    return None, None


def test_get_health_check_status_TC001():
    url = f"{BASE_URL}/api/health.json"
    try:
        resp = requests.get(url, timeout=TIMEOUT)
    except RequestException as e:
        raise AssertionError(f"Request to {url} failed: {e}")

    # Basic HTTP assertions
    assert resp.status_code == 200, f"Expected status code 200, got {resp.status_code}. Body: {resp.text!r}"
    content_type = resp.headers.get("Content-Type", "")
    assert "application/json" in content_type or resp.text.strip().startswith("{"), (
        f"Expected JSON response (Content-Type includes application/json), got Content-Type: {content_type!r}"
    )

    # Parse JSON
    try:
        data = resp.json()
    except ValueError as e:
        raise AssertionError(f"Response body is not valid JSON: {e}. Body: {resp.text!r}")

    assert isinstance(data, (dict, list)), f"Expected JSON object or array, got {type(data)}"

    # Define possible key candidates based on PRD: operational status, application name, and version
    status_keys = {"status", "health", "operational", "state"}
    app_name_keys = {"app", "appName", "application", "name"}
    version_keys = {"version", "appVersion", "ver"}

    found_status_key, status_val = _find_key_recursive(data, status_keys)
    found_app_key, app_val = _find_key_recursive(data, app_name_keys)
    found_version_key, version_val = _find_key_recursive(data, version_keys)

    assert found_status_key is not None, (
        f"Health response missing operational status key. Expected one of {sorted(status_keys)}. Full response: {data}"
    )
    assert found_app_key is not None, (
        f"Health response missing application name key. Expected one of {sorted(app_name_keys)}. Full response: {data}"
    )
    assert found_version_key is not None, (
        f"Health response missing version key. Expected one of {sorted(version_keys)}. Full response: {data}"
    )

    # Validate values are non-empty
    assert status_val is not None and (not (isinstance(status_val, str) and status_val.strip() == "")), (
        f"Operational status value for key '{found_status_key}' is empty or null."
    )
    assert app_val is not None and (not (isinstance(app_val, str) and app_val.strip() == "")), (
        f"Application name value for key '{found_app_key}' is empty or null."
    )
    assert version_val is not None and (not (isinstance(version_val, str) and version_val.strip() == "")), (
        f"Version value for key '{found_version_key}' is empty or null."
    )

    # Optionally check that status indicates healthy if it's a string
    healthy_indicators = {"ok", "healthy", "up", "operational", "running"}
    if isinstance(status_val, str):
        sv = status_val.strip().lower()
        assert sv in healthy_indicators or len(sv) > 0, (
            f"Operational status '{status_val}' is unexpected. Expected one of {sorted(healthy_indicators)} or a non-empty status."
        )

    print("TC001 passed: health endpoint returned 200 and contains operational status, application name, and version.")


if __name__ == "__main__":
    try:
        test_get_health_check_status_TC001()
    except AssertionError as e:
        print(f"TEST FAILED: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"UNEXPECTED ERROR: {e}", file=sys.stderr)
        sys.exit(2)
    else:
        sys.exit(0)