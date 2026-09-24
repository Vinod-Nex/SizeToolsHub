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
        
        # -> Open the Data Storage page (navigate to /data or click the 'Data' link in the top navigation).
        await page.goto("http://localhost:4321/data")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Binary (1024 / IEC)' radio button, then open the 'Input Unit' dropdown.
        # Binary (1024 / IEC) button
        elem = page.get_by_role("radio", name="Binary (1024 / IEC)")
        await elem.click(timeout=10000)
        
        # -> Click the 'Binary (1024 / IEC)' radio button, then open the 'Input Unit' dropdown.
        # Bytes (B) Kilobytes (KB) / KiB Megabytes (MB) /... dropdown
        elem = page.get_by_label("Input Unit")
        await elem.click(timeout=10000)
        
        # -> Fill '1024' into the 'Enter Size Value' numeric input field and then read the 'Converted Result' / conversion panel to verify the binary conversion breakdown.
        # Enter data size value number field
        elem = page.get_by_role("spinbutton", name="Enter data size value")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("1024")
        
        # --> Assertions to verify final state
        
        # --> The data storage conversion panel is visible on the page.
        await page.get_by_role("tabpanel", name="Data Units & Disk Sizing").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The conversion panel (role=tabpanel) is visible on the Data page.
        await expect(page.get_by_role("tabpanel", name="Data Units & Disk Sizing").nth(0)).to_be_visible(timeout=15000), "The conversion panel (role=tabpanel) is visible on the Data page."
        
        # --> The conversion breakdown includes multiple storage unit rows (KiB, GiB/TiB) in the panel.
        # Assert-outcome: passed
        # Assert: The conversion panel includes a Kilobytes (KiB) label/row.
        await expect(page.get_by_label("Data Units & Disk Sizing").nth(0)).to_contain_text("KiB", timeout=15000), "The conversion panel includes a Kilobytes (KiB) label/row."
        # Assert-outcome: passed
        # Assert: The conversion panel includes a Gibibytes (GiB) row.
        await expect(page.get_by_label("Data Units & Disk Sizing").nth(0)).to_contain_text("GiB", timeout=15000), "The conversion panel includes a Gibibytes (GiB) row."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    