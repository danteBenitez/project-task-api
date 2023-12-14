import { z } from 'zod';
import 'dotenv/config';

const configWithDBUrl = z.object({
    PORT: z.string(),
    DB: z.object({
        DIALECT: z.enum(['postgres', 'mysql', 'mariadb', 'sqlite', 'mssql']),
        URL: z.string().url().default('postgres://postgres:postgres@localhost:5432/postgres'),
        HAS_URL: z.literal(true)
    })
})

const configWithoutDBUrl = z.object({
    PORT: z.string(),
    DB: z.object({
        NAME: z.string(),
        USER: z.string(),
        PASSWORD: z.string(),
        HOST: z.string(),
        PORT: z.number(),
        HAS_URL: z.literal(false),
        DIALECT: z.enum(['postgres', 'mysql', 'mariadb', 'sqlite', 'mssql'])
    })
});

const configSchema = z.union([configWithDBUrl, configWithoutDBUrl]);

export default () => {
    const validated = configSchema.parse({
        PORT: process.env.PORT,
        DB: {
            URL: process.env.DB_URL,
            NAME: process.env.DB_NAME ?? 'projects-management',
            USER: process.env.DB_USER ?? 'postgres',
            PASSWORD: process.env.DB_PASSWORD ?? 'root',
            HOST: process.env.DB_HOST ?? 'localhost',
            PORT: process.env.DB_PORT ?? 5432,
            HAS_URL: !!process.env.DB_URL,
            DIALECT: process.env.DB_DIALECT ?? 'postgres'
        }
    });

    return validated;
}

export type ENVIRONMENT = typeof configSchema._output;