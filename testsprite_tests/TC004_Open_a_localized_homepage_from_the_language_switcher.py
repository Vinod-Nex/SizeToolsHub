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
        
        # -> Scroll down the homepage to reveal the footer and look for a language switcher or locale links.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll further down the homepage to reveal the footer and locate any language switcher or locale links.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Español' language link in the footer to switch the site to Spanish.
        # Español link
        elem = page.get_by_role("link", name="Español")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The browser navigated to the Spanish homepage (URL contains /es/).
        # Assert-outcome: passed
        # Assert: URL contains '/es/' indicating the Spanish localized homepage.
        await expect(page).to_have_url(re.compile("/es/"), timeout=15000), "URL contains '/es/' indicating the Spanish localized homepage."
        
        # --> Translated Spanish UI text is visible on the page (example: 'Conversor Rápido').
        # Assert-outcome: passed
        # Assert: The header link displays the Spanish text 'Conversor Rápido'.
        await expect(page.locator("xpath=/html/body/header/div[1]/nav/div[2]/a").nth(0)).to_have_text("Conversor R\u00e1pido", timeout=15000), "The header link displays the Spanish text 'Conversor R\u00e1pido'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    