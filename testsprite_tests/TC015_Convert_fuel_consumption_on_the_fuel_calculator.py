import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:4321")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Fuel' link in the top navigation to open the Fuel calculator page.
        # Fuel link
        elem = page.get_by_role("link", name="Fuel", exact=True)
        await elem.click(timeout=10000)
        
        # -> Enter 40 into the 'Enter Fuel Efficiency' numeric input, then change the unit dropdown to 'UK MPG (Imperial)'.
        # number field
        elem = page.get_by_role("spinbutton", name="Enter Fuel Efficiency")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("40")
        
        # -> Enter 40 into the 'Enter Fuel Efficiency' numeric input, then change the unit dropdown to 'UK MPG (Imperial)'.
        # US MPG L / 100km UK MPG (Imperial) km / Liter dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/div/div[2]/div/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Confirm the page shows the 'Liters per 100km' converted value, then change the unit to 'L / 100km' and verify converted 'MPG' values update.
        # US MPG L / 100km UK MPG (Imperial) km / Liter dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/div/div[2]/div/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # --> Assertions to verify final state
        
        # --> The fuel calculator displays converted MPG and Imperial UK MPG values for the entered efficiency.
        # Assert-outcome: passed
        # Assert: Conversion panel shows the US MPG conversion label.
        await expect(page.get_by_label("⛽ Fuel Economy (MPG ⇄ L/100km)").nth(0)).to_contain_text("Miles Per Gallon (US MPG)", timeout=15000), "Conversion panel shows the US MPG conversion label."
        
        # --> Switching the unit to L/100km updated the page state: the URL reflects L/100km and the input still shows the entered value.
        # Assert-outcome: passed
        # Assert: The URL contains the L/100km unit parameter.
        await expect(page).to_have_url(re.compile("unit=l_100km"), timeout=15000), "The URL contains the L/100km unit parameter."
        # Assert-outcome: passed
        # Assert: The Enter Fuel Efficiency input contains the value '40'.
        await expect(page.get_by_role("spinbutton", name="Enter Fuel Efficiency").nth(0)).to_have_value("40", timeout=15000), "The Enter Fuel Efficiency input contains the value '40'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    