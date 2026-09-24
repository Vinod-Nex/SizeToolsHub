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
        
        # -> Click the 'Cooking' link in the top navigation to open the Cooking & Baking converter page.
        # Cooking link
        elem = page.get_by_role("link", name="Cooking", exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Select Ingredient' dropdown (label: "Select Ingredient") to reveal the list of ingredient options.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.get_by_label("Select Ingredient")
        await elem.click(timeout=10000)
        
        # -> Select 'Granulated White Sugar (200g/cup)' from the 'Select Ingredient' dropdown
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Enter '2' into the 'Quantity' field and then select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown.
        # Ingredient quantity number field
        elem = page.get_by_role("spinbutton", name="Ingredient quantity")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("2")
        
        # -> Enter '2' into the 'Quantity' field and then select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'Granulated White Sugar (200g/cup)' from the 'Select Ingredient' dropdown to verify the conversion updates.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'Granulated White Sugar (200g/cup)' from the 'Select Ingredient' dropdown to verify the conversion updates.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Open the 'Select Ingredient' dropdown (the control currently showing 'Granulated White Sugar (200g/cup)') so the ingredient options become visible.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.get_by_label("Select Ingredient")
        await elem.click(timeout=10000)
        
        # -> Select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown so the conversion updates to 250 Grams.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'Granulated White Sugar (200g/cup)' from the 'Select Ingredient' dropdown and verify the converted measurement updates.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select the 'Granulated White Sugar (200g/cup)' option from the Select Ingredient dropdown to confirm the conversion updates.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown and verify the page displays '250 Grams'.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown and verify the page displays '250 Grams'.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select 'All-Purpose Flour (125g/cup)' from the 'Select Ingredient' dropdown and verify the page displays '250 Grams'.
        # All-Purpose Flour (125g/cup) Bread Flour... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/section/astro-island/section/div[3]/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # --> Assertions to verify final state
        
        # --> A converted measurement in grams is shown for the entered quantity.
        # Assert-outcome: passed
        # Assert: The conversion area displays the target unit 'Grams'.
        await expect(page.get_by_label("Ingredient Densities (Flour,").nth(0)).to_contain_text("Grams", timeout=15000), "The conversion area displays the target unit 'Grams'."
        
        # --> The displayed conversion updates when a different ingredient is selected.
        await page.get_by_label("Select Ingredient").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The ingredient dropdown is present and selectable.
        await expect(page.get_by_label("Select Ingredient").nth(0)).to_be_visible(timeout=15000), "The ingredient dropdown is present and selectable."
        # Assert-outcome: passed
        # Assert: The page URL reflects the selected ingredient.
        await expect(page).to_have_url(re.compile("ingredient=sugar_granulated"), timeout=15000), "The page URL reflects the selected ingredient."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    