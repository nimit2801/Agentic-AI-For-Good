<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project with PostHog analytics. A prior session set up the core infrastructure (instrumentation, reverse proxy, server client, and 14 events across 8 files). This session extended the integration with 8 additional events across 7 files — covering homepage conversion, story page lead capture, tool card click tracking, server-side churn, server-side MCP API usage, pricing filter engagement, and MCP contribute CTA clicks. A new PostHog dashboard with 5 business-critical insights was also created.

## Events added this session

| Event | Description | File |
|---|---|---|
| `newsletter_subscribed` | Homepage newsletter form submission success | `src/sections/JoinMovement.tsx` |
| `newsletter_subscribe_failed` | Homepage newsletter form submission error | `src/sections/JoinMovement.tsx` |
| `newsletter_subscribed` | Story page 'Be Part of the Story' form submission | `src/views/Story.tsx` |
| `tool_card_clicked` | Tool card clicked in grid or featured section | `src/components/ToolCard.tsx` |
| `newsletter_unsubscribed` | Server-side churn event when user unsubscribes | `src/app/api/unsubscribe/route.ts` |
| `mcp_tool_called` | Server-side MCP API tool invocation (search_tools, get_tool_detail, suggest_for_stack, whats_new) | `src/app/api/mcp/route.ts` |
| `tools_pricing_filtered` | User applied a pricing filter on the Browse Tools page | `src/views/Tools.tsx` |
| `mcp_contribute_clicked` | User clicked the 'Add It Via GitHub PR' CTA on the MCP page | `src/views/MCPPage.tsx` |

## All events instrumented (combined)

| Event | Description | File |
|---|---|---|
| `newsletter_subscribed` | New newsletter subscriber (client + server-side) | `src/components/SubscribeWidget.tsx`, `src/sections/JoinMovement.tsx`, `src/views/Story.tsx`, `src/app/api/subscribe/route.ts` |
| `newsletter_subscribe_failed` | Newsletter subscription error | `src/components/SubscribeWidget.tsx`, `src/sections/JoinMovement.tsx` |
| `newsletter_unsubscribed` | User unsubscribed (server-side churn) | `src/app/api/unsubscribe/route.ts` |
| `tool_card_clicked` | Tool card click in browse/featured grid | `src/components/ToolCard.tsx` |
| `tool_searched` | User clicked "View all results" after searching | `src/components/ToolSearchBar.tsx` |
| `tool_search_result_clicked` | User clicked a result in the search dropdown | `src/components/ToolSearchBar.tsx` |
| `tool_website_clicked` | User visited a tool's website | `src/views/ToolDetail.tsx` |
| `tool_github_clicked` | User opened a tool's GitHub repo | `src/views/ToolDetail.tsx` |
| `tool_docs_clicked` | User opened a tool's docs | `src/views/ToolDetail.tsx` |
| `tool_install_copied` | User copied the install command | `src/views/ToolDetail.tsx` |
| `tools_category_filtered` | Category filter selected on Browse Tools | `src/views/Tools.tsx` |
| `tools_pricing_filtered` | Pricing filter applied on Browse Tools | `src/views/Tools.tsx` |
| `contribute_guide_clicked` | Contribution guide link clicked | `src/views/Tools.tsx` |
| `mcp_config_copied` | MCP config snippet copied | `src/views/MCPPage.tsx` |
| `mcp_tab_changed` | Install tab switched on MCP page | `src/views/MCPPage.tsx` |
| `mcp_contribute_clicked` | MCP page contribute CTA clicked | `src/views/MCPPage.tsx` |
| `mcp_tool_called` | MCP API tool invoked by a developer | `src/app/api/mcp/route.ts` |
| `admin_signed_in` | Admin authenticated (also calls posthog.identify) | `src/views/AdminLogin.tsx` |

---

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1600655)
- [Newsletter Subscriptions Over Time](/insights/OHtXcO7T) — daily subscriptions broken down by source
- [Newsletter Churn — Unsubscribes](/insights/wD8N3mUM) — server-side unsubscribe events to monitor churn
- [Tool Discovery Funnel](/insights/0i0RoCxL) — conversion from tool card click → external link click
- [MCP Tool Usage by Tool Name](/insights/CKrHWTBV) — which MCP tools developers call most
- [Tool Engagement — Clicks & Actions](/insights/8fNpO7Wg) — weekly trend of card clicks, website visits, GitHub opens, and install copies

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
