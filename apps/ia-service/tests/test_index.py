from ia_service import index


def test_index():
    assert index.hello() == "Hello ia-service"
