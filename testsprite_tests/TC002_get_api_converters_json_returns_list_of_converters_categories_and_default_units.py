import requests

def test_get_converters_metadata():
    base_url = "http://localhost:4321"
    timeout = 30

    # Health check prerequisite
    health_url = f"{base_url}/api/health.json"
    try:
        r = requests.get(health_url, timeout=timeout)
    except requests.RequestException as e:
        raise AssertionError(f"Health check request failed: {e}")
    assert r.status_code == 200, f"Health endpoint returned {r.status_code}: {r.text}"
    try:
        health_json = r.json()
    except ValueError:
        raise AssertionError("Health response is not valid JSON")
    if not any(k in health_json for k in ("status", "ok", "healthy")):
        raise AssertionError(f"Health JSON missing status key, got keys: {list(health_json.keys())}")
    if not any(k in health_json for k in ("app", "appName", "name", "application")):
        raise AssertionError(f"Health JSON missing app name key, got keys: {list(health_json.keys())}")
    if not any(k in health_json for k in ("version", "ver")):
        raise AssertionError(f"Health JSON missing version key, got keys: {list(health_json.keys())}")

    # Converters metadata endpoint
    conv_url = f"{base_url}/api/converters.json"
    try:
        r2 = requests.get(conv_url, timeout=timeout)
    except requests.RequestException as e:
        raise AssertionError(f"Converters request failed: {e}")
    assert r2.status_code == 200, f"Converters endpoint returned {r2.status_code}: {r2.text}"
    try:
        conv_json = r2.json()
    except ValueError:
        raise AssertionError("Converters response is not valid JSON")

    def _has_default_unit(obj):
        return any(k in obj for k in ("defaultUnit", "default_unit", "default"))

    def _has_category(obj):
        return any(k in obj for k in ("category", "categories", "group"))

    if isinstance(conv_json, list):
        assert len(conv_json) > 0, "Converters list is empty"
        first = conv_json[0]
        assert isinstance(first, dict), "Converters list elements must be objects"
        if not _has_category(first):
            raise AssertionError(f"Converter item missing category key, keys: {list(first.keys())}")
        if not _has_default_unit(first):
            raise AssertionError(f"Converter item missing default unit key, keys: {list(first.keys())}")
    elif isinstance(conv_json, dict):
        # Common shapes: { "converters": [ ... ] } or { "category": [ ... ], ... }
        if any(k in conv_json for k in ("converters", "items", "tools")):
            key = next(k for k in ("converters", "items", "tools") if k in conv_json)
            items = conv_json[key]
            assert isinstance(items, list) and len(items) > 0, f"'{key}' must be a non-empty list"
            first = items[0]
            assert isinstance(first, dict)
            if not _has_category(first):
                raise AssertionError(f"Converter item missing category key, keys: {list(first.keys())}")
            if not _has_default_unit(first):
                raise AssertionError(f"Converter item missing default unit key, keys: {list(first.keys())}")
        else:
            # Possibly a mapping of categories to lists of converters
            list_values = [v for v in conv_json.values() if isinstance(v, list) and len(v) > 0]
            assert len(list_values) > 0, f"Converters JSON dict doesn't contain list values, keys: {list(conv_json.keys())}"
            found = False
            for lst in list_values:
                item = lst[0]
                if isinstance(item, dict) and _has_default_unit(item) and _has_category(item):
                    found = True
                    break
                if isinstance(item, dict) and _has_default_unit(item):
                    found = True
                    break
            assert found, "No converter item with default unit metadata found in values"
    else:
        raise AssertionError("Converters JSON must be an object or array")

    print("TC002 passed: converters metadata endpoint returned expected structure")

if __name__ == "__main__":
    test_get_converters_metadata()