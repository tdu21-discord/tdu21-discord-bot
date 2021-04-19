declare namespace NodeJS {
  interface ProcessEnv {
    readonly ENV: 'development' | 'production';
    readonly DISCORD_BOT_TOKEN: string;
    readonly LOGDNA_TOKEN?: string;
    readonly LOGDNA_APP?: string;
    readonly SENDGRID_API_KEY: string;
    readonly SENDGRID_FROM_EMAIL: string;
    readonly SENDGRID_FROM_NAME: string;
    readonly DENDAI_EMAIL_DOMAIN: string;
    readonly DB_HOST: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_DATABASE: string;
    readonly STUDENT_ID_VERIFY_MAX: string;
  }
}