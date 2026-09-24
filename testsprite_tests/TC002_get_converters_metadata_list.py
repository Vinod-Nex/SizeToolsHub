import requests
import sys

BASE_URL = "http://localhost:4321"
TIMEOUT = 30  # seconds

def test_get_converters_metadata_list_TC002():
    """
    TC002 - get converters metadata list
    Verify that a GET request to /api/converters.json returns a 200 status code
    with a list of available conversion tools, categories, and default units in the response body.
    """
    url = f"{BASE_URL}/api/converters.json"
    try:
        resp = requests.get(url, timeout=TIMEOUT)
    except requests.exceptions.RequestException as e:
        raise AssertionError(f"Request to {url} failed: {e}")

    # Check HTTP status code
    assert resp.status_code == 200, f"Expected status code 200, got {resp.status_code}. Response text: {resp.text}"

    # Parse JSON
    try:
        data = resp.json()
    except ValueError as e:
        raise AssertionError(f"Response is not valid JSON: {e}. Response text: {resp.text}")

    # Response must be an object/dict
    assert isinstance(data, dict), f"Expected JSON object at top level, got {type(data).__name__}: {data}"

    # Helper to find possible key variants
    def find_key(d, candidates):
        for k in candidates:
            if k in d:
                return k
        return None

    # Expected elements and their likely key names
    converters_key = find_key(data, ["converters", "tools", "items", "converterList", "converter_list"])
    categories_key = find_key(data, ["categories", "categoryList", "category_list"])
    defaults_key = find_key(data, ["defaultUnits", "default_units", "defaults", "defaultUnit", "defaults_units"])

    # Assert presence of keys
    assert converters_key is not None, f"Response JSON missing converters list. Keys found: {list(data.keys())}"
    assert categories_key is not None, f"Response JSON missing categories. Keys found: {list(data.keys())}"
    assert defaults_key is not None, f"Response JSON missing default units. Keys found: {list(data.keys())}"

    # Validate converters structure
    converters = data[converters_key]
    assert isinstance(converters, list), f"Expected '{converters_key}' to be a list, got {type(converters).__name__}"
    assert len(converters) > 0, f"Expected at least one converter in '{converters_key}', got 0"

    # Validate categories structure
    categories = data[categories_key]
    assert isinstance(categories, (list, dict)), f"Expected '{categories_key}' to be list or dict, got {type(categories).__name__}"
    # If list, ensure non-empty. If dict, ensure has at least one entry.
    if isinstance(categories, list):
        assert len(categories) > 0, f"Expected at least one category in '{categories_key}', got 0"
    else:
        assert len(categories.keys()) > 0, f"Expected at least one category in '{categories_key}', got 0 keys"

    # Validate default units structure
    defaults = data[defaults_key]
    assert isinstance(defaults, (dict, list)), f"Expected '{defaults_key}' to be dict or list, got {type(defaults).__name__}"
    if isinstance(defaults, dict):
        assert len(defaults) > 0, f"Expected non-empty default units in '{defaults_key}'"
    else:
        assert len(defaults) > 0, f"Expected non-empty default units list in '{defaults_key}'"

    # Additional content checks: each converter should have at least a name and category or unit info
    for idx, conv in enumerate(converters[:10]):  # check up to first 10 entries
        assert isinstance(conv, dict), f"Converter at index {idx} is not an object: {conv}"
        # acceptable key names for name and category/unit
        name_key = find_key(conv, ["name", "id", "title", "label"])
        cat_key = find_key(conv, ["category", "categoryId", "group", "type"])
        unit_keys_found = find_key(conv, ["defaultUnit", "default_unit", "units", "unit"])
        assert name_key is not None, f"Converter at index {idx} missing name/title. Converter: {conv}"
        # At least one of category or unit info should be present
        assert (cat_key is not None) or (unit_keys_found is not None), f"Converter at index {idx} missing category and unit info. Converter: {conv}"

    print("TC002 passed: /api/converters.json returned 200 and valid converters metadata structure.")

if __name__ == "__main__":
    try:
        test_get_converters_metadata_list_TC002()
    except AssertionError as e:
        print(f"TEST FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"UNEXPECTED ERROR: {e}")
        sys.exit(2)
    print("TEST SUCCEEDED")
    sys.exit(0)