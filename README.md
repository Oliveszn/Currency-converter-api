# Currency Converter API

A production-ready currency conversion service built with Node.js, TypeScript, and Express. This API aggregates real-time exchange rates from multiple sources to provide accurate currency conversions with intelligent rate selection and enterprise-grade caching.

## Project Overview

This currency converter service demonstrates enterprise-level API development with a focus on reliability, performance, and accuracy—critical requirements for fintech and remittance applications. By aggregating data from multiple exchange rate providers, the service ensures uptime and data accuracy even when individual providers experience issues.

## Why This Project Matters for Fintech

- Multi-source aggregation: Never rely on a single point of failure
- Intelligent rate selection: Automatically chooses the best rates for users
- Production-ready architecture: Implements industry best practices for scalable services
- Real-time data: Critical for accurate cross-border transactions
- Comprehensive testing: 70%+ code coverage with unit and integration tests

## Key Features

Core Functionality

- 170+ Supported Currencies - Comprehensive global coverage
- Real-time Exchange Rates - Live data from multiple providers
- Accurate Conversions - Cross-currency calculations with precision
- Rate Aggregation - Combines data from multiple APIs for reliability
- Best Rate Selection - Automatically selects optimal rates for users

## Enterprise Features

- Redis Caching - 12-hour cache for currencies, 5-minute for rates
- Rate Limiting - Prevents abuse with Redis-backed rate limiting
- Security Headers - Helmet.js for production-grade security
- Comprehensive Logging - Winston logger for monitoring and debugging
- Full Test Coverage - Unit and integration tests with Jest
- Health Checks - Monitor API and service availability
- API Versioning - Future-proof with URL versioning
- Error Handling - Graceful degradation when services fail

## Architecture

````md
```bash
┌─────────────────┐
│   Client App    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Express API (Port 3000)         │
│  ┌──────────────────────────────┐   │
│  │   Rate Limiting Middleware   │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │    Routes & Controllers      │   │
│  └──────────────────────────────┘   │
└────────┬───────────────┬────────────┘
         │               │
         ▼               ▼
┌─────────────┐   ┌──────────────┐
│    Redis    │   │   Services   │
│   Cache     │   │  Aggregator  │
└─────────────┘   └──────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌─────────┐
│ ExchangeRate │  │  Frankfurter │  │ Future  │
│     API      │  │      API     │  │  APIs   │
└──────────────┘  └──────────────┘  └─────────┘
```
````

## Design Patterns Implemented

- Service Layer Pattern: Separation of business logic from controllers
- Repository Pattern: Abstracted data access through services
- Factory Pattern: Test data generation for consistent testing
- Singleton Pattern: Shared Redis client instance
- Strategy Pattern: Flexible API integration approach

## Quick Start

Prerequisites

````md
```bash
Node.js >= 18.0.0
Redis >= 6.0.0
npm or yarn
```
````

## Installation

1. Clone the repository

````md
```bash
git clone https://github.com/Oliveszn/Currency-converter-api.git
cd currency-converter-api
```
````

2. Install dependencies

````md
```bash
npm install
```
````

## API Documentation

### Base URL

````md
```bash
http://localhost:3000/api/v1
```
````

### Endpoints

1. Get Supported Currencies
   Get a list of all supported currency codes and names.

````md
```bash
GET /currencies/supported
```
````

Response:

````md
```bash
{
  "success": true,
  "message": "Successfully retrieved supported currencies",
  "data": {
    "success": true,
    "count": 170,
    "currencies": {
      "USD": "United States Dollar",
      "EUR": "Euro",
      "GBP": "British Pound Sterling",
      "NGN": "Nigerian Naira",
      ...
    },
    "sources": ["exchangerate-api", "frankfurter"],
    "lastUpdated": "2024-01-05T10:30:00.000Z"
  }
}
```
````

2. Get Exchange Rates
   Get current exchange rates for all currencies (base: USD).

````md
```bash
GET /currencies/rates
```
````

Response:

````md
```bash
{
"success": true,
"message": "Successfully retrieved exchange rates",
"data": {
"success": true,
"baseCurrency": "USD",
"count": 170,
"rates": {
"USD": 1,
"EUR": 0.92,
"GBP": 0.79,
"NGN": 1600,
"JPY": 149.50,
...
},
"sources": ["exchangerate-api", "frankfurter"],
"lastUpdated": "2024-01-05T10:30:00.000Z"
}
}
```
````

3. Convert Currency
   Convert an amount from one currency to another.

````md
```bash
POST /currencies/convert
Content-Type: application/json
```
````

Request Body:

````md
```bash
{
  "amount": 100,
  "from": "USD",
  "to": "EUR"
}
```
````

Response:

````md
```bash
{
  "success": true,
  "message": "Currency conversion successful",
  "data": {
    "amount": 100,
    "from": "USD",
    "to": "EUR",
    "converted": 92,
    "rate": 0.92,
    "timestamp": "2024-01-05T10:30:00.000Z"
  }
}
```
````

### Validation Rules:

- amount: Must be a positive number between 0.01 and 1,000,000
- from: Valid 3-letter ISO 4217 currency code
- to: Valid 3-letter ISO 4217 currency code
- from and to must be different currencies
