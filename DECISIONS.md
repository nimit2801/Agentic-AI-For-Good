# Decision Log

Track major decisions so future sessions (and future you) understand WHY something was done.

---

## March 17, 2026

### DECISION: Pivot from editorial storytelling to tool discovery platform
- **Context:** Original positioning was "stories of AI making real-world impact." Nice brand, hard to monetize.
- **Decision:** Primary product = curated AI tool directory + knowledge base. Editorial stories = secondary (adds soul).
- **Reasoning:** Solves a real daily pain point (builders wasting time researching tools). Clearer monetization (tools pay for GTM). Comparable platforms (Product Hunt, FutureTools) prove the model.
- **What stays:** Brand identity, illustration style, healthcare/impact stories (just not the highlight).
- **What changes:** Homepage, value prop messaging, need to build tool directory in Supabase.

### DECISION: Target India first, budget in INR
- **Context:** Nimit is based in India. Offline events are the growth differentiator.
- **Decision:** Focus on Indian professionals and students first. Budget ~₹5.5L for 6 months.
- **Reasoning:** Nobody else is doing IRL AI tool discovery events in India. College ambassador program is cheap + high reach. WhatsApp/Telegram communities scale well in India.

### DECISION: Revenue = tools paying for GTM, NOT selling distribution
- **Context:** Can't sell audience (don't have one yet). Can sell content creation + GTM services.
- **Decision:** Offer free listings + paid featured listings (₹15-30K/mo) + sponsored stories (₹40-80K) + event sponsorships.
- **Reasoning:** Value prop is association + content quality, not eyeballs. Distribution becomes valuable later (at 5K+ readers).

### DECISION: Grants before VCs
- **Context:** Content/media businesses are not venture-backable in early stage.
- **Decision:** Apply for grants first (Google.org, AWS, Mozilla). No equity dilution.
- **Reasoning:** "AI for good" positioning is exactly what grant programs fund. ₹50K-250K in grants is realistic. VCs later, only when data product has traction.

### DECISION: Keep HashRouter fix as #1 technical priority
- **Context:** Site uses react-router-dom HashRouter. URLs like `/#/stories/my-story` are invisible to Google.
- **Decision:** Migrate to BrowserRouter before investing in any content/SEO.
- **Reasoning:** All content investment is wasted if Google can't crawl the pages. Non-negotiable.
