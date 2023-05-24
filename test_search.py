import pytest
from selenium import webdriver


@pytest.fixture(scope="module")
def driver():
    # Initialize the Selenium webdriver
    driver = webdriver.Chrome()  # You may need to install the appropriate driver for your browser

    yield driver

    # Teardown - close the browser
    driver.quit()


def test_search(driver):
    driver.get("D:\Studies\Zewail City\CIE 5 - Spring\Stock-Analysis-Website\apps\templates\home\main-dashboard.html")  # Replace with the path to your HTML file

    # Perform search for the term "sample"
    search_input = driver.find_element_by_id("search-input")
    search_input.send_keys("sample")

    search_form = driver.find_element_by_id("search-form")
    search_form.submit()

    # Retrieve the matching elements
    matched_elements = driver.find_elements_by_css_selector("p[style*='background-color: yellow']")

    # Assertion: Ensure that there are matching elements
    assert len(matched_elements) > 0


if __name__ == "__main__":
    pytest.main(["-v", "--html=report.html"])
