# Changelog

All notable changes to AI Insight Engine will be documented in this file.

## [2.0.0] - 2025-07-10 (En cours)

### 🎉 Added
- Complete React + TypeScript frontend migration
- 5 AI analysis types (sentiment, entities, key phrases, language, classification)
- Interactive code viewer with copy-paste ready examples
- Multi-language support (English & French)
- Rate limiting and cost protection system
- Modern responsive design with Tailwind CSS
- Session-based usage tracking
- Intelligent result caching (5 minutes)
- Text length validation (10-5000 characters)
- Mobile-first responsive design
- Professional error handling

### 🔄 Changed
- Migrated from vanilla HTML/CSS/JS to React + TypeScript
- Unified API endpoint for all analysis types
- Improved performance with component-based architecture
- Enhanced UX with loading states and progress indicators
- Better error messages and user feedback

### 🛡️ Security
- Implemented rate limiting per IP and session
- Added request cooldown protection
- Text length validation to prevent abuse
- Intelligent caching to reduce API costs

### 🐛 Fixed
- Mobile responsiveness issues
- API error handling improvements
- Performance bottlenecks resolved
- Cost management vulnerabilities patched

## [1.0.0] - 2025-06-30

### 🎉 Added
- Initial release with basic sentiment analysis
- Support for AWS, Azure, and Google Cloud
- Basic HTML/CSS/JS frontend
- Simple API integration with nodejs typescript
- Manual text input
- Results display for all three providers