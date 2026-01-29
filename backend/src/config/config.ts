export const config = {
    PORT: process.env.PORT || 3000,
    SMTP: {
        HOST: process.env.SMTP_HOST || '',
        PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        USER: process.env.SMTP_USER || '',
        PASS: process.env.SMTP_PASS || '',
    }
}