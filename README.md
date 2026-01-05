# Currency Converter API

A production-ready currency conversion service built with Node.js, TypeScript, and Express. This API aggregates real-time exchange rates from multiple sources to provide accurate currency conversions with intelligent rate selection and enterprise-grade caching.

# Project Overview

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

┌─────────────────┐
│ Client App │
└────────┬────────┘
│
▼
┌─────────────────────────────────────┐
│ Express API (Port 3000) │
│ ┌──────────────────────────────┐ │
│ │ Rate Limiting Middleware │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Routes & Controllers │ │
│ └──────────────────────────────┘ │
└────────┬───────────────┬────────────┘
│ │
▼ ▼
┌─────────────┐ ┌──────────────┐
│ Redis │ │ Services │
│ Cache │ │ Aggregator │
└─────────────┘ └──────┬───────┘
│
┌────────────────┼────────────────┐
▼ ▼ ▼
┌──────────────┐ ┌──────────────┐ ┌─────────┐
│ ExchangeRate │ │ Frankfurter │ │ Future │
│ API │ │ API │ │ APIs │
└──────────────┘ └──────────────┘ └─────────┘
