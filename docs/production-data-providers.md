# Production data providers

## Listings: RentCast

The first production listing adapter uses RentCast’s sale-listing endpoint. It supports searches by city, state, or ZIP code and maps external records into the application’s `LiveListing` contract. `RENTCAST_API_KEY` is server-only and is never sent to the browser.

Before launch, select a plan that covers the expected search volume, document provider attribution, confirm coverage in each launch market, and configure key restrictions.

## Nearby places: Google Places

The nearby-place adapter uses Google Places Nearby Search with the home’s latitude and longitude. It requests only the name, address, location, and place type needed for the product. `GOOGLE_MAPS_API_KEY` stays server-only.

Before launch, enable billing, restrict the key to the backend, and follow Google Maps Platform attribution and storage requirements.

## Current fallback behavior

Until a provider key is configured, routes explicitly return `source: "sample"`. Provider errors return `503` with `source: "unavailable"`; the UI must keep the current sample experience rather than presenting stale or invented facts.
