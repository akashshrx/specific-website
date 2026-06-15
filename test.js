const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

console.log("🚀 Starting Automated Test Suite for Specific Website...");

try {
  // 1. Verify index.html exists and is readable
  const htmlPath = path.join(__dirname, 'index.html');
  assert.ok(fs.existsSync(htmlPath), "index.html should exist");
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  console.log("✓ index.html exists and read successfully.");

  // 2. Verify Get Started button hook classes
  assert.ok(htmlContent.includes('js-get-started'), "Get started buttons should have the 'js-get-started' class");
  console.log("✓ Get Started buttons have 'js-get-started' trigger class.");

  // 3. Verify Prompt Modal exists and contains Claude Code, Cursor, Codex, and Other links
  assert.ok(htmlContent.includes('id="prompt-modal"'), "Prompt modal element should exist");
  assert.ok(htmlContent.includes('id="prompt-modal-content"'), "Prompt modal content box should exist");
  assert.ok(htmlContent.includes('Claude Code'), "Modal should refer to 'Claude Code'");
  assert.ok(htmlContent.includes('Cursor'), "Modal should refer to 'Cursor'");
  assert.ok(htmlContent.includes('Codex'), "Modal should refer to 'Codex'");
  assert.ok(htmlContent.includes('id="copy-other-btn"'), "Modal should have 'Other' copy button");
  assert.ok(htmlContent.includes('https://claude.ai/new?q=Help%20me%20get%20started%20with%20Specific%20by%20following%3A%20https%3A%2F%2Fdocs.specific.dev%2Ffor-ai%2Fonboarding'), "Modal should have correct Claude deep-link query");
  console.log("✓ Prompt Modal exists with correct agent deep links.");

  // 4. Verify "Ask AI About Specific" Widget exists in footer
  assert.ok(htmlContent.includes('Ask AI about Specific'), "Footer should contain 'Ask AI about Specific' header");
  assert.ok(htmlContent.includes('ChatGPT'), "Ask AI widget should include 'ChatGPT'");
  assert.ok(htmlContent.includes('Claude'), "Ask AI widget should include 'Claude'");
  assert.ok(htmlContent.includes('id="ask-gemini-btn"'), "Ask AI widget should include Gemini button");
  assert.ok(htmlContent.includes('Perplexity'), "Ask AI widget should include 'Perplexity'");
  assert.ok(htmlContent.includes('https://chatgpt.com/?q=I%E2%80%99m%20researching%20Specific.dev%20and%20want%20to%20know%20how%20they%20help%20coding%20agents%20deploy%2C%20help%20me%20breakdown%20their%20solution.%20Summarize%20the%20highlights%20from%20Specific%27s%20website%3A%20https%3A%2F%2Fwww.specific.dev'), "ChatGPT deep link is correct");
  assert.ok(htmlContent.includes('https://www.perplexity.ai/?q=I%E2%80%99m%20researching%20Specific.dev%20and%20want%20to%20know%20how%20they%20help%20coding%20agents%20deploy%2C%20help%20me%20breakdown%20their%20solution.%20Summarize%20the%20highlights%20from%20Specific%27s%20website%3A%20https%3A%2F%2Fwww.specific.dev'), "Perplexity deep link is correct");
  console.log("✓ 'Ask AI About Specific' Widget is correctly integrated in the footer.");

  // 5. Verify Consolidated Testimonial layout
  assert.ok(htmlContent.includes('Timothy Lindblom'), "Newly testimonial should be present");
  assert.ok(htmlContent.includes('1,200'), "Testimonial stats card should display '1,200'");
  assert.ok(htmlContent.includes('projects deployed / day'), "Testimonial stats should display 'projects deployed / day'");
  assert.ok(!htmlContent.includes('1,492/min'), "Active builds metric should be removed");
  assert.ok(!htmlContent.includes('124ms'), "Average latency metric should be removed");
  console.log("✓ Testimonial and Infrastructure Scale are consolidated, latency/active metrics are removed.");

  // 6. Verify Footer wordmark centered SVG layout
  assert.ok(htmlContent.includes('viewBox="34 0 181 44"'), "Centered footer logo should be SVG wordmark");
  assert.ok(htmlContent.includes('aspect-ratio: 181 / 30.8;'), "Wordmark should have aspect ratio cropping bottom 30%");
  console.log("✓ Footer centers brand wordmark is SVG, scaled and cropped at 30%.");

  // 7. Verify Hero Product Image hover border classes
  assert.ok(htmlContent.includes('hero-product-image-wrap'), "Hero image wrapper should have class 'hero-product-image-wrap'");
  console.log("✓ Hero product image container contains wrapper class.");

  // 8. Verify compiled style.css rules
  const cssPath = path.join(__dirname, 'style.css');
  assert.ok(fs.existsSync(cssPath), "style.css should exist");
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(cssContent.includes('.float-logo'), "style.css should include float-logo styles");
  assert.ok(cssContent.includes('.hero-product-image-wrap'), "style.css should include hero-product-image-wrap styles");
  assert.ok(cssContent.includes('borderGlowFlow'), "style.css should include borderGlowFlow keyframe animation");
  console.log("✓ compiled style.css contains correct border glow classes.");

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
} catch (error) {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
}
