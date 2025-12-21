import { chromium } from 'playwright';

const run = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Navigating to booking page...');
  await page.goto('http://localhost:3000/book/374');
  await page.waitForTimeout(2000);

  // Check if we need to log in
  const url = page.url();
  if (url.includes('login') || url.includes('auth')) {
    console.log('2. Need to login first...');

    // Try to register a new user
    const registerLink = await page.$('text=Sign up');
    if (registerLink) {
      await registerLink.click();
      await page.waitForTimeout(1000);
    }

    // Fill registration form
    const timestamp = Date.now();
    await page.fill('input[name="firstName"], input[placeholder*="First"]', 'Stripe');
    await page.fill('input[name="lastName"], input[placeholder*="Last"]', 'Tester');
    await page.fill('input[name="email"], input[type="email"]', `stripetest${timestamp}@test.com`);
    await page.fill('input[name="password"], input[type="password"]', 'Test123!');

    // Click register/submit button
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }

    // Navigate back to booking page
    await page.goto('http://localhost:3000/book/374');
    await page.waitForTimeout(2000);
  }

  console.log('3. On booking page, filling form...');

  // Wait for the property to load
  await page.waitForSelector('text=Complete Your Booking', { timeout: 10000 }).catch(() => {
    console.log('Booking form not found, taking screenshot...');
  });

  // Take screenshot
  await page.screenshot({ path: '/tmp/checkout-step1.png' });
  console.log('Screenshot saved to /tmp/checkout-step1.png');

  // The date should be pre-filled, just click continue
  const continueBtn = await page.$('button:has-text("Continue to Payment")');
  if (continueBtn) {
    console.log('4. Clicking Continue to Payment...');
    await continueBtn.click();
    await page.waitForTimeout(5000);
  }

  // Take screenshot of redirect
  await page.screenshot({ path: '/tmp/checkout-step2.png' });
  console.log('Screenshot saved to /tmp/checkout-step2.png');

  // Check if we're on Stripe
  const currentUrl = page.url();
  console.log('5. Current URL:', currentUrl);

  if (currentUrl.includes('stripe.com') || currentUrl.includes('checkout.stripe.com')) {
    console.log('6. On Stripe Checkout! Filling payment details...');

    // Wait for Stripe form to load
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/checkout-stripe.png' });

    // Fill email if needed
    const emailInput = await page.$('input[name="email"]');
    if (emailInput) {
      await emailInput.fill('stripetest@test.com');
    }

    // Fill card number
    const cardFrame = page.frameLocator('iframe[name*="card"]').first();
    const cardInput = await page.$('input[name="cardNumber"]');
    if (cardInput) {
      await cardInput.fill('4242424242424242');
    } else {
      // Try direct input
      await page.fill('input[placeholder*="1234"]', '4242424242424242').catch(() => {});
    }

    // Fill expiry
    await page.fill('input[name="cardExpiry"], input[placeholder*="MM"]', '12/30').catch(() => {});

    // Fill CVC
    await page.fill('input[name="cardCvc"], input[placeholder*="CVC"]', '123').catch(() => {});

    // Fill name
    await page.fill('input[name="billingName"], input[placeholder*="name"]', 'Stripe Tester').catch(() => {});

    await page.screenshot({ path: '/tmp/checkout-stripe-filled.png' });

    // Click pay button
    const payBtn = await page.$('button[type="submit"], button:has-text("Pay")');
    if (payBtn) {
      console.log('7. Clicking Pay button...');
      await payBtn.click();
      await page.waitForTimeout(10000);
    }

    await page.screenshot({ path: '/tmp/checkout-complete.png' });
    console.log('8. Final URL:', page.url());
  }

  console.log('Test complete! Check screenshots in /tmp/');

  // Keep browser open for manual inspection
  await page.waitForTimeout(30000);
  await browser.close();
};

run().catch(console.error);
