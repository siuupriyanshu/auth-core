export const config = {
    PORT: process.env.PORT || 3001,
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    SMTP: {
        HOST: process.env.SMTP_HOST || '',
        PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        USER: process.env.SMTP_USER || '',
        PASS: process.env.SMTP_PASS || '',
    },
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
}